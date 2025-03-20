import axios from "axios";
import { zoomApp } from "@/app/api/install/config";

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
  const params: Record<string, string> = {
    grant_type: "authorization_code",
    code: zoomAuthorizationCode,
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
  return axios
    .get<ZoomUserProfile>(`${api_url}/v2/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
};
