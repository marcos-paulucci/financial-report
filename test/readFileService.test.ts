import { getCSVFileContents } from "../src/services/readFileService";

describe("test read CSV files", () => {
    it("should retrieve the data", async () => {
        const data = await getCSVFileContents("streaming.csv");
        expect(data).toBeTruthy();
        expect(JSON.stringify(data).length  > 0).toBe(true);
    });
});

describe("test read CSV files", () => {
    it("should retrieve the data", async () => {
        const data = await getCSVFileContents("users.csv");
        expect(data).toBeTruthy();
        expect(JSON.stringify(data).length  > 0).toBe(true);
    });
});