# 📝 Listing Portal

Property listing submission application.

---

## Features

- 📍 3-step submission form
- 🗺️ Map-based location picker
- ✅ Form validation (Zod)
- 📧 Contact information capture

---

## Quick Start

```bash
# From monorepo root
pnpm --filter @solar/listing-portal dev

# Or directly
cd apps/listing-portal
pnpm dev
```

Open http://localhost:3001

---

## Environment Variables

Create `.env` file:

```env
# Required
DATABASE_URL="postgresql://user:pass@host:port/database"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."
```

---

## Form Steps

### Step 1: Address

- Street
- House number
- City
- Postal code
- Location picker (map)

### Step 2: Property Details

- Listing type (rent/sale)
- Price
- Number of rooms
- Area (sqm)
- Building type
- Description

### Step 3: Contact

- Name
- Email
- Phone (optional)
- Submission confirmation

---

## API Route

### POST /api/listing

Creates new listing.

**Request Body:**
```json
{
  "address": {
    "street": "Alexanderplatz",
    "number": "1",
    "city": "Berlin",
    "postcode": "10178",
    "coordinates": [13.41, 52.52]
  },
  "property": {
    "type": "rent",
    "price": 1200,
    "rooms": 3,
    "areaSqm": 85,
    "buildingType": "apartments",
    "description": "..."
  },
  "contact": {
    "name": "Max Mustermann",
    "email": "max@example.com",
    "phone": "+49..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "listingId": "uuid"
}
```

---

## Project Structure

```
apps/listing-portal/
├── app/
│   ├── page.tsx              # Main form
│   ├── layout.tsx
│   └── api/
│       └── listing/
│           └── route.ts      # POST endpoint
├── components/
│   ├── ListingForm.tsx       # Multi-step form
│   ├── AddressStep.tsx
│   ├── DetailsStep.tsx
│   ├── ContactStep.tsx
│   └── LocationPicker.tsx    # Map component
├── lib/
│   └── validation.ts         # Zod schemas
└── package.json
```

---

## Validation

Using Zod for form validation:

```typescript
const listingSchema = z.object({
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    city: z.string().min(1),
    postcode: z.string().regex(/^\d{5}$/),
  }),
  property: z.object({
    type: z.enum(['rent', 'sale']),
    price: z.number().positive(),
    rooms: z.number().int().positive().optional(),
    areaSqm: z.number().positive().optional(),
  }),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
});
```

---

## Development

```bash
# Start dev server
pnpm dev

# Build
pnpm build

# Type check
pnpm typecheck
```

---

## Integration

Listing Portal creates records in `listings` table.

If coordinates are provided, the system attempts to:
1. Find existing house by point
2. Link listing to house
3. Or create orphan listing (house_id = null)

---

*Part of SolarHousePrice monorepo*
