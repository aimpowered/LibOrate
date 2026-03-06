import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dayjs from "dayjs";
import LogActionModel from "../models/logActionModel";
import startDB from "./db";

function renderActionTable(grouped: Record<string, number>) {
  const rows = Object.entries(grouped)
    .map(
      ([action, count]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">
          ${action}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">
          ${count}
        </td>
      </tr>`,
    )
    .join("");

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:12px;">
  <thead>
    <tr>
      <th style="padding:10px 12px;border-bottom:2px solid #333;text-align:left;background:#fafafa;">
        Action
      </th>
      <th style="padding:10px 12px;border-bottom:2px solid #333;text-align:right;background:#fafafa;">
        Count
      </th>
    </tr>
  </thead>
  <tbody>
    ${
      rows ||
      `
    <tr>
      <td colspan="2" style="padding:12px;text-align:center;color:#888;">
        No actions recorded
      </td>
    </tr>`
    }
  </tbody>
</table>
`;
}

function renderEmailHTML({
  start,
  end,
  total,
  grouped,
}: {
  start: Date;
  end: Date;
  total: number;
  grouped: Record<string, number>;
}) {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;">
            
            <!-- Header -->
            <tr>
              <td style="padding:20px 24px;border-bottom:1px solid #eee;">
                <h2 style="margin:0;font-family:Arial,sans-serif;">
                  📊 Daily Action Report
                </h2>
              </td>
            </tr>

            <!-- Meta -->
            <tr>
              <td style="padding:16px 24px;font-family:Arial,sans-serif;color:#555;">
                <div><strong>Time Range:</strong></div>
                <div>${start.toISOString()} → ${end.toISOString()}</div>
                <div style="margin-top:8px;">
                  <strong>Total Actions:</strong> ${total}
                </div>
              </td>
            </tr>

            <!-- Table -->
            <tr>
              <td style="padding:0 24px 24px 24px;font-family:Arial,sans-serif;">
                ${renderActionTable(grouped)}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:12px 24px;font-family:Arial,sans-serif;color:#999;font-size:12px;border-top:1px solid #eee;">
                This email was generated automatically.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export async function run() {
  await startDB();

  const end = new Date();
  const start = dayjs(end).subtract(1, "day").toDate();

  console.log(
    `Generating report from ${start.toISOString()} to ${end.toISOString()}`,
  );

  const logs = await LogActionModel.find({
    timestamp: { $gte: start, $lte: end },
  }).lean();

  const grouped: Record<string, number> = {};
  for (const log of logs) {
    grouped[log.action] = (grouped[log.action] || 0) + 1;
  }
  console.log("Grouped actions:", grouped);

  const reportText = renderEmailHTML({
    start,
    end,
    total: logs.length,
    grouped,
  });

  console.log("Sending report email...");
  await sendMail(reportText);
  console.log("Report email sent.");

  await mongoose.disconnect();
  console.log("Disconnected from database.");
}

async function sendMail(html: string) {
  const receiver = process.env.RECEIVE_EMAIL?.split(",").map((email) =>
    email.trim(),
  );
  if (!receiver || receiver.length === 0) {
    console.warn("No receiver email configured. Skipping email sending.");
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER!,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
    secure: true,
    debug: true,
    auth: {
      user: process.env.SEND_EMAIL!,
      pass: process.env.SEND_EMAIL_PASSWORD!,
    },
  });

  try {
    const p = Promise.all(
      receiver.map((email) =>
        transporter.sendMail({
          from: `"LibOrate Bot" <${process.env.SEND_EMAIL!}>`,
          to: email,
          subject: "LibOrate Daily Report",
          text: "Please view this email in an HTML-compatible email client.",
          html: html.trim(),
        }),
      ),
    );
    await p;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
