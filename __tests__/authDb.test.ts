/**
 * @jest-environment node
 */
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import NextAuth, { NextAuthOptions } from "next-auth";
import { getZoomAccessToken, getZoomUser } from "@/lib/auth";

// Capture the options the route passes to NextAuth so authorize() can be called directly.
jest.mock("next-auth", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("../lib/auth", () => ({
  getZoomAccessToken: jest.fn(),
  getZoomUser: jest.fn(),
}));

const EMAIL = "zoom-user@example.com";

// lib/db reads DATABASE_URL at import time, so modules are imported after the
// in-memory MongoDB is up. We own the server so afterAll can stop it.
let mongoServer: MongoMemoryServer;
let UserModel: typeof import("@/models/userModel").default;
let LogActionModel: typeof import("@/models/logActionModel").default;
let authorize: (credentials?: Record<string, string>) => Promise<unknown>;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.DATABASE_URL = mongoServer.getUri();
  UserModel = (await import("@/models/userModel")).default;
  LogActionModel = (await import("@/models/logActionModel")).default;
  await import("@/app/api/auth/[...nextauth]/route");
  const options = jest.mocked(NextAuth).mock
    .calls[0][0] as unknown as NextAuthOptions;
  // CredentialsProvider keeps the route's authorize() under `options`.
  const provider = options.providers[0] as unknown as {
    options: { authorize: typeof authorize };
  };
  authorize = provider.options.authorize;
  await (await import("@/lib/db")).default();
  await UserModel.init(); // build the unique email index
}, 60_000);

beforeEach(async () => {
  await UserModel.deleteMany({});
  await LogActionModel.deleteMany({});
  jest.mocked(getZoomAccessToken).mockResolvedValue({
    access_token: "token",
    api_url: "https://api.zoom.us",
  } as never);
  jest.mocked(getZoomUser).mockResolvedValue({ email: EMAIL } as never);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("NextAuth credentials authorize()", () => {
  it("creates a new user and logs the sign-up", async () => {
    const result = await authorize({ code: "abc" });

    const user = await UserModel.findOne({ email: EMAIL });
    expect(result).toEqual({ id: user.id, email: EMAIL, role: "user" });
    const logs = await LogActionModel.find().lean();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      userEmail: EMAIL,
      action: "sign_up_success",
    });
  });

  it("returns the existing user without creating another or logging", async () => {
    const existing = await UserModel.create({ email: EMAIL, role: "admin" });

    const result = await authorize({ code: "abc" });

    expect(result).toEqual({ id: existing.id, email: EMAIL, role: "admin" });
    expect(await UserModel.countDocuments()).toBe(1);
    expect(await LogActionModel.countDocuments()).toBe(0);
  });

  it("rejects a missing code without touching the DB", async () => {
    await expect(authorize({})).rejects.toThrow('missing required "code"');

    expect(await UserModel.countDocuments()).toBe(0);
  });
});

describe("User model", () => {
  it("hashes the password on save and compares it", async () => {
    const user = await UserModel.create({ email: EMAIL, password: "secret" });

    expect(user.password).not.toBe("secret");
    expect(await user.comparePassword("secret")).toBe(true);
    expect(await user.comparePassword("wrong")).toBe(false);
  });

  it("does not re-hash when the password is unchanged", async () => {
    const user = await UserModel.create({ email: EMAIL, password: "secret" });
    const hash = user.password;

    user.waveHands.push("👋 Hi");
    await user.save();

    expect(user.password).toBe(hash);
  });

  it("enforces a unique email", async () => {
    await UserModel.create({ email: EMAIL });

    await expect(UserModel.create({ email: EMAIL })).rejects.toThrow(
      /duplicate key/,
    );
  });
});
