import { AddressType, Client, Language, Place, PlaceData } from "@googlemaps/google-maps-services-js";

const client = new Client({});

const api_key = process.env["GOOGLE_MAPS_API_KEY"];
const google_signature = process.env["GOOGLE_API_SIGNATURE"];

interface PlaceInfo extends Place {
    place_types: string[];
}

export async function searchPlacesByQuery(query: string): Promise<Place[]> {
    let resp = await client.textSearch({
        params: {
            query: query,
            key: api_key,
        }
    });

    for (let place of resp.data.results) {
        for (let photo of place.photos || []) {
            photo.photo_reference = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${api_key}`;
        }
    }

    return resp.data.results;
}

export async function getPlaceInfo(id: string): Promise<Partial<PlaceData>> {
    let resp = await client.placeDetails({
        params: {
            place_id: id,
            language: Language.ko,
            key: api_key,
        }
    });

    if (resp.status != 200) {
        throw new Error(`Failed to get place info: ${resp.status} ${resp.statusText}`);
    }

    let place = resp.data.result;

    for (let photo of place.photos || []) {
        photo.photo_reference = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${api_key}`;
    }

    return  resp.data.result;
}