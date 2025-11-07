# Budgora App Icons Guide

## Icon Design

The Budgora app icon should feature:
- **Background**: Gradient from Indigo (#6366f1) to Purple (#8b5cf6)
- **Foreground**: Letter "B" in white or a wallet/money icon
- **Style**: Modern, clean, and recognizable at small sizes
- **Format**: PNG with transparency

## Required Icon Sizes

### iOS
- 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87
- 120x120, 152x152, 167x167, 180x180, 1024x1024

### Android
- mdpi: 48x48
- hdpi: 72x72
- xhdpi: 96x96
- xxhdpi: 144x144
- xxxhdpi: 192x192
- Adaptive icon: 1024x1024 (foreground and background)

### Web
- favicon.ico: 16x16, 32x32
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png: 180x180

## Icon Generation Tools

1. **AppIcon.co** - https://www.appicon.co/
   - Upload 1024x1024 icon
   - Generates all iOS and Android sizes

2. **Favicon Generator** - https://www.favicon-generator.org/
   - Generates web favicons

3. **RealFaviconGenerator** - https://realfavicongenerator.net/
   - Comprehensive favicon generator

## Placement

### iOS
Place icons in: `ios/BudgoraMobile/Images.xcassets/AppIcon.appiconset/`

### Android
Place icons in: `android/app/src/main/res/mipmap-*/ic_launcher.png`

### Web
Place favicons in: `public/` directory

## Quick Start

1. Create a 1024x1024 PNG icon with your design
2. Use AppIcon.co to generate all sizes
3. Download and place in appropriate directories
4. Update native project configurations

