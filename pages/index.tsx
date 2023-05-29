import axios from "axios";
import { useEffect, useState } from "react";
import { FaSync } from "react-icons/fa";
import SpotifyEvent from "components/SpotifyEvent";
import Button from "components/UserInput/atoms/Button";
import YoutubeEvent from "components/YoutubeEvent";
import Layout from "components/layout/Layout";
import { EitherContentEvent, isSpotifyContentEvent, isYoutubeContentEvent } from "lib/types";

const ViewPage = (): JSX.Element => {
    const [allEvents, setAllEvents] = useState<EitherContentEvent[]>([]);
    const [viewCount] = useState(100);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("/api/content?count=true").then(res => setCount(res.data.count));
    }, []);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/content?take=${viewCount}&skip=${page * viewCount}`).then(res => {
            const data = res.data;
            data.sort(
                (a: EitherContentEvent, b: EitherContentEvent) =>
                    new Date(b.time).valueOf() - new Date(a.time).valueOf()
            );
            setAllEvents(data);
            setLoading(false);
        });
    }, [page, viewCount]);

    return (
        <Layout>
            {loading && (
                <div className="h-96 grid place-items-center">
                    <div className="flex flex-col gap-2 text-center items-center">
                        <FaSync className="animate-spin text-4xl" />
                        <span>Loading...</span>
                    </div>
                </div>
            )}
            {allEvents.length > 0 && (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 justify-center items-center">
                        <Button
                            className="bg-primary-700 rounded px-2 py-1 text-lg"
                            onClick={() => setPage(cur => cur - 1)}
                            disabled={page <= 0}
                        >
                            Last Page
                        </Button>
                        <Button
                            className="bg-primary-700 rounded px-2 py-1 text-lg"
                            onClick={() => setPage(cur => cur + 1)}
                            disabled={page >= (count - viewCount) / viewCount}
                        >
                            Next Page
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {allEvents.map((event, i) => {
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
                            onClick={() => setPage(cur => cur - 1)}
                            disabled={page <= 0}
                        >
                            Last Page
                        </Button>
                        <Button
                            className="bg-primary-700 rounded px-2 py-1 text-lg"
                            onClick={() => setPage(cur => cur + 1)}
                            disabled={page >= (count - viewCount) / viewCount}
                        >
                            Next Page
                        </Button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ViewPage;
