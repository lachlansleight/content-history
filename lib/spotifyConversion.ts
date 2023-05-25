import { SpotifyContentEvent } from "./types";


export interface RawSpotifyEvent {
    ts: string;
    ms_played: number;
    master_metadata_track_name: string;
    master_metadata_album_artist_name: string;
    master_metadata_album_album_name: string;
    offline_timestamp: number;
}

export const convertSpotifyEvent = (rawEvent: RawSpotifyEvent): SpotifyContentEvent => {
    const output: SpotifyContentEvent = {
        type: "spotify",
        title: rawEvent.master_metadata_track_name,
        time: new Date(rawEvent.ts),
    }
    output.albumName = rawEvent.master_metadata_album_album_name;
    output.artistName = rawEvent.master_metadata_album_artist_name;
    output.duration = rawEvent.ms_played / 1000;

    return output;
}