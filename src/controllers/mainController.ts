import { Request, Response} from "express";
import { getConsolidatedData, getSecondsPerUser, getAmountsPerLabel, consolidateData, getRevenue} from "../services/consolidationService";
import { ConsolidatedItem } from "../types/ConsolidatedItem";
import { LabelReportItem } from "../types/LabelReportItem";
import { UserReportItem } from "../types/UserReportItem";

/**
* Start consolidating data from users, streamings and tracks, answers right away (doesn't wait for process completion)
*/
export const buildStats = async (_: Request, res: Response) => {
    try {
        consolidateData(); 
    } catch (err){
        console.error("error: " + err);
    }
    res.send("Processing");
};

/**
* Retrieve a list of the consolidated data
*/
export const getStats = async (_: Request, res: Response) => {
    const data: ConsolidatedItem[] = await getConsolidatedData(); 
    res.send(data);
};

/**
* Retrieve total revenue
*/
export const getTotalRevenue = async (_: Request, res: Response) => {
    const revenue: number = await getRevenue(); 
    res.send({ revenue });
};

/**
* Retrieve list of revenue per label
*/
export const getLabelsReport = async (_: Request, res: Response) => {
    const data: LabelReportItem[] = getAmountsPerLabel() || []; 
    res.send(data);
};

/**
* Retrieve list of seconds per user
*/
export const getUsersReport = async (_: Request, res: Response) => {
    const data: UserReportItem[] = getSecondsPerUser() || []; 
    res.send(data);
};

/**
* Retrieve seconds streamed for the user in the url param
*/
export const getUserReport = async (req: Request, res: Response) => {
    const usersData: UserReportItem[] = getSecondsPerUser();
    const resData: UserReportItem = usersData ? usersData.find(userEl => userEl.userId === req.params.userId)
        : null; 
    res.send(resData);
};


