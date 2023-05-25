import axios from "axios";
import { useEffect, useState } from "react";
import SpotifyEvent from "components/SpotifyEvent";
import Button from "components/UserInput/atoms/Button";
import YoutubeEvent from "components/YoutubeEvent";
import Layout from "components/layout/Layout";
import { EitherContentEvent, isSpotifyContentEvent, isYoutubeContentEvent } from "lib/types";

const ViewPage = (): JSX.Element => {
    const [allEvents, setAllEvents] = useState<EitherContentEvent[]>([]);
    const [viewCount] = useState(1000);
    const [minIndex, setMinIndex] = useState(0);

    useEffect(() => {
        axios.get("/api/content").then(res => {
            const data = res.data;
            data.sort(
                (a: EitherContentEvent, b: EitherContentEvent) =>
                    new Date(b.time).valueOf() - new Date(a.time).valueOf()
            );
            setAllEvents(data);
        });
    }, []);

    return (
        <Layout>
            {allEvents.length > 0 && (
                <>
                    <div className="flex gap-4 justify-center items-center">
                        <Button
                            className="bg-primary-700 rounded px-2 py-1 text-lg"
                            onClick={() => setMinIndex(cur => cur - viewCount)}
                            disabled={minIndex <= 0}
                        >
                            Last Page
                        </Button>
                        <Button
                            className="bg-primary-700 rounded px-2 py-1 text-lg"
                            onClick={() => setMinIndex(cur => cur + viewCount)}
                            disabled={minIndex >= allEvents.length - viewCount}
                        >
                            Next Page
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {allEvents.slice(minIndex, minIndex + viewCount).map((event, i) => {
                            if (isYoutubeContentEvent(event)) {
                                return <YoutubeEvent key={i} event={event} />;
                            } else if (isSpotifyContentEvent(event)) {
                                return <SpotifyEvent key={i} event={event} />;
                            } else return null;
                        })}
                    </div>
                    <div className="flex gap-4 justify-center items-center">
                        <Button
                            className="bg-primary-700 rounded px-2 py-1 text-lg"
                            onClick={() => setMinIndex(cur => cur - viewCount)}
                            disabled={minIndex <= 0}
                        >
                            Last Page
                        </Button>
                        <Button
                            className="bg-primary-700 rounded px-2 py-1 text-lg"
                            onClick={() => setMinIndex(cur => cur + viewCount)}
                            disabled={minIndex >= allEvents.length - viewCount}
                        >
                            Next Page
                        </Button>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default ViewPage;
