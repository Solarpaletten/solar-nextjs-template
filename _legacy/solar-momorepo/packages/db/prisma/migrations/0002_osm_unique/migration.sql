-- Migration: 0002_osm_unique
-- Description: Add unique constraint on osm_id for OSM import deduplication

-- Add unique index on osm_id (partial - only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS "idx_houses_osm_id_unique" 
ON "houses"("osm_id") 
WHERE "osm_id" IS NOT NULL;
