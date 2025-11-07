#!/usr/bin/env node

/**
 * Icon Generator Script for Budgora
 * This script helps generate app icons and favicons
 * 
 * Requirements:
 * - ImageMagick or sharp package
 * - Node.js
 * 
 * Usage:
 * node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Icon sizes for different platforms
const iconSizes = {
  ios: [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024],
  android: [
    { name: 'mipmap-mdpi', size: 48 },
    { name: 'mipmap-hdpi', size: 72 },
    { name: 'mipmap-xhdpi', size: 96 },
    { name: 'mipmap-xxhdpi', size: 144 },
    { name: 'mipmap-xxxhdpi', size: 192 },
  ],
  web: [16, 32, 180], // favicon sizes
};

console.log(`
╔══════════════════════════════════════════════════════════════╗
║           Budgora Icon Generator                              ║
║                                                               ║
║  This script will help you generate app icons.               ║
║                                                               ║
║  You need to provide a source icon (1024x1024 PNG)           ║
║  Place it at: assets/icon-source.png                        ║
╚══════════════════════════════════════════════════════════════╝

Icon Design Guidelines:
- Use a gradient background: #6366f1 (indigo) to #8b5cf6 (purple)
- Include the letter "B" or a wallet/money icon
- Ensure good contrast and visibility
- Keep it simple and recognizable at small sizes

Manual Steps:
1. Create a 1024x1024 PNG icon with the design above
2. Use online tools like:
   - https://www.appicon.co/
   - https://www.favicon-generator.org/
   - https://realfavicongenerator.net/

3. For iOS, place icons in:
   ios/BudgoraMobile/Images.xcassets/AppIcon.appiconset/

4. For Android, place icons in:
   android/app/src/main/res/mipmap-*/ic_launcher.png

5. For Web favicon, place in:
   public/favicon.ico
   public/favicon-16x16.png
   public/favicon-32x32.png
   public/apple-touch-icon.png
`);

// Create directory structure
const createDirectories = () => {
  const dirs = [
    'assets/icons/ios',
    'assets/icons/android',
    'assets/icons/web',
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

createDirectories();

console.log(`
Next steps:
1. Design your icon (1024x1024 PNG)
2. Use an icon generator tool to create all sizes
3. Place the generated icons in the appropriate directories
4. Update the native project configurations
`);

