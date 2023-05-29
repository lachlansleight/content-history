import { useEffect, useState } from "react";
import axios from "axios";
import FileField from "components/UserInput/molecules/FileField";
import Layout from "components/layout/Layout";
import { convertYoutubeEvent } from "lib/youtubeConversion";
import { convertSpotifyEvent } from "lib/spotifyConversion";
import {
    ContentEvent,
    EitherContentEvent,
    isSpotifyContentEvent,
    isYoutubeContentEvent,
} from "lib/types";
import YoutubeEvent from "components/YoutubeEvent";
import SpotifyEvent from "components/SpotifyEvent";
import Button from "components/UserInput/atoms/Button";
import ProgressBar from "components/ProgressBar";
import ButtonLink from "components/UserInput/atoms/ButtonLink";

const readFileAsync = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.result) resolve(reader.result as string);
            else reject("Failed to read file");
        };

        reader.onerror = () => {
            reject("Failed to read file");
        };

        reader.readAsText(file);
    });
};

const UploadPage = (): JSX.Element => {
    const [filesToConvert, setFilesToConvert] = useState<File[]>([]);
    const [transformedDownloadUrl, setTransformedDownloadUrl] = useState("");

    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [eventsToUpload, setEventsToUpload] = useState<ContentEvent[]>([]);

    const [viewCount] = useState(1000);
    const [minIndex, setMinIndex] = useState(0);

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState("");

    useEffect(() => {
        const loadFiles = async (files: File[]) => {
            const fileContents = await Promise.all(files.map(file => readFileAsync(file)));
            return fileContents;
        };

        if (filesToUpload.length === 0) return;
        loadFiles(filesToUpload).then(data => {
            const parsed = JSON.parse(data[0]);
            const alreadyDone: number[] = JSON.parse(
                localStorage.getItem("alreadyDoneEvents") || "[]"
            );
            const filtered = parsed.filter((e: any) => !alreadyDone.includes(e.id));
            setEventsToUpload(filtered);
        });
    }, [filesToUpload]);

    //Convert the raw JSON output into a nice list of content events to be pushed into the DB, with (unique, local-only!) IDs
    useEffect(() => {
        const loadFiles = async (files: File[]) => {
            const fileContents = await Promise.all(files.map(file => readFileAsync(file)));
            return fileContents;
        };

        if (filesToConvert.length === 0) return;
        const doConvert = async (files: File[]) => {
            const contents = await loadFiles(files);
            const events: EitherContentEvent[] = [];
            contents.forEach(content => {
                const data = JSON.parse(content) as any[];
                data.forEach(raw => {
                    if (raw.ms_played != null) {
                        const se = convertSpotifyEvent(raw);
                        if (se?.title) {
                            se.id = events.length + 1;
                            events.push(se);
                        }
                    } else {
                        const yte = convertYoutubeEvent(raw);
                        if (yte?.title) {
                            yte.id = events.length + 1;
                            events.push(yte);
                        }
                    }
                });
            });
            const sortedEvents = events.sort((a, b) => b.time.valueOf() - a.time.valueOf());
            sortedEvents.forEach((e, i) => (e.id = i + 1));
            setTransformedDownloadUrl(
                URL.createObjectURL(
                    new Blob([JSON.stringify(sortedEvents)], { type: "application/json" })
                )
            );
        };
        doConvert(filesToConvert);
    }, [filesToConvert]);

    const doUpload = async (events: ContentEvent[], batchSize: number) => {
        setLoading(true);
        setProgress(0);

        const alreadyDoneEventsStore = localStorage.getItem("alreadyDoneEvents");
        const alreadyDoneEvents: number[] = alreadyDoneEventsStore
            ? JSON.parse(alreadyDoneEventsStore)
            : [];
        const batchCount = Math.ceil(events.length / batchSize);

        for (let i = 0; i < events.length; i += batchSize) {
            const batch = events.slice(i, i + batchSize);
            alreadyDoneEvents.push(...batch.map(e => e.id));

            setLoadingMessage(`Adding Batch ${i + 1} / ${batchCount}`);
            localStorage.setItem("alreadyDoneEvents", JSON.stringify(alreadyDoneEvents));

            const res = await axios.post("/api/content", { content: batch });
            console.log(res.data);
            setEventsToUpload(cur => cur.filter(e => !batch.find(ee => ee.id === e.id)));

            setProgress((i + batch.length) / events.length);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="flex flex-col gap-2">
                <div>
                    <div className="flex flex-col gap-2">
                        <FileField
                            value={filesToConvert}
                            onChange={setFilesToConvert}
                            id="files"
                            label="Files to Convert"
                            options={{
                                accept: undefined,
                                maxSize: undefined,
                                multiple: true,
                            }}
                        />
                    </div>
                    <div className="flex gap-4 justify-center">
                        <Button
                            className="bg-primary-700 rounded px-2 py-1 text-lg"
                            onClick={() => localStorage.removeItem("alreadyDoneEvents")}
                        >
                            Clear cached event IDs
                        </Button>
                        {transformedDownloadUrl && (
                            <ButtonLink
                                download="content-data.json"
                                href={transformedDownloadUrl}
                                className="bg-primary-500 rounded px-2 py-1 text-lg mb-4"
                            >
                                Download Converted Data
                            </ButtonLink>
                        )}
                    </div>
                </div>
                <div>
                    <FileField
                        value={filesToUpload}
                        onChange={setFilesToUpload}
                        id="files"
                        label="Converted File"
                        options={{
                            accept: undefined,
                            maxSize: undefined,
                            multiple: false,
                        }}
                    />
                </div>
                {eventsToUpload.length > 0 && (
                    <>
                        {loading ? (
                            <div>
                                <p>{loadingMessage}</p>
                                <ProgressBar progress={progress} />
                            </div>
                        ) : (
                            <Button
                                className="bg-primary-700 rounded px-2 py-1 text-lg"
                                onClick={() => doUpload(eventsToUpload, 10)}
                            >
                                Upload to DB
                            </Button>
                        )}
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
                                disabled={minIndex >= eventsToUpload.length - viewCount}
                            >
                                Next Page
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {eventsToUpload
                                .slice(minIndex, minIndex + viewCount)
                                .map((event, i) => {
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
                                disabled={minIndex >= eventsToUpload.length - viewCount}
                            >
                                Next Page
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default UploadPage;
