import fs from "fs"
import path from "path"

const animationsDir = path.join(__dirname, "src", "__mocks__", "animations")
const originalAnimationsDir = path.join(
  __dirname,
  "public",
  "json",
  "animations",
)

// Ensure the animations directory exists
if (!fs.existsSync(animationsDir)) {
  fs.mkdirSync(animationsDir, { recursive: true })
}

// Read the original animations directory and create mock files for each JSON file
fs.readdirSync(originalAnimationsDir).forEach(file => {
  const mockFilePath = path.join(animationsDir, file)
  if (!fs.existsSync(mockFilePath)) {
    fs.writeFileSync(mockFilePath, "{}")
  }
})

console.log("Manual mocks for animations created successfully.")
