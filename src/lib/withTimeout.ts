/**
 * Races a promise against a timer so callers never wait indefinitely on a
 * slow or lost connection.
 *
 * Note: Promise.race does NOT abort the underlying HTTP request — it only
 * stops waiting for the result and rejects. The original request may still
 * complete in the background. This is acceptable and consistent with the
 * existing timeout behavior elsewhere in the codebase.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms = 15000,
  label = "Request"
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          `${label} timed out. Please check your connection and try again.`
        )
      );
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
}
