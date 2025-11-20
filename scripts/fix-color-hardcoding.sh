#!/bin/bash
STUDIO_DIR="src/feature/studio/components"

echo "🔄 Replacing color hardcoding with design tokens..."

# Node brand colors
find "$STUDIO_DIR" -name "*.tsx" -type f -exec sed -i '' \
  -e 's/#2666dc/\${tokens.colors.primary[500]}/g' \
  -e 's/#a826dc/\${tokens.colors.primary[600]}/g' \
  -e 's/#dc2626/\${tokens.colors.error[500]}/g' \
  -e 's/#ea580c/\${tokens.colors.warning[500]}/g' \
  -e 's/#e6c200/\${tokens.colors.warning[400]}/g' \
  -e 's/#16a34a/\${tokens.colors.success[500]}/g' \
  {} \;

# Neutral colors
find "$STUDIO_DIR" -name "*.tsx" -type f -exec sed -i '' \
  -e 's/#e3e8ef/\${tokens.colors.neutral[200]}/g' \
  -e 's/#9aa4b2/\${tokens.colors.neutral[400]}/g' \
  -e 's/#6b7684/\${tokens.colors.neutral[500]}/g' \
  -e 's/#6B7684/\${tokens.colors.neutral[500]}/g' \
  -e 's/#f2f5fa/\${tokens.colors.neutral[100]}/g' \
  {} \;

# Text colors
find "$STUDIO_DIR" -name "*.tsx" -type f -exec sed -i '' \
  -e 's/#111827/\${tokens.colors.neutral[900]}/g' \
  -e 's/#4b5563/\${tokens.colors.neutral[600]}/g' \
  -e 's/#666666/\${tokens.colors.neutral[600]}/g' \
  {} \;

# Selection/focus colors
find "$STUDIO_DIR" -name "*.tsx" -type f -exec sed -i '' \
  -e 's/#4a81f0/\${tokens.colors.primary[400]}/g' \
  {} \;

# Error color for toast
find "$STUDIO_DIR" -name "*.tsx" -type f -exec sed -i '' \
  -e 's/#ff0000/\${tokens.colors.error[500]}/g' \
  {} \;

# System colors (#ffffff and #000000 kept as tokens.colors.white/black)
find "$STUDIO_DIR" -name "*.tsx" -type f -exec sed -i '' \
  -e 's/#ffffff/\${tokens.colors.white}/g' \
  -e 's/#000000/\${tokens.colors.black}/g' \
  {} \;

echo "✅ Color hardcoding replacement complete"
echo "📊 Checking remaining hardcoded colors..."
remaining=$(grep -r "#[0-9a-fA-F]\{6\}" "$STUDIO_DIR" --include="*.tsx" | wc -l | xargs)
echo "Remaining: $remaining instances"
