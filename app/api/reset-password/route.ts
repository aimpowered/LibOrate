import { NextResponse } from 'next/server';
import UserModel from '@/models/userModel';


export async function POST(request: Request) {
  const { token, newPassword } = await request.json();

  try {

    //Locate user with the right token
    const User = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, 
    });

    if (!User) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    // Update the user's password, remove the reset token, and set expiry date to current time for security
    User.password = newPassword;
    User.resetToken = "";
    User.resetTokenExpiry = new Date();
    await User.save();

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
