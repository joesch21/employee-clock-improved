#!/bin/bash

set -e

PATCH_FILE=$1

if [ -z "$PATCH_FILE" ]; then
  echo "Usage: ./apply-patch.sh <patch-file.patch>"
  echo "Example: ./apply-patch.sh fix-geofence.patch"
  exit 1
fi

if [ ! -f "$PATCH_FILE" ]; then
  echo "❌ Error: Patch file not found → $PATCH_FILE"
  exit 1
fi

echo "📦 Applying patch: $PATCH_FILE"
echo "-----------------------------------"

# Create backup folder
BACKUP_DIR="patch-backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📁 Backup created in: $BACKUP_DIR"

# Apply the patch
if patch -p1 < "$PATCH_FILE"; then
  echo ""
  echo "✅ Patch applied successfully!"
  echo ""
  echo "Next steps:"
  echo "  → Review changes"
  echo "  → Test with: npm run dev"
  echo "  → Commit when ready: git add . && git commit -m 'Applied $PATCH_FILE'"
else
  echo ""
  echo "❌ Patch failed to apply cleanly."
  echo "You may need to resolve conflicts manually."
  exit 1
fi
