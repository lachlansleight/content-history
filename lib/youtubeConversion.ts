import { YoutubeContentEvent } from "./types";

export interface RawYoutubeEvent {
    title: string;
    titleUrl: string;
    subtitles: {
        name: string;
        url: string;
    }[],
    time: string;
}

//turn unicode escape codes into their original characters
const decodeUnicode = (str: string) => {
    return str.replace(/\\u([\d\w]{4})/gi, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
    });
}

export const convertYoutubeEvent = (rawEvent: RawYoutubeEvent): YoutubeContentEvent | null => {
    const output: YoutubeContentEvent = {
        type: "youtube",
        title: decodeUnicode(rawEvent.title.substring(8)),
        time: new Date(rawEvent.time),
    }

    //if the video or channel has been removed, return null so we don't add it to the DB
    if(output.title.substring(0, 8) === "https://") return null;
    if(output.title === "a video that has been removed") return null;

    
    output.videoUrl = rawEvent.titleUrl;

    if(rawEvent.subtitles && rawEvent.subtitles.length > 0) {
        output.channelName = rawEvent.subtitles[0].name;
    } else {
        output.channelName = "unknown";
    }
    
    return output;
}