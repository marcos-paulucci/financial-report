import { ConsolidatedItem } from "ConsolidatedItem";

export class Consolidated {
    centralDataRows: ConsolidatedItem[];

    secondsStreamed: number;

    constructor(centralDataRows: ConsolidatedItem[], secondsStreamed: number){
            this.centralDataRows = centralDataRows;
            this.secondsStreamed = secondsStreamed;
    }
};