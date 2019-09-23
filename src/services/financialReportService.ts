import { User } from "../types/User";
import { ConsolidatedItem } from "../types/ConsolidatedItem";
import { LabelReportItem }  from "../types/LabelReportItem";
import { UserReportItem }  from "../types/UserReportItem";

/**
* Calculates the revenue for all users according for each fee and origin
* @param users Users collection
* @returns total revenue
*/
export const calculateRevenue = (users: User[]): number => {
    return users.reduce( (total: number, currentUser: User) => {
        return total + currentUser.fee * (currentUser.origin === "app_store" ? 0.7 : 0.9);
    }, 0 );
};

/**
* Calculates the total amount to be assigned for each label
* @param centralData COnsolidated data collection
* @param totalRevenue Total revenue
* @returns A list of total amount to be assigned for each label
*/
export const calculateAmountPerLabel = (centralData: ConsolidatedItem[], totalRevenue: number): LabelReportItem[] => {
    let secondsTotal = 0;
    const secondsPerLabel: NumbersMap = centralData.reduce((totalPerLabel: NumbersMap, element: ConsolidatedItem) => {
        if (!totalPerLabel[element.track_label]){
            totalPerLabel[element.track_label] = 0;
        }
        const seconds = element.seconds;
        totalPerLabel[element.track_label] += seconds;
        secondsTotal += seconds;
        return totalPerLabel;
    }, {});
    return Object.keys(secondsPerLabel).map(label => {
        return new LabelReportItem(label, secondsPerLabel[label] * totalRevenue / secondsTotal);
    });
};

/**
* Calculates the seconds streamed per user
* @param centralData COnsolidated data collection
* @returns A list of seconds streamed per user
*/
export const calculateSecondsPerUser = (centralData: ConsolidatedItem[]): UserReportItem[] => {
    const secondsPerUser: NumbersMap = centralData.reduce((totalPerUser: NumbersMap, element: ConsolidatedItem) => {
        if (!totalPerUser[element.user_id]){
            totalPerUser[element.user_id] = 0;
        }
        totalPerUser[element.user_id] += element.seconds;
        return totalPerUser;
    }, {});
    return Object.keys(secondsPerUser).map(userId => {
        return new UserReportItem(userId, secondsPerUser[userId]);
    });
};

/**
* Calculates the seconds streamed for this user
* @param usersStats The list of streamed seconds per user
* @returns The user with its streamed seconds
*/
export const getUserStats = (usersStats: UserReportItem[], userId: string): UserReportItem => {
    return usersStats.find(userStat => userStat.userId === userId);
};


