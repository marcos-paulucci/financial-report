import { Request, Response} from "express";
import { getConsolidatedData, getSecondsPerUser, getAmountsPerLabel, consolidateData} from "../services/consolidationService";
import { CentralDataItem } from "../types/CentralDataItem";
import { LabelReportItem } from "../types/LabelReportItem";
import { UserReportItem } from "../types/UserReportItem";

export const buildStats = async (_: Request, res: Response) => {
    await consolidateData(); 
    res.send("Processing");
};

export const getStats = async (_: Request, res: Response) => {
    const data: CentralDataItem[] = await getConsolidatedData(); 
    res.send(data);
};

export const getLabelsReport = async (_: Request, res: Response) => {
    const data: LabelReportItem[] = getAmountsPerLabel(); 
    res.send(data);
};

export const getUsersReport = async (_: Request, res: Response) => {
    const data: UserReportItem[] = getSecondsPerUser(); 
    res.send(data);
};

export const getUserReport = async (req: Request, res: Response) => {
    const data: UserReportItem = getSecondsPerUser().find(userEl => userEl.userId === req.params.userId); 
    res.send(data);
};


