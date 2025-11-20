#!/bin/bash

# Script to add "Styled" prefix to all styled components in studio feature
# This ensures consistent naming convention: styled components should start with "Styled"

STUDIO_DIR="src/feature/studio/components"

# Common styled component names that need "Styled" prefix
# These are component-like names (PascalCase) that should have the prefix

declare -a NAMES=(
  "Container"
  "Wrapper"
  "Header"
  "Footer"
  "Section"
  "Content"
  "Label"
  "Title"
  "Button"
  "Icon"
  "Menu"
  "Item"
  "Input"
  "Textarea"
  "Dropdown"
  "List"
  "Text"
  "Span"
  "Div"
  "Nav"
  "Main"
  "Sidebar"
  "Toolbar"
  "Panel"
  "Card"
  "Box"
)

# Additional specific names found in studio components
declare -a SPECIFIC_NAMES=(
  "LeftSection"
  "RightSection"
  "LogoIcon"
  "TitleSection"
  "EditorTitle"
  "RoadmapTitle"
  "SavedLabel"
  "TempSaveButton"
  "SaveButton"
  "DropdownButton"
  "ButtonContent"
  "ColorSwatch"
  "ColorLabel"
  "ArrowIcon"
  "DropdownMenu"
  "DropdownItem"
  "TextContent"
  "NodeTitle"
  "Description"
  "ProgressSection"
  "ProgressBarContainer"
  "ProgressBarFill"
  "ProgressLabel"
  "ToastContainer"
  "IconWrapper"
  "Message"
  "CloseButton"
  "ToolbarContainer"
  "ToolbarSection"
  "ToolList"
  "HistoryButton"
  "HistorySection"
  "SidebarContainer"
  "SectionHeader"
  "SectionTitle"
  "SectionContent"
  "ToggleButton"
  "ToolItem"
  "ToolIcon"
  "ToolName"
  "Shortcut"
  "TextContainer"
  "TextArea"
  "InputField"
  "LabelText"
  "CharCount"
  "ErrorMessage"
)

# Combine all names
ALL_NAMES=("${NAMES[@]}" "${SPECIFIC_NAMES[@]}")

# Function to add Styled prefix to a component name
add_styled_prefix() {
  local name=$1
  local file=$2

  # Check if already has Styled prefix
  if [[ $name == Styled* ]]; then
    echo "  ✓ $name already has Styled prefix"
    return
  fi

  echo "  → Renaming $name to Styled$name in $(basename $file)"

  # Replace in styled component declaration
  sed -i '' "s/^const ${name} = styled\./const Styled${name} = styled./g" "$file"

  # Replace in JSX usage (as both opening and closing tags)
  sed -i '' "s/<${name} /<Styled${name} /g" "$file"
  sed -i '' "s/<${name}>/<Styled${name}>/g" "$file"
  sed -i '' "s/<\/${name}>/<\/Styled${name}>/g" "$file"

  # Replace self-closing tags
  sed -i '' "s/<${name}\/>/<Styled${name}\/>/g" "$file"
}

echo "🔧 Adding 'Styled' prefix to styled components in studio feature..."
echo ""

# Process all .tsx files in studio components
find "$STUDIO_DIR" -name "*.tsx" -type f | while read file; do
  echo "📄 Processing: $(basename $file)"

  # Check which styled components exist in this file
  for name in "${ALL_NAMES[@]}"; do
    # Check if this styled component exists in the file
    if grep -q "^const ${name} = styled\." "$file" 2>/dev/null; then
      add_styled_prefix "$name" "$file"
    fi
  done

  echo ""
done

echo "✅ Styled prefix addition complete!"
echo ""
echo "⚠️  Note: Please review the changes and run tests to ensure everything works correctly."
echo "    Some manual adjustments may be needed for complex cases."
