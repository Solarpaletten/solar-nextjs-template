# 📡 API Reference

Solar House Price — REST API Documentation

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## Endpoints

### 1. GET /api/clusters

Get clustered points for map visualization.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bbox` | string | ✅ | Bounding box: `minLng,minLat,maxLng,maxLat` |
| `zoom` | number | ✅ | Map zoom level (1-20) |

**Example:**
```bash
GET /api/clusters?bbox=6.90,46.22,7.00,46.29&zoom=14
```

**Response:** GeoJSON FeatureCollection with clusters and individual points.

---

### 2. GET /api/segments

Get price segment breakdown for a cluster.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cluster_id` | number | ✅ | Cluster ID |

**Example:**
```bash
GET /api/segments?cluster_id=1
```

---

### 3. GET /api/houses

Get houses in bounding box.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `bbox` | string | - | Bounding box filter |
| `limit` | number | 100 | Max results (max: 1000) |
| `offset` | number | 0 | Pagination offset |

---

### 4. POST /api/houses

Create a new house.

**Body:**
```json
{
  "osm_id": "12345678",
  "building_type": "residential",
  "area_sqm": 120.5,
  "floors": 3,
  "centroid": { "lat": 46.255, "lng": 6.954 }
}
```

---

### 5. GET /api/house/:id

Get single house with price estimate.

**Response includes:** house data + price_estimate object

---

### 6. GET /api/price

Get price estimate for a house.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `house_id` | UUID | ✅ | House ID |

**Response:**
```json
{
  "price_sqm": 7420,
  "price_total": 630700,
  "method": "aggregated",
  "confidence": 0.78,
  "cached": false,
  "response_time_ms": 45
}
```

---

## Price Segments

| Segment | Range | Color |
|---------|-------|-------|
| low | < 6,000/m² | `#22c55e` |
| mid | 6,000-8,000 | `#3b82f6` |
| upper | 8,000-10,000 | `#f97316` |
| premium | > 10,000 | `#ef4444` |

---

## Error Format

```json
{ "error": "Error message" }
```

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

*API v1.0.0 — January 2026*
