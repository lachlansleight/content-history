import { ReactNode } from "react";
import Head from "next/head";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
    return (
        <>
            <Head>
                <title>Content History Batch Uploader</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen w-screen bg-neutral-900 text-white py-8 px-4">
                <div className="lg:w-[1000px] mx-auto">{children}</div>
            </main>
        </>
    );
};

export default Layout;
