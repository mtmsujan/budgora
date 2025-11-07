# Favicon Generation Instructions

## Quick Favicon Generation

1. Use the SVG template: `BudgoraMobile/assets/icon-template.svg`
2. Convert to PNG using an online tool or ImageMagick:
   ```bash
   # Using ImageMagick (if installed)
   convert -background none -resize 1024x1024 icon-template.svg icon-1024.png
   ```

3. Generate favicons using:
   - https://realfavicongenerator.net/
   - https://www.favicon-generator.org/

4. Place generated files in `public/` directory:
   - favicon.ico
   - favicon-16x16.png
   - favicon-32x32.png
   - apple-touch-icon.png (180x180)

## Alternative: Use Online Generator

1. Visit https://realfavicongenerator.net/
2. Upload your 1024x1024 PNG icon
3. Configure settings:
   - iOS: Use "Apple touch icon"
   - Android: Use "Android Chrome"
   - Windows: Use "Windows Metro"
4. Download and extract to `public/` directory
5. Update `resources/views/app.blade.php` if needed


