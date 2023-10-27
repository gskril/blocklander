export function parseSearchParams(
  params: URLSearchParams
): Record<string, string> {
  const query: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    query[key] = value
  }
  return query
}
