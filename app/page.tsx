"use client";

import { useEffect, useState, useRef } from "react";
import { AuthorizeOptions } from "@/lib/zoomapi";
import { signIn, useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { getZoomApi } from "@/lib/zoomapi_loader";
import { useRouter } from "next/navigation";
import { log, Action } from "@/lib/log";
import Alert from "@/components/Alert";
import { LoadingComponent } from "@/components/LoadingComponent";

function App() {
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const effectRan = useRef(false);

  const router = useRouter();

  useEffect(() => {
    if (effectRan.current) return;

    effectRan.current = true;

    async function handleAuth() {
      try {
        console.log("handleAuth called");
        const zoomApi = await getZoomApi();
        const options: AuthorizeOptions = {
          state: "state",
          codeChallenge: "codeChallenge",
        };
        const res = await zoomApi.authorize(options);
        console.log("zoom sdk authorized:", res);
        zoomApi.setAuthorizeCallback(async (event) => {
          console.log("zoom api authorize callback called:", event);
          const res = await signIn("credentials", {
            code: event.code,
            redirect: false,
          });
          if (res?.error) {
            console.error("next auth sign in failed:", res.error);
            return setError(res.error);
          }
          router.replace("/main");
          if (session?.user?.email) {
            log(Action.LOG_IN, session.user.email);
          }
        });
      } catch (error) {
        console.error("Failed to authorize zoom API:", error);
        setError((error as Error).message);
      }
    }

    handleAuth();
  }, []);

  if (error) {
    return <Alert value={error} />;
  }

  return <LoadingComponent />;
}

export default function MyApp() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  );
}
