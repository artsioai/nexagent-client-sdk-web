#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SDK_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$SDK_ROOT"

echo "🔨 Building @newcast/nexagent-sdk-web library..."
npm run build

echo "📦 Packing library..."
npm pack

echo "🔄 Setting up latest build..."
rm -f nexagent-web-latest.tgz
LATEST_TARBALL=$(ls nexagent-web-*.tgz | grep -v latest | tail -1)
cp "$LATEST_TARBALL" nexagent-web-latest.tgz

echo "✅ Created nexagent-web-latest.tgz from $LATEST_TARBALL"
