import { SpotifyContentEvent } from "./types";

export interface RawSpotifyEvent {
    ts: string;
    ms_played: number;
    master_metadata_track_name: string;
    master_metadata_album_artist_name: string;
    master_metadata_album_album_name: string;
    offline_timestamp: number;
}

export interface RawLastFmEvent {
    artist: {
        mbid: string;
        "#text": string;
    };
    streamable: string;
    image: {
        size: string;
        "#text": string;
    }[];
    mbid: string;
    album: {
        mbid: string;
        "#text": string;
    };
    name: string;
    url: string;
    date: {
        uts: string;
        "#text": string;
    };
}

export const convertSpotifyEvent = (rawEvent: RawSpotifyEvent): SpotifyContentEvent => {
    const output: SpotifyContentEvent = {
        id: 0,
        type: "spotify",
        title: rawEvent.master_metadata_track_name,
        time: new Date(rawEvent.ts),
    };
    output.albumName = rawEvent.master_metadata_album_album_name;
    output.artistName = rawEvent.master_metadata_album_artist_name;
    output.duration = rawEvent.ms_played / 1000;

    return output;
};

export const convertLastFmEvent = (rawEvent: RawLastFmEvent): SpotifyContentEvent => {
    const output: SpotifyContentEvent = {
        id: 0,
        type: "spotify",
        title: rawEvent.name,
        time: new Date(parseInt(rawEvent.date.uts) * 1000),
    };
    output.albumName = rawEvent.album["#text"];
    output.artistName = rawEvent.artist["#text"];
    output.duration = 0;

    return output;
};
