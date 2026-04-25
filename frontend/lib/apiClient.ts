const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5163";

type ApiRequestOptions = RequestInit & {
  signal?: AbortSignal;
};

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const url = `${apiBaseUrl.replace(/\/$/, "")}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
}

export function getApiBaseUrl() {
  return apiBaseUrl;
}
