// proceduralVoronoiStone.js
const { createCanvas } = require('canvas');
const Voronoi = require('voronoi');
const fs = require('fs');

// Texture size
const width = 512;
const height = 512;

// Number of random sites for Voronoi
const numSites = 30;

// Create a canvas with the desired size
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Generate random sites for Voronoi diagram
function generateSites(numSites, width, height) {
    const sites = [];
    for (let i = 0; i < numSites; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        sites.push([x, y]);
    }
    return sites;
}

// Simplex noise or randomness for stone texture variation
function getStoneColorVariation(baseColor) {
    const variation = (Math.random() - 0.5) * 40;  // Add a small random variation
    const r = Math.min(255, Math.max(0, baseColor[0] + variation));
    const g = Math.min(255, Math.max(0, baseColor[1] + variation));
    const b = Math.min(255, Math.max(0, baseColor[2] + variation));
    return [r, g, b];
}

// Create the Voronoi diagram
function generateVoronoiTexture(width, height, numSites) {
    const sites = generateSites(numSites, width, height);
    const voronoi = new Voronoi();

    // Create the Voronoi diagram based on the sites
    const diagram = voronoi.compute(sites, { xl: 0, xr: width, yt: 0, yb: height });

    const imageData = ctx.createImageData(width, height);

    // Color each pixel based on the nearest Voronoi site
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let minDist = Infinity;
            let closestSite = null;

            // Find the closest site to the current pixel
            sites.forEach((site) => {
                const dist = Math.sqrt(Math.pow(site[0] - x, 2) + Math.pow(site[1] - y, 2));
                if (dist < minDist) {
                    minDist = dist;
                    closestSite = site;
                }
            });

            // Create a base color (grayish tone) for the stone-like texture
            const baseColor = [150 + Math.random() * 30, 140 + Math.random() * 30, 130 + Math.random() * 30];

            // Add variation to the base color to make it look more natural
            const stoneColor = getStoneColorVariation(baseColor);

            // Assign the color to the pixel
            const index = (y * width + x) * 4;
            imageData.data[index] = stoneColor[0]; // R
            imageData.data[index + 1] = stoneColor[1]; // G
            imageData.data[index + 2] = stoneColor[2]; // B
            imageData.data[index + 3] = 255; // Alpha
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Generate the Voronoi texture
generateVoronoiTexture(width, height, numSites);

// Save the canvas as a PNG file
const out = fs.createWriteStream('./voronoi_stone_texture.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => {
    console.log('Stone-like Voronoi texture saved as voronoi_stone_texture.png');
});
