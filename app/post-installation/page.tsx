"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto text-center py-12 px-4">
        <Image
          src="/liborate_logo_full.png"
          alt="LibOrate Logo"
          className="mx-auto h-32 w-auto rounded-3xl"
          width="400"
          height="400"
        />
        <h1 className="text-4xl font-extrabold text-teal-600 mt-6 mb-4">
          LibOrate has been installed!
        </h1>
        <p className="text-lg text-teal-900 mb-8">
          Thank you for installing LibOrate by AImpower.org. Continue with Zoom
          Desktop App to acess LibOrate.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "zoommtg://")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-slate-800 hover:bg-slate-900 md:py-4 md:text-lg md:px-10"
          >
            Launch Zoom
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <p className="text-center text-sm text-gray-500 py-4">
          LibOrate is a video conferencing companion tool developed by
          AImpower.org to empower marginalized voices and cultivate inclusive
          online meeting environments.
        </p>
      </div>
    </div>
  );
}
