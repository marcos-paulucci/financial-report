import { SourceOfTruth } from "./SourceOfTruth";
import { LabelReportItem } from "./LabelReportItem";
import { UserReportItem } from "./UserReportItem";


export class DBSingleton {

    private static _instance: DBSingleton;

    static getInstance()
    {
        return this._instance || (this._instance = new this());
    }

    sourceOfTruth: SourceOfTruth;
    revenue: number;

    amountsPerLabel: LabelReportItem[];

    secondsPerUser: UserReportItem[];


    private constructor(sourceOfTruth?: SourceOfTruth, revenue?: number, amountsPerLabel?: LabelReportItem[], secondsPerUser?: UserReportItem[]) {
        this.sourceOfTruth = sourceOfTruth;
        this.revenue = revenue;
        this.amountsPerLabel = amountsPerLabel;
        this.secondsPerUser = secondsPerUser;
    }

};

