import { HTTPGet } from "../src/services/util/HTTPService";

describe("test send GET request", () => {
    it("should return JSON data", async () => {
        const data = await HTTPGet("https://jsonplaceholder.typicode.com/todos/1");
        expect(data).toBeTruthy();
        expect(JSON.stringify(data).length  > 0).toBe(true);
    });
});