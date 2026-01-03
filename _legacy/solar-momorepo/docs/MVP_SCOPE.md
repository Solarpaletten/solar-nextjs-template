# MVP Scope

## What MVP IS

### Geography

- **One city only** — start with a single German city
- All buildings within city administrative boundary
- Full street-level coverage

### Map Application (map-core)

- Interactive map with building polygons
- Click on building → see info card
- Price estimate display (rent + sale ranges)
- Basic viewport-based loading
- Simple search by address

### Listing Portal (listing-portal)

- Single-page form
- Select building on mini-map OR enter address
- Choose: rent or sale
- Enter price
- Enter contact (email required, phone optional)
- Submit → listing created
- No account required

### Price Estimates

- Algorithm-based estimates
- Based on: location, size, building type
- Show as range (min-max)
- Display confidence indicator

### Data

- OSM building footprints
- Basic address data
- Generated price estimates
- User-submitted listings

---

## What MVP is NOT

### No Authentication

- No user accounts
- No login/registration
- No saved favorites
- No listing management dashboard

### No Payments

- No paid listings
- No premium features
- No payment integration
- No invoicing

### No Advanced Features

- No filters (price, size, type)
- No comparison tools
- No historical price charts
- No neighborhood analytics
- No school/transport overlays
- No 3D building view
- No street view integration

### No Multi-City

- Single city launch
- No city selector
- No regional views

### No Mobile Apps

- Web only (responsive)
- No iOS app
- No Android app

### No Integrations

- No external listing imports
- No real estate portal sync
- No CRM integration
- No email notifications
- No SMS alerts

### No Admin

- No admin dashboard
- No moderation queue
- No analytics dashboard
- Manual database operations only

---

## MVP Success Criteria

1. User can view buildings on map
2. User can see price estimate for any building
3. User can submit listing without creating account
4. Page loads under 3 seconds
5. Works on desktop Chrome/Firefox/Safari

---

## Post-MVP Roadmap (not in scope now)

| Phase | Features |
|-------|----------|
| 1.1 | Second city, basic filters |
| 1.2 | User accounts, saved listings |
| 1.3 | Listing moderation, admin panel |
| 2.0 | Mobile apps, payments |

---

## Decisions Log

| Decision | Rationale |
|----------|-----------|
| One city | Validate concept before scaling |
| No auth | Reduce friction, faster launch |
| No payments | Focus on core value first |
| Web only | Faster iteration, broader reach |
| OSM data | Free, good coverage in Germany |
