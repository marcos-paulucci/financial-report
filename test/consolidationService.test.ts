import { buildDataSource } from "../src/services/consolidationService";
import { calculateAmountPerLabel, calculateSecondsPerUser } from "../src/services/financialReportService";
import { retrieveTracks, retrieveUsers, retrieveStreamings } from "../src/services/externalDataService";
import { User } from "../src/types/User";
import { Streaming } from "../src/types/Streaming";
import { Track } from "../src/types/Track";
import { Consolidated } from "../src/types/Consolidated";
import { ConsolidatedItem } from "../src/types/ConsolidatedItem";
import { LabelReportItem } from "../src/types/LabelReportItem";
import { UserReportItem } from "../src/types/UserReportItem";
const partitioningTime = 100;

let users: User[];
let tracks: Track[];
let streamings: Streaming[] = [];
let sourceOfTruth: Consolidated;
let sourceOfTruthItems: ConsolidatedItem[] = [];
beforeAll(async () => {
    users = await retrieveUsers();
    tracks = await retrieveTracks();
    streamings = await retrieveStreamings();
    sourceOfTruthItems.push(
        new ConsolidatedItem(new Date(), "user-1", "", 0, "", "", "", "", "label1", 50),
        new ConsolidatedItem(new Date(), "user-1", "", 0, "", "", "", "", "label1", 30),
        new ConsolidatedItem(new Date(), "user-2", "", 0, "", "", "", "", "label2", 20)
    );
    sourceOfTruth = new Consolidated(sourceOfTruthItems, 100);
});
  
  

describe("should build central data source", () => {
    it("should build central data source", async () => {
        const sourceOfTruth: Consolidated = await buildDataSource(users, tracks, streamings, new Date(new Date().getTime() + partitioningTime));
        expect(sourceOfTruth).toBeTruthy();
        expect(sourceOfTruth.centralDataRows.length  > 0).toBe(true);
        expect(sourceOfTruth.centralDataRows.length).toBeLessThanOrEqual(streamings.length);


    });
});

describe("should calculate revenue per label correctly", () => {
    it("should calculate revenue per label correctly", async () => {
        const totalRevenue = 100;
        const result: LabelReportItem[] =  calculateAmountPerLabel(sourceOfTruth.centralDataRows, totalRevenue);
        expect(result).toBeTruthy();
        expect(result.length  > 0).toBe(true);
        expect(result.find(el => el.label === "label1").amount).toEqual(80 / 100 * totalRevenue);
        expect(result.find(el => el.label === "label2").amount).toEqual(20 / 100 * totalRevenue);

    });
});

describe("should calculate total seconds streamed per user correctly", () => {
    it("should calculate total seconds streamed per user correctly", async () => {
        const result: UserReportItem[] =  calculateSecondsPerUser(sourceOfTruth.centralDataRows);
        expect(result).toBeTruthy();
        expect(result.length  > 0).toBe(true);
        expect(result.find(el => el.userId === "user-1").seconds).toEqual(80);
        expect(result.find(el => el.userId === "user-2").seconds).toEqual(20);

    });
});

