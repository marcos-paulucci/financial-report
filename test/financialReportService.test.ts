import { calculateRevenue } from "../src/services/financialReportService";
import { User } from "../src/types/User";


let users: User[] = [];
beforeAll(() => {
    users.push(
        new User(...["7699007", "premium", "8", "app_store"]),
        new User(...["7699007", "premium", "5", "web"]),
        new User(...["7699007", "premium", "3", "app_store"])
    );
});
  
  

describe("test report service calculate revenue", () => {
    it("should calculate the revenue", async () => {
        const revenue: number = calculateRevenue(users);
        expect(revenue).toEqual(8 * 0.7 + 5 * 0.9 + 3 * 0.7);
    });
});

