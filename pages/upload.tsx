import { useEffect, useState } from "react";
import axios from "axios";
import FileField from "components/UserInput/molecules/FileField";
import Layout from "components/layout/Layout";
import { convertYoutubeEvent } from "lib/youtubeConversion";
import { convertSpotifyEvent } from "lib/spotifyConversion";
import {
    ContentEvent,
    EitherContentEvent,
    SpotifyContentEvent,
    YoutubeContentEvent,
    isSpotifyContentEvent,
    isYoutubeContentEvent,
} from "lib/types";
import YoutubeEvent from "components/YoutubeEvent";
import SpotifyEvent from "components/SpotifyEvent";
import Button from "components/UserInput/atoms/Button";
import ProgressBar from "components/ProgressBar";

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
    const [testFiles, setTestFiles] = useState<File[]>([]);
    const [fileContent, setFileContent] = useState<Record<string, string>>({});

    const [contentEvents, setContentEvents] = useState<Record<string, ContentEvent[]>>({});
    const [flatEvents, setFlatEvents] = useState<ContentEvent[]>([]);
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

        if (testFiles.length === 0) return;
        setFileContent({});
        loadFiles(testFiles).then(data => {
            const out: Record<string, string> = {};
            for (let i = 0; i < testFiles.length; i++) {
                out[testFiles[i].name] = data[i];
            }
            setFileContent(out);
        });
    }, [testFiles]);

    useEffect(() => {
        if (Object.keys(fileContent).length === 0) return;

        const spotifyEvents: SpotifyContentEvent[] = [];
        const youtubeEvents: YoutubeContentEvent[] = [];
        const newEvents: Record<string, EitherContentEvent[]> = {};

        let id = 1;
        Object.keys(fileContent).forEach(fileName => {
            newEvents[fileName] = [];

            const content = fileContent[fileName];
            const jsonData = JSON.parse(content) as any[];

            jsonData.forEach(raw => {
                if (raw.ms_played != null) {
                    const se = convertSpotifyEvent(raw);
                    if (se.title) {
                        spotifyEvents.push({ ...se, id });
                        newEvents[fileName].push({ ...se, id });
                        id++;
                    }
                } else {
                    const yte = convertYoutubeEvent(raw);
                    if (yte) {
                        youtubeEvents.push({ ...yte, id });
                        newEvents[fileName].push({ ...yte, id });
                        id++;
                    }
                }
            });
        });
        setContentEvents(newEvents);
        const allEvents = [...spotifyEvents, ...youtubeEvents];
        setFlatEvents(allEvents.sort((a, b) => b.time.valueOf() - a.time.valueOf()));
    }, [fileContent]);

    const doUpload = async (events: Record<string, ContentEvent[]>, batchSize: number) => {
        setLoading(true);
        setProgress(0);

        const alreadyDoneEventsStore = localStorage.getItem("alreadyDoneEvents");
        const alreadyDoneEvents: string[] = alreadyDoneEventsStore
            ? JSON.parse(alreadyDoneEventsStore)
            : [];
        const newlyDoneEvents: string[] = [];

        const filteredEvents: Record<string, ContentEvent[]> = {};
        Object.keys(events).forEach(fileName => {
            filteredEvents[fileName] = events[fileName].filter(event => {
                return !alreadyDoneEvents.includes(fileName + "_" + event.id.toString());
            });
        });

        const fileKeys = Object.keys(filteredEvents);
        const batchCounts = fileKeys.map(fn => Math.ceil(filteredEvents[fn].length / batchSize));
        const batchCount = batchCounts.reduce((a, b) => a + b, 0);

        const eventsThatWereFiltered = events[fileKeys[0]].filter(
            e => filteredEvents[fileKeys[0]].findIndex(ee => ee.title === e.title) === -1
        );
        console.log({ eventsThatWereFiltered });

        let totalDone = 0;
        for (let i = 0; i < fileKeys.length; i++) {
            for (let j = 0; j < batchCounts[i]; j++) {
                setLoadingMessage(
                    `Adding File ${i + 1}/${fileKeys.length}, Batch ${j + 1} / ${batchCounts[i]}`
                );

                const eventsToUpload = filteredEvents[fileKeys[i]].slice(
                    j * batchSize,
                    (j + 1) * batchSize
                );
                newlyDoneEvents.push(
                    ...eventsToUpload.map(event => fileKeys[i] + "_" + event.id.toString())
                );
                localStorage.setItem("alreadyDoneEvents", JSON.stringify(newlyDoneEvents));

                const res = await axios.post("/api/content", { content: eventsToUpload });
                console.log(res.data);

                totalDone++;
                setProgress(totalDone / batchCount);
            }
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="flex flex-col gap-2">
                <div>
                    <FileField
                        value={testFiles}
                        onChange={setTestFiles}
                        id="files"
                        label="Files"
                        options={{
                            accept: undefined,
                            maxSize: undefined,
                            multiple: true,
                        }}
                    />
                </div>
                {flatEvents.length > 0 && (
                    <>
                        {loading ? (
                            <div>
                                <p>{loadingMessage}</p>
                                <ProgressBar progress={progress} />
                            </div>
                        ) : (
                            <Button
                                className="bg-primary-700 rounded px-2 py-1 text-lg"
                                onClick={() => doUpload(contentEvents, 5)}
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
                                disabled={minIndex >= flatEvents.length - viewCount}
                            >
                                Next Page
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {flatEvents.slice(minIndex, minIndex + viewCount).map((event, i) => {
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
                                disabled={minIndex >= flatEvents.length - viewCount}
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

/*
//Leaving this here so that I don't have to keep looking up the syntax...
import { GetServerSidePropsContext } from "next/types";
export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: any }> {
    return {
        props: {  },
    };
}
*/
