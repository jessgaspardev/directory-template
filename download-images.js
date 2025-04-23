// ES Module version of the image downloader
import {promises as fs} from "fs";
import path from "path";
import {fileURLToPath} from "url";
import axios from "axios";
import crypto from "crypto";

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DATA_DIR = path.join(__dirname, "data");
const IMAGES_DIR = path.join(__dirname, "public", "images", "listings");
const IMAGE_BASE_URL = "/images/listings"; // URL path in your final website

// Create image directory if it doesn't exist
async function ensureDirectoryExists(directory) {
  try {
    await fs.mkdir(directory, {recursive: true});
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
}

// Generate a consistent filename based on listing data
function generateImageFilename(listing) {
  // Create a unique but consistent hash based on listing data
  const hash = crypto
    .createHash("md5")
    .update(`${listing.name}-${listing.city}-${listing.state}`)
    .digest("hex")
    .substring(0, 10);

  // Create a clean filename from listing name
  const namePart = listing.name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .substring(0, 30);

  return `${namePart}-${hash}.jpg`;
}

// Download a single image
async function downloadImage(imageUrl, imagePath) {
  try {
    // Add a random delay to avoid rate limiting
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 500)
    );

    const response = await axios({
      method: "GET",
      url: imageUrl,
      responseType: "arraybuffer",
      headers: {
        // Add headers to mimic a browser request
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        Referer: "https://www.google.com/",
      },
    });

    await fs.writeFile(imagePath, response.data);
    return true;
  } catch (error) {
    console.error(`Failed to download ${imageUrl}: ${error.message}`);
    return false;
  }
}

// Helper to check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Process all state files
async function processAllStates() {
  try {
    // Create images directory
    await ensureDirectoryExists(IMAGES_DIR);

    // Get all state JSON files
    const files = await fs.readdir(DATA_DIR);
    const stateFiles = files.filter((file) => file.endsWith(".json"));

    // Track stats
    let totalListings = 0;
    let totalImages = 0;
    let successfulDownloads = 0;

    // Process each state file
    for (const stateFile of stateFiles) {
      console.log(`Processing ${stateFile}...`);

      // Read and parse the state file
      const stateFilePath = path.join(DATA_DIR, stateFile);
      const stateData = JSON.parse(await fs.readFile(stateFilePath, "utf8"));

      totalListings += stateData.length;

      // Process each listing
      const updatedListings = await Promise.all(
        stateData.map(async (listing) => {
          // Skip if no image
          if (!listing.image || listing.image.trim() === "") {
            return listing;
          }

          totalImages++;

          // Generate filename and path
          const filename = generateImageFilename(listing);
          const imagePath = path.join(IMAGES_DIR, filename);
          const webPath = `${IMAGE_BASE_URL}/${filename}`;

          // Only download if file doesn't exist
          if (!(await fileExists(imagePath))) {
            const success = await downloadImage(listing.image, imagePath);
            if (success) {
              successfulDownloads++;
              // Update the listing with the new local image path
              return {
                ...listing,
                image: webPath,
                original_image: listing.image,
              };
            }
          } else {
            successfulDownloads++;
            // File exists, update the path
            return {...listing, image: webPath, original_image: listing.image};
          }

          // If download failed, keep original
          return listing;
        })
      );

      // Write the updated file
      await fs.writeFile(
        stateFilePath,
        JSON.stringify(updatedListings, null, 2)
      );

      console.log(`Updated ${stateFile}`);
    }

    console.log(`\nProcess complete!`);
    console.log(`Total listings: ${totalListings}`);
    console.log(`Listings with images: ${totalImages}`);
    console.log(`Successfully downloaded: ${successfulDownloads}`);
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

// Run the process
processAllStates();
