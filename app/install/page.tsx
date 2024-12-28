"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  // Function to handle button click for installation
  const handleInstall = async () => {
    // Redirect to the API route that handles the installation
    router.push("/api/install");
  };

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
          Install LibOrate by AImpower.org
        </h1>
        <p className="text-lg text-teal-900 mb-8">
          Create equitable and empowering meeting experience for all voices.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleInstall}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-slate-800 hover:bg-slate-900 md:py-4 md:text-lg md:px-10"
          >
            Install LibOrate App
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

export default Home;
