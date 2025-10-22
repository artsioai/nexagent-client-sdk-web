#!/bin/bash

set -e

echo "🔨 Building @nextagent/web library..."
npm run build

echo "📦 Packing library..."
npm pack

echo "🔄 Setting up latest build..."
rm -f nextagent-web-latest.tgz
LATEST_TARBALL=$(ls nextagent-web-*.tgz | grep -v latest | tail -1)
cp "$LATEST_TARBALL" nextagent-web-latest.tgz

echo "✅ Created nextagent-web-latest.tgz from $LATEST_TARBALL"
