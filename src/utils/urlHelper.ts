/**
 * Creates a URL-friendly slug from a string
 * @param name The string to convert to a slug
 * @returns A URL-friendly slug
 */
export function createUrlSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Converts a URL slug back to a readable name
 * @param slug The URL slug to decode
 * @returns A readable name with spaces and capitalization
 */
export function decodeUrlSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats a state name from a file slug for display
 * @param stateSlug The state slug (e.g., "new-york", "north-carolina")
 * @returns A formatted state name (e.g., "New York", "North Carolina")
 */
export function formatStateName(stateSlug: string): string {
  return stateSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
