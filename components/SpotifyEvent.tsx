import { FaSpotify } from "react-icons/fa";
import { SpotifyContentEvent } from "lib/types";

const SpotifyEvent = ({ event }: { event: SpotifyContentEvent }): JSX.Element => {
    return (
        <div className="flex flex-col bg-green-200 bg-opacity-10 rounded-lg p-2 relative">
            <h2 className="text-lg font-bold">{event.title}</h2>
            <h3 className="italic mb-2">
                {event.artistName || ""} - {event.albumName || ""}
            </h3>
            <p>{event.time.toLocaleString()}</p>
            <FaSpotify className="absolute bottom-2 right-2 text-green-400 text-2xl" />
        </div>
    );
};

export default SpotifyEvent;
