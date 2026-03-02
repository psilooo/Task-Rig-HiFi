export interface LeadData {
    // Phase 1: Your Business
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessCategory: string;
    businessRating: number | null;
    businessPlaceId: string;
    industries: string[];
    customIndustry: string;
    services: string[];
    // Phase 2: Your Needs
    painPoints: string[];
    currentTools: string[];
    desiredIntegrations: string[];
    teamSize: string;
    // Phase 3: Let's Connect
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    contactRole: string;
    preferredContactMethod: string;
    notes: string;
    consentMarketing: boolean;
    consentTransactional: boolean;
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
