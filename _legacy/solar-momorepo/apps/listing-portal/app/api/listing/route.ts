import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@solar/db';

// ============================================================
// POST /api/listing
// ============================================================

interface CreateListingBody {
  house_id: string | null;
  listing_type: 'rent' | 'sale';
  price: number;
  contact_email: string;
  contact_phone: string | null;
  description: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateListingBody = await request.json();

    // ============================================================
    // VALIDATION
    // ============================================================

    // Email required
    if (!body.contact_email || !isValidEmail(body.contact_email)) {
      return NextResponse.json(
        { status: 'error', error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Price must be positive
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { status: 'error', error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Listing type must be valid
    if (body.listing_type !== 'rent' && body.listing_type !== 'sale') {
      return NextResponse.json(
        { status: 'error', error: 'Listing type must be "rent" or "sale"' },
        { status: 400 }
      );
    }

    // Validate house_id if provided
    if (body.house_id) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(body.house_id)) {
        return NextResponse.json(
          { status: 'error', error: 'Invalid house ID format' },
          { status: 400 }
        );
      }
    }

    // ============================================================
    // CREATE LISTING
    // ============================================================

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.lightListing.create({
      data: {
        houseId: body.house_id || null,
        listingType: body.listing_type,
        price: body.price,
        contactEmail: body.contact_email.trim(),
        contactPhone: body.contact_phone?.trim() || null,
        description: body.description?.trim() || null,
        isActive: true,
        expiresAt,
      },
    });

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

// ============================================================
// HELPERS
// ============================================================

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
