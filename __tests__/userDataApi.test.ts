/**
 * @jest-environment node
 */
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { NextRequest } from "next/server";
import { loggedInUserEmail } from "@/lib/session";

jest.mock("../lib/session");

const EMAIL = "user@example.com";
const mockSession = jest.mocked(loggedInUserEmail);

// lib/db reads DATABASE_URL at import time, so modules are imported after the
// in-memory MongoDB is up. We own the server so afterAll can stop it.
let mongoServer: MongoMemoryServer;
let startDB: typeof import("@/lib/db").default;
let UserModel: typeof import("@/models/userModel").default;
let userData: typeof import("@/app/api/auth/users/userData/route");
let affirmation: typeof import("@/app/api/auth/users/userData/affirmation/route");
let waveHand: typeof import("@/app/api/auth/users/userData/waveHand/route");
let nameTag: typeof import("@/app/api/auth/users/userData/nameTag/route");

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.DATABASE_URL = mongoServer.getUri();
  startDB = (await import("@/lib/db")).default;
  UserModel = (await import("@/models/userModel")).default;
  userData = await import("@/app/api/auth/users/userData/route");
  affirmation = await import("@/app/api/auth/users/userData/affirmation/route");
  waveHand = await import("@/app/api/auth/users/userData/waveHand/route");
  nameTag = await import("@/app/api/auth/users/userData/nameTag/route");
  await startDB();
}, 60_000);

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
  mockSession.mockResolvedValue({ userEmail: EMAIL });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const request = (method: string, body: unknown) =>
  new NextRequest("http://localhost/api", {
    method,
    body: JSON.stringify(body),
  });

const createUser = () => UserModel.create({ email: EMAIL });
const findUser = () =>
  UserModel.findOne({ email: EMAIL }).lean<{
    affirmations: string[];
    waveHands: string[];
    nameTag?: object;
  }>();

describe("GET /api/auth/users/userData", () => {
  it("returns the user's data with schema defaults", async () => {
    await createUser();

    const res = await userData.GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.waveHands).toHaveLength(6);
    expect(json.affirmations).toHaveLength(5);
  });

  it("returns 400 when the user does not exist", async () => {
    const res = await userData.GET();

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "User does not exist." });
  });

  it("returns 400 without a session", async () => {
    mockSession.mockResolvedValue({ error: "Session does not exist." });

    const res = await userData.GET();

    expect(res.status).toBe(400);
  });
});

describe("/api/auth/users/userData/affirmation", () => {
  it("POST appends an affirmation", async () => {
    await createUser();

    const res = await affirmation.POST(request("POST", "I am calm"));

    expect(res.status).toBe(200);
    expect((await findUser())?.affirmations.at(-1)).toBe("I am calm");
  });

  it("POST returns 404 when the user does not exist", async () => {
    const res = await affirmation.POST(request("POST", "I am calm"));

    expect(res.status).toBe(404);
  });

  it("PUT replaces the affirmation at the index", async () => {
    await createUser();

    const res = await affirmation.PUT(request("PUT", { id: 1, text: "New" }));

    expect(res.status).toBe(200);
    expect((await findUser())?.affirmations[1]).toBe("New");
  });

  it("PUT rejects invalid input", async () => {
    await createUser();

    const res = await affirmation.PUT(request("PUT", { id: "1", text: "New" }));

    expect(res.status).toBe(400);
  });

  it("PUT returns 404 for an out-of-range index", async () => {
    await createUser();

    const res = await affirmation.PUT(request("PUT", { id: 5, text: "New" }));

    expect(res.status).toBe(404);
  });

  it("DELETE removes the affirmation at the index", async () => {
    const user = await createUser();
    const [first, , ...rest] = user.affirmations;

    const res = await affirmation.DELETE(request("DELETE", { id: 1 }));

    expect(res.status).toBe(200);
    expect((await findUser())?.affirmations).toEqual([first, ...rest]);
  });

  it("DELETE returns 404 for an out-of-range index", async () => {
    await createUser();

    const res = await affirmation.DELETE(request("DELETE", { id: -1 }));

    expect(res.status).toBe(404);
    expect((await findUser())?.affirmations).toHaveLength(5);
  });
});

describe("/api/auth/users/userData/waveHand", () => {
  it("POST appends a wave hand", async () => {
    await createUser();

    const res = await waveHand.POST(request("POST", "👋 Hi"));

    expect(res.status).toBe(200);
    expect((await findUser())?.waveHands.at(-1)).toBe("👋 Hi");
  });

  it("POST returns 404 when the user does not exist", async () => {
    const res = await waveHand.POST(request("POST", "👋 Hi"));

    expect(res.status).toBe(404);
  });

  it("DELETE removes the wave hand at the index", async () => {
    const user = await createUser();
    const [, ...rest] = user.waveHands;

    const res = await waveHand.DELETE(request("DELETE", { id: 0 }));

    expect(res.status).toBe(200);
    expect((await findUser())?.waveHands).toEqual(rest);
  });

  it("DELETE returns 404 for an out-of-range index", async () => {
    await createUser();

    const res = await waveHand.DELETE(request("DELETE", { id: 6 }));

    expect(res.status).toBe(404);
    expect((await findUser())?.waveHands).toHaveLength(6);
  });
});

describe("POST /api/auth/users/userData/nameTag", () => {
  const tag = {
    visible: true,
    preferredName: "Sam",
    pronouns: "they/them",
    disclosure: "I stutter",
    fullMessage: "Sam (they/them) I stutter",
    sendToMeeting: false,
  };

  it("saves the name tag", async () => {
    await createUser();

    const res = await nameTag.POST(request("POST", tag));

    expect(res.status).toBe(200);
    expect((await findUser())?.nameTag).toEqual(tag);
  });

  it("returns 400 without a session and leaves the DB untouched", async () => {
    await createUser();
    mockSession.mockResolvedValue({ error: "Session does not exist." });

    const res = await nameTag.POST(request("POST", tag));

    expect(res.status).toBe(400);
    expect((await findUser())?.nameTag).toBeUndefined();
  });
});
