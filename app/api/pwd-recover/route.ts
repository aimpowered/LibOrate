import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import startDB from "@/lib/db";
import UserModel from "@/models/userModel";
import crypto from "crypto";

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    // Find user by email
    await startDB();
    const User = await UserModel.findOne({ email: email });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    if (User) {
      User.resetToken = resetToken;
      User.resetTokenExpiry = resetTokenExpiry;
      await User.save();

      // Create the password reset link
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/change-password?token=${resetToken}`;

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "LibOrate Password Recovery",
        text: `Please reset your password with this link: ${resetUrl}!`, // Remember to use hashed passwords in production!
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
