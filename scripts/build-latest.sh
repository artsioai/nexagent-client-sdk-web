#!/bin/bash

set -e

echo "🔨 Building @nexagent/web library..."
npm run build

echo "📦 Packing library..."
npm pack

echo "🔄 Setting up latest build..."
rm -f nexagent-web-latest.tgz
LATEST_TARBALL=$(ls nexagent-web-*.tgz | grep -v latest | tail -1)
cp "$LATEST_TARBALL" nexagent-web-latest.tgz

echo "✅ Created nexagent-web-latest.tgz from $LATEST_TARBALL"
