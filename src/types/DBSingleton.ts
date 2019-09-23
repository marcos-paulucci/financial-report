import { Consolidated } from "./Consolidated";
import { LabelReportItem } from "./LabelReportItem";
import { UserReportItem } from "./UserReportItem";


export class DBSingleton {

    private static _instance: DBSingleton;

    static getInstance()
    {
        return this._instance || (this._instance = new this());
    }

    consolidated: Consolidated;
    revenue: number;

    amountsPerLabel: LabelReportItem[];

    secondsPerUser: UserReportItem[];


    private constructor(consolidated?: Consolidated, revenue?: number, amountsPerLabel?: LabelReportItem[], secondsPerUser?: UserReportItem[]) {
        this.consolidated = consolidated;
        this.revenue = revenue;
        this.amountsPerLabel = amountsPerLabel;
        this.secondsPerUser = secondsPerUser;
    }

};

