const { createCanvas } = require('canvas');
const perlin = require('perlin-noise');
const fs = require('fs');

// Texture size
const width = 512;
const height = 512;

// Create a canvas with the desired size
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Generate Perlin noise
const noiseData = perlin.generatePerlinNoise(width, height, {
    octaveCount: 4, // Number of layers of noise
    amplitude: 1,   // Maximum value of the noise
    persistence: 0.5, // Amplitude decay for each octave
    lacunarity: 2,    // Frequency multiplier for each octave
});

// Map the noise to grayscale and draw it on the canvas
const imageData = ctx.createImageData(width, height);

for (let i = 0; i < width * height; i++) {
    const grayValue = Math.floor((noiseData[i] + 1) * 128); // Convert noise to grayscale
    imageData.data[i * 4] = grayValue; // Red channel
    imageData.data[i * 4 + 1] = grayValue; // Green channel
    imageData.data[i * 4 + 2] = grayValue; // Blue channel
    imageData.data[i * 4 + 3] = 255; // Alpha channel
}

ctx.putImageData(imageData, 0, 0);

// Save the canvas as a PNG file
const out = fs.createWriteStream(__dirname + '/procedural_texture.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => {
    console.log('Texture saved as procedural_texture.png');
});
