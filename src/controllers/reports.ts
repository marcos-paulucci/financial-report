import { Request, Response} from "express";
import { getCSVFileContents } from "../services/readFileService";
import { HTTPGet } from "../services/HTTPService";

export const testGetStreamingFile = (req: Request, res: Response) => {
    getCSVFileContents(req.params.fileName);
    res.send({ result: "1000" });
};

export const testGetHTTPResponse = (req: Request, res: Response) => {
    HTTPGet(req.params.url);
    res.send({ result: "1000" });
};


