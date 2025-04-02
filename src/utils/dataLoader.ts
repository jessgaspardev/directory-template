import {promises as fs} from "fs";
import path from "path";
import type {Listing} from "../types/listing";

const DATA_DIR = path.join(process.cwd(), "data");

export async function loadAllStates(): Promise<string[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    return files
      .filter((file: string) => file.endsWith(".json"))
      .map((file: string) => path.basename(file, ".json"));
  } catch (error) {
    console.error("Error reading data directory:", error);
    return [];
  }
}

export async function loadStateData(state: string): Promise<Listing[]> {
  try {
    const filePath = path.join(DATA_DIR, `${state.toLowerCase()}.json`);
    const fileContents = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContents) as Listing[];
  } catch (error) {
    console.error(`Error loading data for state ${state}:`, error);
    return [];
  }
}

export async function getAvailableCitiesInState(
  state: string
): Promise<string[]> {
  const listings = await loadStateData(state);
  return [...new Set(listings.map((listing) => listing.city))].sort();
}

export function normalizeCity(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, " "); // Normalize multiple spaces to single space
}

export async function getListingsInCity(
  state: string,
  city: string
): Promise<Listing[]> {
  const stateListings = await loadStateData(state);
  const normalizedInputCity = normalizeCity(city);

  return stateListings.filter(
    (listing) => normalizeCity(listing.city) === normalizedInputCity
  );
}

// Helper function for generating URL-friendly slugs
export function createCitySlug(city: string): string {
  return city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper function to parse slug back to original city name
export function parseCitySlug(slug: string): string {
  return slug.toLowerCase().replace(/-/g, " ").trim();
}
