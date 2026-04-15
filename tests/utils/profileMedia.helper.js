import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get absolute path
export function getBannerImagePath(filename = 'logo.jpg') {
  const bannerPath = path.join(__dirname, '../test-data', filename);

  if (!fs.existsSync(bannerPath)) {
    throw new Error(`Banner image not found: ${bannerPath}`);
  }

  return bannerPath;
}


export function getProfileImagePath(filename = 'profile.png') {
  const profilePath = path.join(__dirname, '../test-data', filename);

  if (!fs.existsSync(profilePath)) {
    throw new Error(`Profile image not found: ${profilePath}`);
  }

  return profilePath;
}

