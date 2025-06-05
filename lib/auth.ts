import axios from "axios";
import { zoomApp } from "@/lib/env_vars";

interface ZoomTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  api_url: string;
}

export const getZoomAccessToken = (
  zoomAuthorizationCode: string,
): Promise<ZoomTokenResponse> => {
  if (process.env.NEXT_PUBLIC_MOCK_ZOOM_API === "true") {
    return Promise.resolve({
      access_token: "mock_access_token",
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: "mock_refresh_token",
      scope: "user:read",
      api_url: "https://api.zoom.us/v2",
    });
  }

  const params: Record<string, string> = {
    grant_type: "authorization_code",
    code: zoomAuthorizationCode,
    code_verifier: "codeChallenge",
  };

  const tokenRequestParamString = new URLSearchParams(params).toString();

  return axios
    .post<ZoomTokenResponse>(
      `${zoomApp.host}/oauth/token`,
      tokenRequestParamString,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: zoomApp.clientId as string,
          password: zoomApp.clientSecret as string,
        },
      },
    )
    .then((response) => response.data);
};

interface ZoomUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

export const getZoomUser = (
  accessToken: string,
  api_url: string,
): Promise<ZoomUserProfile> => {
  if (process.env.NEXT_PUBLIC_MOCK_ZOOM_API === "true") {
    return Promise.resolve({
      id: "mock_id",
      first_name: "mock_first_name",
      last_name: "mock_last_name",
      email: "mock_email@mock_domain.com",
      status: "active",
    });
  }
  return axios
    .get<ZoomUserProfile>(`${api_url}/v2/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
};
