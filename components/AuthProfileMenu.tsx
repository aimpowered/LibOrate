// Login / Logout button for Navbad
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

// Define a CSS class for the button style
const buttonStyle =
  "block bg-white shadow-md shadow-gray-500 text-xl font-bold py-2 px-4 rounded-full hover:bg-slate-400";

export default function AuthProfileMenu() {
  const { status } = useSession();
  const isAuth = status === "authenticated";

  if (isAuth) {
    return (
      <p>
        {/* {data?.user?.name}{" "} */}
        <button onClick={() => signOut()} className={`${buttonStyle} w-40`}>
          Logout
        </button>
      </p>
    );
  } else {
    return (
      <ul className="flex items-center space-x-6">
        <li>
          <Link href="/" className={`${buttonStyle} w-40 text-center`}>
            Login
          </Link>
        </li>
      </ul>
    );
  }
}
