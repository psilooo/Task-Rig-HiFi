export interface LeadData {
    // Phase 1: Trade
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessRating: number | null;
    businessPlaceId: string;
    industry: string;        // single selection now (was industries[])
    customIndustry: string;

    // Phase 2: Needs
    painPoints: string[];    // max 3
    teamSize: string;

    // Phase 3: Preview (no new data — computed from Phase 1+2)

    // Phase 4: Book
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    consentSms: boolean;     // single consolidated consent

    // Booking
    appointmentSlot: string | null;  // ISO datetime from calendar

    // Meta
    source: string;
    completedAt: string | null;
}

export interface PlacePrediction {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

export interface PlaceDetails {
    name: string;
    formatted_address: string;
    formatted_phone_number?: string;
    rating?: number;
    types?: string[];
}
