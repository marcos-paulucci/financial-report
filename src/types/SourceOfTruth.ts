import { CentralDataItem } from "CentralDataItem";

export class SourceOfTruth {
    centralDataRows: CentralDataItem[];

    secondsStreamed: number;

    constructor(centralDataRows: CentralDataItem[], secondsStreamed: number){
            this.centralDataRows = centralDataRows;
            this.secondsStreamed = secondsStreamed;
    }
};