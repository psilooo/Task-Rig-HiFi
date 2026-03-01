declare global {
    interface Window {
        google?: {
            maps: {
                places: {
                    AutocompleteService: new () => {
                        getPlacePredictions: (
                            request: { input: string; types?: string[] },
                            callback: (results: Array<{
                                place_id?: string;
                                description: string;
                                structured_formatting?: { main_text: string; secondary_text: string };
                            }> | null, status: string) => void
                        ) => void;
                    };
                    PlacesService: new (div: HTMLElement) => {
                        getDetails: (
                            request: { placeId: string; fields: string[] },
                            callback: (place: {
                                name?: string;
                                formatted_address?: string;
                                formatted_phone_number?: string;
                                rating?: number;
                                types?: string[];
                            } | null, status: string) => void
                        ) => void;
                    };
                    PlacesServiceStatus: { OK: string };
                };
            };
        };
    }
}

export {};
