/**
 * @jest-environment node
 */
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("nodemailer", () => ({ createTransport: jest.fn() }));

const mockSession = jest.mocked(getServerSession);
const sendMail = jest.fn();
jest.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

// lib/db reads DATABASE_URL at import time, so modules are imported after the
// in-memory MongoDB is up. We own the server so afterAll can stop it.
let mongoServer: MongoMemoryServer;
let LogActionModel: typeof import("@/models/logActionModel").default;
let logRoute: typeof import("@/app/api/log/route");
let report: typeof import("@/lib/report");

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.DATABASE_URL = mongoServer.getUri();
  LogActionModel = (await import("@/models/logActionModel")).default;
  logRoute = await import("@/app/api/log/route");
  report = await import("@/lib/report");
  await (await import("@/lib/db")).default();
}, 60_000);

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
  mockSession.mockResolvedValue(null);
  delete process.env.RECEIVE_EMAIL;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const postLog = (body: object) =>
  logRoute.POST(
    new Request("http://localhost/api/log", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );

describe("POST /api/log", () => {
  it("stores the action with the session user's email", async () => {
    mockSession.mockResolvedValue({
      user: { email: "me@example.com" },
    } as never);

    await postLog({ action: "log_in_success", userEmail: "other@example.com" });

    const logs = await LogActionModel.find().lean();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      userEmail: "me@example.com",
      action: "log_in_success",
    });
  });

  it("falls back to the email in the body, then to NO_EMAIL", async () => {
    await postLog({ action: "app_installed", userEmail: "body@example.com" });
    await postLog({ action: "app_installed" });

    const emails = (await LogActionModel.find().lean()).map((l) => l.userEmail);
    expect(emails).toEqual(["body@example.com", "NO_EMAIL"]);
  });

  it("stores metadata and returns the saved log", async () => {
    const res = await postLog({ action: "error", metadata: { code: 42 } });

    const { log } = await res.json();
    expect(log).toMatchObject({ action: "error", metadata: { code: 42 } });
    expect((await LogActionModel.findOne().lean())?.metadata).toEqual({
      code: 42,
    });
  });
});

describe("lib/report run()", () => {
  const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000);

  beforeEach(async () => {
    await LogActionModel.create([
      { userEmail: "a", action: "log_in_success", timestamp: hoursAgo(1) },
      { userEmail: "b", action: "log_in_success", timestamp: hoursAgo(2) },
      { userEmail: "a", action: "affirmation_added", timestamp: hoursAgo(3) },
      { userEmail: "a", action: "log_in_success", timestamp: hoursAgo(48) },
    ]);
  });

  it("emails a count of the last day's actions to each receiver", async () => {
    process.env.RECEIVE_EMAIL = "x@example.com, y@example.com";

    await report.run();

    expect(sendMail).toHaveBeenCalledTimes(2);
    expect(sendMail.mock.calls.map(([m]) => m.to)).toEqual([
      "x@example.com",
      "y@example.com",
    ]);
    const { html } = sendMail.mock.calls[0][0];
    expect(html).toContain("<strong>Total Actions:</strong> 3");
    expect(html).toMatch(/log_in_success\s*<\/td>\s*<td[^>]*>\s*2\s*</);
    expect(html).toMatch(/affirmation_added\s*<\/td>\s*<td[^>]*>\s*1\s*</);
  });

  it("skips sending when no receiver is configured", async () => {
    await report.run();

    expect(sendMail).not.toHaveBeenCalled();
  });
});
