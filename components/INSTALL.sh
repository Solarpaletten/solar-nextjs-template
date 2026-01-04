#!/bin/bash
# ============================================================
# TASK 13.4 - Map ↔ Sidebar Real Sync
# Install script for solar-nextjs-template
# ============================================================

set -e

echo "🔧 TASK 13.4: Installing Map ↔ Sidebar Sync..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Run this script from the solar-nextjs-template root directory"
  exit 1
fi

# Backup existing files
echo "📦 Creating backups..."
mkdir -p .backup-task13.4

[ -f "types/map.ts" ] && cp types/map.ts .backup-task13.4/
[ -f "lib/clustering.ts" ] && cp lib/clustering.ts .backup-task13.4/
[ -f "components/map/MapContainer.tsx" ] && cp components/map/MapContainer.tsx .backup-task13.4/
[ -f "components/map/ClusterLayer.tsx" ] && cp components/map/ClusterLayer.tsx .backup-task13.4/
[ -f "components/HomeClient.tsx" ] && cp components/HomeClient.tsx .backup-task13.4/
[ -f "components/sidebar/ListingSidebar.tsx" ] && cp components/sidebar/ListingSidebar.tsx .backup-task13.4/

# Create directories if needed
mkdir -p types lib components/map components/sidebar

# Copy new files
echo "📝 Installing updated files..."
cp task13.4-fix/types/map.ts types/
cp task13.4-fix/lib/clustering.ts lib/
cp task13.4-fix/components/map/MapContainer.tsx components/map/
cp task13.4-fix/components/map/ClusterLayer.tsx components/map/
cp task13.4-fix/components/HomeClient.tsx components/
cp task13.4-fix/components/sidebar/ListingSidebar.tsx components/sidebar/

echo ""
echo "✅ TASK 13.4 files installed!"
echo ""
echo "📋 Files updated:"
echo "   - types/map.ts (added houseId, VisibleFeaturesEvent)"
echo "   - lib/clustering.ts (added houseId, extractVisibleHouseIds)"
echo "   - components/map/MapContainer.tsx (sync callbacks)"
echo "   - components/map/ClusterLayer.tsx (hover/select highlighting)"
echo "   - components/HomeClient.tsx (visibleHouseIds filtering)"
echo "   - components/sidebar/ListingSidebar.tsx (highlight improvements)"
echo ""
echo "🚀 Next steps:"
echo "   1. pnpm build"
echo "   2. Test locally: pnpm dev"
echo "   3. Verify sync: click cluster → zoom, click point → select"
echo "   4. git add . && git commit -m 'TASK 13.4: Map ↔ Sidebar Real Sync'"
echo "   5. git push"
echo ""
echo "🔄 To rollback: cp .backup-task13.4/* to original locations"
