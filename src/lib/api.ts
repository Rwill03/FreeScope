/**
 * API error handling and response utilities
 */

export type ApiError = {
  error: string;
  status?: number;
};

export type ApiResponse<T> = T & { error?: never };

export async function handleApiResponse<T>(
  response: Response
): Promise<T> {
  const data = await response.json() as unknown;

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "An error occurred";

    throw new Error(errorMessage);
  }

  return data as T;
}

export function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}
