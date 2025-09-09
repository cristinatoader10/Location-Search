import type {Place} from './Place';

interface SearchResult {
    features: {
        geometry: {
            coordinates: number[];
        }
        properties: {
            place_id: number;
            display_name: string;
        }
    }[]
}

export const search = async (term: string) => {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.search = new URLSearchParams({
        q: term,
        format: "geojson",
        addressdetails: "1",
        limit: "5",
    }).toString();

    const res = await fetch(url.toString(), {
        headers: {"User-Agent": "MyApp/1.0 (contact@example.com)"},
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Nominatim ${res.status} ${res.statusText} — ${body}`);
    }
    const data : SearchResult = await res.json();
    const places: Place[] = data.features.map((feature) => {
        return{
            id: feature.properties.place_id,
            name: feature.properties.display_name,
            longitude: feature.geometry.coordinates[0],
            latitude: feature.geometry.coordinates[1]
        }
    });
    return places;
};
