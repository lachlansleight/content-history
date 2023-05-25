import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { NextRestApiRoute } from "lib/NextRestApiRoute";
import { convertLastFmEvent } from "lib/spotifyConversion";
import Database from "lib/Database";

const api = new NextRestApiRoute("/example");

api.get = async (req, res) => {
    let startTs: number | undefined = undefined;
    if (req.query.startTs) startTs = Math.floor(parseInt(req.query.startTs as string) / 1000);

    let endTs: number | undefined = undefined;
    if (req.query.endTs) endTs = Math.floor(parseInt(req.query.endTs as string) / 1000);

    if (!startTs) {
        const mostRecentSpotifyTrack = await Database.Instance().content.findFirst({
            where: {
                type: "spotify",
            },
            orderBy: {
                time: "desc",
            },
        });
        if (mostRecentSpotifyTrack) {
            startTs = Math.floor(new Date(mostRecentSpotifyTrack.time).valueOf() / 1000) + 1;
            console.log({ startTs });
        }
    }

    let url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=lachlansleight&api_key=${process.env.LASTFM_KEY}&format=json&limit=200`;
    if (startTs) url += "&from=" + startTs;
    if (endTs) url += "&to=" + endTs;
    let totalPages = 0;
    let curPage = 1;
    let allTracks: any[] = [];
    while (totalPages === 0 || curPage <= totalPages) {
        console.log("Getting page " + curPage + " of " + totalPages);
        const data: any = (await axios(url + "&page=" + curPage)).data;
        console.log(data);
        totalPages = Number(data.recenttracks["@attr"].totalPages);
        if (data.recenttracks.track.url) {
            allTracks = [...allTracks, data.recenttracks.track];
        } else {
            allTracks = [...allTracks, ...data.recenttracks.track];
        }
        curPage++;

        if (totalPages === 0) {
            //this means there were none to add!
            break;
        }
    }

    allTracks = allTracks.filter(t => {
        if (t["@attr"]) {
            if (t["@attr"].nowplaying === "true") return false;
        }
        return true;
    });

    if (allTracks.length === 0) {
        res.json([]);
        return;
    }
    //res.json(allTracks);
    //return;

    const events = allTracks.map(convertLastFmEvent);
    console.log("Uploading " + events.length + " events to database");
    axios.post("http://localhost:3073/api/content", { content: events });
    res.json({ allTracks, events });
};

export default (req: NextApiRequest, res: NextApiResponse) => api.handle(req, res);
