export interface LeadData {
    // Step 1: Business
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessCategory: string;
    businessRating: number | null;
    businessPlaceId: string;
    // Step 2: Industry & Services
    industries: string[];
    customIndustry: string;
    services: string[];
    // Step 3: Pain Points & Needs
    painPoints: string[];
    currentTools: string[];
    desiredIntegrations: string[];
    // Step 4: Team & Volume
    teamSize: string;
    monthlyCallVolume: string;
    monthlyLeadVolume: string;
    operatingHours: string;
    // Step 5: Contact
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
