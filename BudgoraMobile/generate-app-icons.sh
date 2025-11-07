#!/bin/bash

# Quick App Icon Generator for Budgora
# This script creates placeholder app icons from the SVG template

set -e

echo "🎨 Generating app icons for Budgora..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${YELLOW}⚠ ImageMagick not found. Installing via Homebrew...${NC}"
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo -e "${RED}✗ Homebrew not found. Please install ImageMagick manually:${NC}"
        echo "  brew install imagemagick"
        echo ""
        echo "Or use an online tool:"
        echo "1. Convert assets/icon-template.svg to PNG (1024x1024)"
        echo "2. Use https://www.appicon.co/ to generate all sizes"
        echo "3. Place icons in ios/Budgora/Images.xcassets/AppIcon.appiconset/"
        exit 1
    fi
fi

# Check if SVG template exists
SVG_TEMPLATE="assets/icon-template.svg"
if [ ! -f "$SVG_TEMPLATE" ]; then
    echo -e "${RED}✗ SVG template not found at $SVG_TEMPLATE${NC}"
    exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo -e "${GREEN}✓ Created temporary directory${NC}"

# Generate 1024x1024 base icon
echo -e "${YELLOW}Generating base icon (1024x1024)...${NC}"
convert -background none -resize 1024x1024 "$SVG_TEMPLATE" "$TEMP_DIR/icon-1024.png"

# iOS icon sizes (in points, need @2x and @3x)
IOS_SIZES=(
    "20:40:60"    # 20pt -> 40px @2x, 60px @3x
    "29:58:87"    # 29pt -> 58px @2x, 87px @3x
    "40:80:120"   # 40pt -> 80px @2x, 120px @3x
    "60:120:180"  # 60pt -> 120px @2x, 180px @3x
)

IOS_DIR="ios/Budgora/Images.xcassets/AppIcon.appiconset"
mkdir -p "$IOS_DIR"

echo -e "${YELLOW}Generating iOS icons...${NC}"

# Generate iOS icons
for size_info in "${IOS_SIZES[@]}"; do
    IFS=':' read -r pt_size px2x px3x <<< "$size_info"
    
    # @2x
    convert -background none -resize "${px2x}x${px2x}" "$TEMP_DIR/icon-1024.png" "$TEMP_DIR/icon-${pt_size}@2x.png"
    
    # @3x
    convert -background none -resize "${px3x}x${px3x}" "$TEMP_DIR/icon-1024.png" "$TEMP_DIR/icon-${pt_size}@3x.png"
done

# Generate 1024x1024 marketing icon
cp "$TEMP_DIR/icon-1024.png" "$TEMP_DIR/icon-1024-marketing.png"

# Copy icons to iOS directory
echo -e "${YELLOW}Copying icons to iOS directory...${NC}"
cp "$TEMP_DIR/icon-20@2x.png" "$IOS_DIR/icon-20@2x.png"
cp "$TEMP_DIR/icon-20@3x.png" "$IOS_DIR/icon-20@3x.png"
cp "$TEMP_DIR/icon-29@2x.png" "$IOS_DIR/icon-29@2x.png"
cp "$TEMP_DIR/icon-29@3x.png" "$IOS_DIR/icon-29@3x.png"
cp "$TEMP_DIR/icon-40@2x.png" "$IOS_DIR/icon-40@2x.png"
cp "$TEMP_DIR/icon-40@3x.png" "$IOS_DIR/icon-40@3x.png"
cp "$TEMP_DIR/icon-60@2x.png" "$IOS_DIR/icon-60@2x.png"
cp "$TEMP_DIR/icon-60@3x.png" "$IOS_DIR/icon-60@3x.png"
cp "$TEMP_DIR/icon-1024-marketing.png" "$IOS_DIR/icon-1024.png"

# Update Contents.json
echo -e "${YELLOW}Updating Contents.json...${NC}"
cat > "$IOS_DIR/Contents.json" << 'EOF'
{
  "images" : [
    {
      "filename" : "icon-20@2x.png",
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "20x20"
    },
    {
      "filename" : "icon-20@3x.png",
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "20x20"
    },
    {
      "filename" : "icon-29@2x.png",
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "29x29"
    },
    {
      "filename" : "icon-29@3x.png",
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "29x29"
    },
    {
      "filename" : "icon-40@2x.png",
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "40x40"
    },
    {
      "filename" : "icon-40@3x.png",
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "40x40"
    },
    {
      "filename" : "icon-60@2x.png",
      "idiom" : "iphone",
      "scale" : "2x",
      "size" : "60x60"
    },
    {
      "filename" : "icon-60@3x.png",
      "idiom" : "iphone",
      "scale" : "3x",
      "size" : "60x60"
    },
    {
      "filename" : "icon-1024.png",
      "idiom" : "ios-marketing",
      "scale" : "1x",
      "size" : "1024x1024"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
EOF

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}✅ App icons generated successfully!${NC}"
echo ""
echo "Icons have been placed in: $IOS_DIR"
echo ""
echo "Next steps:"
echo "1. Rebuild the app: npm run ios"
echo "2. The icon should now appear in the simulator"
echo ""
echo "Note: These are placeholder icons. For production, create a professional"
echo "      icon design and regenerate using https://www.appicon.co/"

