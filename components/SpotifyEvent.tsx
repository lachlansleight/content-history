import { SpotifyContentEvent } from "lib/types";


const SpotifyEvent = ({event}: {event: SpotifyContentEvent}): JSX.Element => {
    return (
        <div className="flex flex-col bg-green-200 bg-opacity-10 rounded-lg p-2">
            <h2 className="text-lg font-bold">{event.title}</h2>
            <h3 className="italic mb-2">{event.artistName || ""} - {event.albumName || ""}</h3>
            <p>{event.time.toLocaleString()}</p>
        </div>
    )
}

export default SpotifyEvent;