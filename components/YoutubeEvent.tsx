import { YoutubeContentEvent } from "lib/types";

const YoutubeEvent = ({ event }: { event: YoutubeContentEvent }): JSX.Element => {
    return (
        <div className="flex flex-col bg-red-200 bg-opacity-10 rounded-lg p-2">
            <h2 className="text-lg font-bold">{event.title}</h2>
            <h3 className="italic mb-2">{event.channelName || ""}</h3>
            <p>{event.time.toLocaleString()}</p>
        </div>
    );
};

export default YoutubeEvent;
