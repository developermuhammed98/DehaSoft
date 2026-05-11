import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api";

export async function fetchBackend(endpoint: string, options: RequestInit = {}) {
  // Always use server-side cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const headers = new Headers(options.headers || {});
  
  headers.set("Accept", "application/json");
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach token if exists
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${BACKEND_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
