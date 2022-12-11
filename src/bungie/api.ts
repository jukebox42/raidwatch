import { HttpClientConfig } from "bungie-api-ts/http";

import { API_KEY } from "utils/constants";

export const headers: HeadersInit = {
  "X-API-Key": API_KEY,
  "Content-Type": "application/json"
};

export const createHttp = (headers: HeadersInit|void = undefined, mode: RequestMode = "cors") => {
  return async (config: HttpClientConfig): Promise<Response> => {
    let url = config.url;
    const params = new URLSearchParams(config.params as Record<string, string>).toString();
    if (params) {
      url = `${url}?${params}`;
    }

    let body = undefined;
    if (config.body) {
      body = JSON.stringify(config.body);
    }

    const follow: RequestRedirect = "follow";

    const options = {
      method: config.method,
      body: body,
      headers: headers ?? undefined,
      mode: mode,
      redirect: follow,
    }
    const frequest = await fetch(url, options);
    try {
      return await frequest.json();
    } catch (e: any) {
      const resp = new Response(JSON.stringify({
        ErrorCode: 0,
        ErrorStatus: "None",
        Message: e.toString(),
        MessageData: {},
        ThrottleSeconds: 0,
      }));
      return await resp.json();
    }
  };
}

export const $http = createHttp(headers);

export const $httpUnsigned = createHttp();
