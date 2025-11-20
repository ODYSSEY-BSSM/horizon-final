#!/bin/bash

# Script to remove font hardcoding and use tokens instead

STUDIO_DIR="src/feature/studio/components"

echo "🔧 Removing font hardcoding in studio components..."
echo ""

# Replace font-family hardcoding
find "$STUDIO_DIR" -name "*.tsx" -type f -exec sed -i '' \
  -e "s/font-family: 'SUIT Variable', sans-serif/font-family: \${tokens.typos.fontFamily.suit}/g" \
  -e "s/font-family: 'Material Symbols Rounded', sans-serif/font-family: \${tokens.typos.fontFamily.materialSymbols}/g" \
  {} \;

# Replace font-weight numbers with tokens
find "$STUDIO_DIR" -name "*.tsx" -type f -exec sed -i '' \
  -e "s/font-weight: 300;/font-weight: \${tokens.typos.fontWeight.light};/g" \
  -e "s/font-weight: 400;/font-weight: \${tokens.typos.fontWeight.regular};/g" \
  -e "s/font-weight: 500;/font-weight: \${tokens.typos.fontWeight.medium};/g" \
  -e "s/font-weight: 600;/font-weight: \${tokens.typos.fontWeight.semibold};/g" \
  -e "s/font-weight: 700;/font-weight: \${tokens.typos.fontWeight.bold};/g" \
  {} \;

echo "✅ Font hardcoding removal complete!"
echo ""
echo "Affected files:"
grep -r "font-family.*SUIT Variable" "$STUDIO_DIR" --include="*.tsx" 2>/dev/null | wc -l | xargs echo "  Remaining SUIT hardcoding:"
grep -r "font-weight: [0-9]" "$STUDIO_DIR" --include="*.tsx" 2>/dev/null | wc -l | xargs echo "  Remaining weight numbers:"
