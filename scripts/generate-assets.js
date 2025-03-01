const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate social preview image
function generateSocialPreview() {
  // Standard size for Twitter/FB previews - 1200x630
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background - using the Classic theme color
  ctx.fillStyle = '#fef3c7'; // Light amber color
  ctx.fillRect(0, 0, width, height);

  // Header bar in red like Classic theme
  ctx.fillStyle = '#fecaca'; // Red-200
  ctx.fillRect(0, 0, width, 60);

  // Title text
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#111827'; // Gray-900
  ctx.textAlign = 'center';
  ctx.fillText('Greentext Generator', width / 2, 150);

  // Greentext example
  const greentextLines = [
    '>be me',
    '>making social preview',
    '>looks pretty good',
    '>feels good man'
  ];

  ctx.font = 'bold 32px Courier';
  ctx.fillStyle = '#10B981'; // Green-500
  let y = 250;
  greentextLines.forEach(line => {
    ctx.fillText(line, width / 2, y);
    y += 50;
  });

  // Features
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#374151'; // Gray-700
  ctx.fillText('Create • Customize • Save • Share', width / 2, 500);

  // Write to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'social-preview.png'), buffer);
  console.log('Social preview image created!');
}

// Generate favicon
function generateFavicon() {
  const size = 64;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#10B981'; // Green-500
  ctx.fillRect(0, 0, size, size);

  // ">" symbol
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('>', size / 2, size / 2);

  // Write to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buffer);
  console.log('Favicon created!');
}

// Run the generators
generateSocialPreview();
generateFavicon();