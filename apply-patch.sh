#!/bin/bash

set -e

PATCH_FILE=$1

if [ -z "$PATCH_FILE" ]; then
  echo "Usage: ./apply-patch.sh <patch-file.patch>"
  exit 1
fi

if [ ! -f "$PATCH_FILE" ]; then
  echo "❌ Patch file not found: $PATCH_FILE"
  exit 1
fi

echo "📦 Applying patch: $PATCH_FILE"
echo "-----------------------------------"

BACKUP_DIR="patch-backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

if patch -p1 < "$PATCH_FILE"; then
  echo "✅ Patch applied successfully!"
else
  echo "❌ Patch failed."
  exit 1
fi
