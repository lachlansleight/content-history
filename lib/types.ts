export interface ContentEvent {
    id: number;
    type: "youtube" | "spotify";
    title: string;
    time: Date;
}

export type EitherContentEvent = YoutubeContentEvent | SpotifyContentEvent;

export interface SpotifyContentEvent extends ContentEvent {
    type: "spotify";
    duration?: number;
    artistName?: string;
    albumName?: string;
}

export interface YoutubeContentEvent extends ContentEvent {
    type: "youtube";
    videoUrl?: string;
    channelName?: string;
}

//youtube type check
export const isYoutubeContentEvent = (event: ContentEvent): event is YoutubeContentEvent => {
    return event.type === "youtube";
};

//spotify type check
export const isSpotifyContentEvent = (event: ContentEvent): event is SpotifyContentEvent => {
    return event.type === "spotify";
};
