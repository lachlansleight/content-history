import { useEffect, useState } from "react";
import FileField from "components/UserInput/molecules/FileField";
import Layout from "components/layout/Layout";
import { convertYoutubeEvent } from "lib/youtubeConversion";
import { convertSpotifyEvent } from "lib/spotifyConversion";
import { ContentEvent, SpotifyContentEvent, YoutubeContentEvent, isSpotifyContentEvent, isYoutubeContentEvent } from "lib/types";
import YoutubeEvent from "components/YoutubeEvent";
import SpotifyEvent from "components/SpotifyEvent";
import Button from "components/UserInput/atoms/Button";

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
}

const HomePage = (): JSX.Element => {

    const [testFiles, setTestFiles] = useState<File[]>([]);
    const [fileContent, setFileContent] = useState<string[]>([]);

    const [contentEvents, setContentEvents] = useState<ContentEvent[]>([]);
    const [viewCount, setViewCount] = useState(1000);
    const [minIndex, setMinIndex] = useState(0);

    useEffect(() => {

        const loadFiles = async (files: File[]) => {
            const fileContents = await Promise.all(files.map(file => readFileAsync(file)));
            return fileContents;
        }

        if(testFiles.length === 0) return;
        setFileContent([]);
        loadFiles(testFiles).then(setFileContent);
    }, [testFiles]);

    useEffect(() => {
        if(fileContent.length === 0) return;

        const spotifyEvents: SpotifyContentEvent[] = [];
        const youtubeEvents: YoutubeContentEvent[] = [];
        fileContent.forEach(content => {
            const jsonData = JSON.parse(content) as any[];

            jsonData.forEach(raw => {
                if(raw.ms_played != null) {
                    spotifyEvents.push(convertSpotifyEvent(raw));
                } else {
                    const yte = convertYoutubeEvent(raw);
                    if(yte) youtubeEvents.push(yte);
                }
            })
        });
        
        setContentEvents([...spotifyEvents, ...youtubeEvents].sort((a, b) => b.time.valueOf() - a.time.valueOf()));
    }, [fileContent]);

    return (
        <Layout>
            <div className="flex flex-col gap-2">
                <div>
                    <FileField value={testFiles} onChange={setTestFiles} id="files" label="Files" options={{
                        accept: undefined,
                        maxSize: undefined,
                        multiple: true,
                    }} />
                </div>
                {contentEvents.length > 0 && (
                    <>
                    <div className="flex gap-4 justify-center items-center">
                        <Button className="bg-primary-700 rounded px-2 py-1 text-lg" onClick={() => setMinIndex(cur => cur - viewCount)} disabled={minIndex <= 0}>Last Page</Button>
                        <Button className="bg-primary-700 rounded px-2 py-1 text-lg" onClick={() => setMinIndex(cur => cur + viewCount)} disabled={minIndex >= contentEvents.length - viewCount}>Next Page</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {contentEvents.slice(minIndex, minIndex + viewCount).map((event, i) => {
                            if(isYoutubeContentEvent(event)) {
                                return <YoutubeEvent key={i} event={event} />
                            } else if(isSpotifyContentEvent(event)) {
                                return <SpotifyEvent key={i} event={event} />
                            } else return null;
                        })}
                    </div>
                    <div className="flex gap-4 justify-center items-center">
                        <Button className="bg-primary-700 rounded px-2 py-1 text-lg" onClick={() => setMinIndex(cur => cur - viewCount)} disabled={minIndex <= 0}>Last Page</Button>
                        <Button className="bg-primary-700 rounded px-2 py-1 text-lg" onClick={() => setMinIndex(cur => cur + viewCount)} disabled={minIndex >= contentEvents.length - viewCount}>Next Page</Button>
                    </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;

/*
//Leaving this here so that I don't have to keep looking up the syntax...
import { GetServerSidePropsContext } from "next/types";
export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: any }> {
    return {
        props: {  },
    };
}
*/
