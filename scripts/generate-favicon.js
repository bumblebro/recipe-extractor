const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [16, 32, 48, 64, 128, 192, 512];
const publicDir = path.join(process.cwd(), "public");

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Generate favicon.ico
sharp("app/components/Favicon.tsx")
  .resize(32, 32)
  .toFile(path.join(publicDir, "favicon.ico"))
  .catch(console.error);

// Generate PNG versions
sizes.forEach((size) => {
  sharp("app/components/Favicon.tsx")
    .resize(size, size)
    .toFile(path.join(publicDir, `favicon-${size}x${size}.png`))
    .catch(console.error);
});

// Generate apple-touch-icon
sharp("app/components/Favicon.tsx")
  .resize(180, 180)
  .toFile(path.join(publicDir, "apple-touch-icon.png"))
  .catch(console.error);
