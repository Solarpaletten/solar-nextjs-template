#!/bin/bash
# ============================================================
# TASK 14 - Switzerland Only / City Lock
# Install script for solar-nextjs-template
# ============================================================
# GOAL: Remove ALL Germany/Berlin references
# SET: Monthey, Valais, Switzerland as default
# ============================================================

set -e

echo "🇨🇭 TASK 14: Switzerland Only - Monthey City Lock"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Run this script from the solar-nextjs-template root directory"
  exit 1
fi

# Backup existing files
echo "📦 Creating backups..."
mkdir -p .backup-task14

[ -f "app/listings/page.tsx" ] && cp app/listings/page.tsx .backup-task14/
[ -f "app/api/segments/route.ts" ] && cp app/api/segments/route.ts .backup-task14/
[ -f "app/api/clusters/route.ts" ] && cp app/api/clusters/route.ts .backup-task14/

# Create directories if needed
mkdir -p app/listings app/api/segments app/api/clusters

# Copy new files
echo "📝 Installing Switzerland-only files..."
cp task14-fix/app/listings/page.tsx app/listings/
cp task14-fix/app/api/segments/route.ts app/api/segments/
cp task14-fix/app/api/clusters/route.ts app/api/clusters/

echo ""
echo "✅ TASK 14 files installed!"
echo ""
echo "📋 Files updated:"
echo "   - app/listings/page.tsx (Monthey demo addresses)"
echo "   - app/api/segments/route.ts (Monthey coordinates, CHF labels)"
echo "   - app/api/clusters/route.ts (dynamic bbox, no hardcoded coords)"
echo ""
echo "🔍 Verifying no Germany references remain..."

# Check for any remaining Berlin/Germany references
FOUND=$(grep -rn -i "berlin\|germany\|52\.52\|13\.405\|alexanderplatz\|friedrichstraße" \
  --include="*.ts" --include="*.tsx" \
  app/ components/ lib/ config/ hooks/ types/ 2>/dev/null || true)

if [ -z "$FOUND" ]; then
  echo "✅ SUCCESS: No Germany/Berlin references found!"
else
  echo "⚠️ WARNING: Found potential Germany references:"
  echo "$FOUND"
fi

echo ""
echo "🚀 Next steps:"
echo "   1. pnpm build"
echo "   2. Test locally: pnpm dev"
echo "   3. Verify map starts at Monthey (46.255, 6.954)"
echo "   4. git add . && git commit -m 'TASK 14: Switzerland Only - Monthey City Lock'"
echo "   5. git push"
echo ""
echo "🔄 To rollback: cp .backup-task14/* to original locations"
echo ""
echo "🇨🇭 Switzerland → Monthey is now the ONLY geography!"
