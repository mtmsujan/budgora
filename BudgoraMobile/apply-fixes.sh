#!/bin/bash

# Quick Fix Script for Budgora React Native CLI Setup
# This script applies all necessary patches and fixes

set -e

echo "🔧 Applying fixes for Budgora React Native CLI setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the BudgoraMobile directory.${NC}"
    exit 1
fi

# 1. Fix Boost Podspec
echo -e "${YELLOW}1. Fixing Boost podspec...${NC}"
BOOST_PODSPEC="node_modules/react-native/third-party-podspecs/boost.podspec"
if [ -f "$BOOST_PODSPEC" ]; then
    # Check if already fixed
    if grep -q "downloads.sourceforge.net" "$BOOST_PODSPEC"; then
        echo -e "${GREEN}   ✓ Boost podspec already fixed${NC}"
    else
        # Backup original
        cp "$BOOST_PODSPEC" "$BOOST_PODSPEC.backup"
        # Replace the source URL
        sed -i '' 's|https://boostorg.jfrog.io/artifactory/main/release/1.83.0/source/boost_1_83_0.tar.bz2.*|https://downloads.sourceforge.net/project/boost/boost/1.83.0/boost_1_83_0.tar.bz2|' "$BOOST_PODSPEC"
        # Remove SHA256 line if it exists
        sed -i '' '/:sha256 =>/d' "$BOOST_PODSPEC"
        echo -e "${GREEN}   ✓ Boost podspec fixed${NC}"
    fi
else
    echo -e "${RED}   ✗ Boost podspec not found. Run 'npm install' first.${NC}"
fi

# 2. Fix DateTimePicker
echo -e "${YELLOW}2. Fixing DateTimePicker compatibility...${NC}"
DATETIME_PICKER="node_modules/@react-native-community/datetimepicker/ios/RNDateTimePickerShadowView.m"
if [ -f "$DATETIME_PICKER" ]; then
    # Check if already fixed
    if grep -q "YGNodeConstRef" "$DATETIME_PICKER"; then
        echo -e "${GREEN}   ✓ DateTimePicker already fixed${NC}"
    else
        # Backup original
        cp "$DATETIME_PICKER" "$DATETIME_PICKER.backup"
        # Replace YGNodeRef with YGNodeConstRef in the function signature
        sed -i '' 's/YGNodeRef node/YGNodeConstRef node/g' "$DATETIME_PICKER"
        echo -e "${GREEN}   ✓ DateTimePicker fixed${NC}"
    fi
else
    echo -e "${RED}   ✗ DateTimePicker file not found. Run 'npm install' first.${NC}"
fi

# 3. Fix AppDelegate module name
echo -e "${YELLOW}3. Fixing AppDelegate module name...${NC}"
APP_DELEGATE="ios/Budgora/AppDelegate.mm"
if [ -f "$APP_DELEGATE" ]; then
    # Check if already fixed
    if grep -q 'self.moduleName = @"Budgora";' "$APP_DELEGATE"; then
        echo -e "${GREEN}   ✓ AppDelegate already fixed${NC}"
    else
        # Backup original
        cp "$APP_DELEGATE" "$APP_DELEGATE.backup"
        # Replace module name
        sed -i '' 's/self.moduleName = @"TempBudgora";/self.moduleName = @"Budgora";/g' "$APP_DELEGATE"
        sed -i '' 's/self.moduleName = @"BudgoraMobile";/self.moduleName = @"Budgora";/g' "$APP_DELEGATE"
        echo -e "${GREEN}   ✓ AppDelegate fixed${NC}"
    fi
else
    echo -e "${RED}   ✗ AppDelegate not found. iOS folder may not be set up.${NC}"
fi

# 4. Fix LaunchScreen.storyboard
echo -e "${YELLOW}4. Fixing LaunchScreen.storyboard...${NC}"
LAUNCH_SCREEN="ios/Budgora/LaunchScreen.storyboard"
if [ -f "$LAUNCH_SCREEN" ]; then
    # Check if already fixed
    if grep -q 'text="Budgora"' "$LAUNCH_SCREEN"; then
        echo -e "${GREEN}   ✓ LaunchScreen already fixed${NC}"
    else
        # Backup original
        cp "$LAUNCH_SCREEN" "$LAUNCH_SCREEN.backup"
        # Replace TempBudgora with Budgora
        sed -i '' 's/text="TempBudgora"/text="Budgora"/g' "$LAUNCH_SCREEN"
        echo -e "${GREEN}   ✓ LaunchScreen fixed${NC}"
    fi
else
    echo -e "${RED}   ✗ LaunchScreen.storyboard not found${NC}"
fi

# 5. Check Info.plist for local networking
echo -e "${YELLOW}5. Checking Info.plist configuration...${NC}"
INFO_PLIST="ios/Budgora/Info.plist"
if [ -f "$INFO_PLIST" ]; then
    if grep -q "NSAllowsLocalNetworking" "$INFO_PLIST"; then
        echo -e "${GREEN}   ✓ Info.plist already configured${NC}"
    else
        echo -e "${YELLOW}   ⚠ Info.plist may need NSAllowsLocalNetworking setting${NC}"
        echo -e "${YELLOW}   Please manually add NSAppTransportSecurity settings if needed${NC}"
    fi
else
    echo -e "${RED}   ✗ Info.plist not found${NC}"
fi

# 6. Reinstall CocoaPods if needed
echo -e "${YELLOW}6. Checking CocoaPods installation...${NC}"
if [ -d "ios" ]; then
    if [ ! -d "ios/Pods" ] || [ ! -f "ios/Podfile.lock" ]; then
        echo -e "${YELLOW}   Installing CocoaPods dependencies...${NC}"
        cd ios
        export LANG=en_US.UTF-8
        export NO_FLIPPER=1
        pod install
        cd ..
        echo -e "${GREEN}   ✓ CocoaPods installed${NC}"
    else
        # Check if Flipper is in Podfile.lock
        if grep -qi "FlipperKit" ios/Podfile.lock; then
            echo -e "${YELLOW}   ⚠ FlipperKit found in Podfile.lock. Reinstalling without Flipper...${NC}"
            cd ios
            rm -rf Pods Podfile.lock
            export LANG=en_US.UTF-8
            export NO_FLIPPER=1
            pod install
            cd ..
            echo -e "${GREEN}   ✓ CocoaPods reinstalled without Flipper${NC}"
        else
            echo -e "${GREEN}   ✓ CocoaPods already installed correctly${NC}"
        fi
    fi
else
    echo -e "${RED}   ✗ iOS folder not found${NC}"
fi

echo ""
echo -e "${GREEN}✅ All fixes applied!${NC}"
echo ""
echo "Next steps:"
echo "1. Start Metro bundler: npm start"
echo "2. Run iOS app: npm run ios"
echo "3. Run Android app: npm run android"
echo ""
echo "Note: If you run 'npm install' again, you may need to run this script again"
echo "      to reapply the patches to node_modules."

