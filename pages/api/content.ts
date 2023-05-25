import { NextApiRequest, NextApiResponse } from "next";
import { ContentType } from "@prisma/client";
import { NextRestApiRoute, RestError } from "lib/NextRestApiRoute";
import { EitherContentEvent } from "lib/types";
import Database from "lib/Database";

const api = new NextRestApiRoute("/example");

api.get = async (req, res) => {
    let type: string | undefined = undefined;
    if (req.query.type) type = req.query.type as string;

    let startTs: number | undefined = undefined;
    if (req.query.startTs) startTs = parseInt(req.query.startTs as string);

    let endTs: number | undefined = undefined;
    if (req.query.endTs) endTs = parseInt(req.query.endTs as string);

    let limit: number | undefined = undefined;
    if (req.query.limit) limit = parseInt(req.query.limit as string);

    console.log("Fetching from DB");
    const data = await Database.Instance().content.findMany({
        where: {
            type: type ? (type as ContentType) : undefined,
            time: {
                gte: startTs ? new Date(startTs) : undefined,
                lte: endTs ? new Date(endTs) : undefined,
            },
        },
        take: limit,
    });

    res.json(data);
};

api.post = async (req, res) => {
    const contentToAdd = req.body.content as EitherContentEvent[];
    if (!contentToAdd) throw new RestError("No content provided", 400);

    console.log("Inserting into DB, first title: " + contentToAdd[0].title);
    const data = await Database.Instance().content.createMany({
        data: contentToAdd.map(c => ({ ...c, id: undefined })),
    });
    console.log("Records added");
    await Database.disconnect();

    res.json({ result: "success", recordsAdded: data.count });
};

api.delete = async (req, res) => {
    let type: string | undefined = undefined;
    if (req.query.type) type = req.query.type as string;

    let startTs: number | undefined = undefined;
    if (req.query.startTs) startTs = parseInt(req.query.startTs as string);

    let endTs: number | undefined = undefined;
    if (req.query.endTs) endTs = parseInt(req.query.endTs as string);

    await Database.Instance().content.deleteMany({
        where: {
            type: type ? (type as ContentType) : undefined,
            time: {
                gte: startTs ? new Date(startTs) : undefined,
                lte: endTs ? new Date(endTs) : undefined,
            },
        },
    });

    res.json({ result: "success" });
};

export default (req: NextApiRequest, res: NextApiResponse) => api.handle(req, res);
