// Navbar page
import Link from "next/link";
import React from "react";
import AuthProfileMenu from "./AuthProfileMenu";

export default function Navbar() {
  return (
    <nav className="flex items-center w-screen h-24 mx-auto px-12 py-2 justify-between rounded bg-gray-300">
      <Link href="/" className="font-bold text-xl">
        Home
      </Link>
      {/* AuthProfile loads Login/Logout button in Navbar */}
      <AuthProfileMenu />
    </nav>
  );
}
