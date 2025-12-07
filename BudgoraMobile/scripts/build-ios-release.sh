#!/bin/bash

echo "Opening Xcode for iOS Archive..."

cd BudgoraMobile

# Open Xcode
open ios/Budgora.xcworkspace

echo "In Xcode:"
echo "1. Select 'Any iOS Device'"
echo "2. Product → Archive"
echo "3. In Organizer, click 'Distribute App'"
echo "4. Follow prompts to upload to App Store Connect"
