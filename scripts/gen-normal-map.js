const sharp = require('sharp');
const fs = require('fs');

// Function to generate a normal map from a grayscale height map
async function generateNormalMap(heightMapPath, normalMapPath) {
    try {
        // Load the grayscale height map image
        const heightMap = sharp(heightMapPath);

        // Read image data and process it to generate normal map
        const { data, info } = await heightMap.raw().toBuffer({ resolveWithObject: true });

        const width = info.width;
        const height = info.height;
        const pixelCount = width * height;
        const normalMapData = Buffer.alloc(pixelCount * 3); // RGB for each pixel

        for (let i = 0; i < pixelCount; i++) {
            const x = i % width;
            const y = Math.floor(i / width);

            // Get the grayscale value (R = G = B) from the height map
            const heightValue = data[i]; // assuming 8-bit grayscale image

            // Calculate normal map values (simplified)
            const dx = x > 0 && x < width - 1 ? data[i - 1] - data[i + 1] : 0;
            const dy = y > 0 && y < height - 1 ? data[i - width] - data[i + width] : 0;

            // Normalize and encode into RGB
            const normalX = Math.min(Math.max(dx / 255, -1), 1);
            const normalY = Math.min(Math.max(dy / 255, -1), 1);
            const normalZ = Math.min(Math.max(1 - Math.abs(normalX) - Math.abs(normalY), 0), 1);

            const r = Math.round((normalX * 0.5 + 0.5) * 255);
            const g = Math.round((normalY * 0.5 + 0.5) * 255);
            const b = Math.round((normalZ * 0.5 + 0.5) * 255);

            normalMapData.writeUInt8(r, i * 3);
            normalMapData.writeUInt8(g, i * 3 + 1);
            normalMapData.writeUInt8(b, i * 3 + 2);
        }

        // Create a new normal map image and save it
        await sharp(normalMapData, { raw: { width, height, channels: 3 } })
            .toFile(normalMapPath);

        console.log(`Normal map generated and saved to ${normalMapPath}`);
    } catch (error) {
        console.error('Error generating normal map:', error);
    }
}

// Usage example
const heightMapPath = 'generated/procedural_texture.png';  // Replace with your grayscale height map path
const normalMapPath = 'normal_map.png';  // Output normal map path
generateNormalMap(heightMapPath, normalMapPath);
