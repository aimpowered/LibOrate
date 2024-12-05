import { URL } from "url";
import crypto from "crypto";
import { zoomApp } from "./config";
import { redirect } from "next/navigation";

export const GET = async (req: unknown, res: unknown) => {
  const { url } = getInstallURL();

  console.log(url.href);
  redirect(url.href);
};

const base64URL = (s: Buffer) =>
  s
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

const rand = (fmt: BufferEncoding, depth = 32) =>
  crypto.randomBytes(depth).toString(fmt);

function getInstallURL() {
  const state = rand("base64");
  const verifier = rand("ascii");
  const digest = crypto.createHash("sha256").update(verifier).digest();
  const challenge = base64URL(digest);
  const url = new URL("/oauth/authorize", zoomApp.host);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", zoomApp.clientId as string);
  url.searchParams.set("redirect_uri", zoomApp.redirectUrl as string);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);

  return { url, state, verifier };
}
