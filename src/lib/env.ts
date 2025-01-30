type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function readBaseUrl(): Result<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL;

  if (!baseUrl) {
    return {
      ok: false,
      error: new Error("BASE_URL environment variable is not set"),
    };
  }

  // Ensure URL has proper protocol
  const url = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

  return { ok: true, value: url };
}
