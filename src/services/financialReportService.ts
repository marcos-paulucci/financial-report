import { User } from "../types/User";
import { CentralDataItem } from "../types/CentralDataItem";
import { LabelReportItem }  from "../types/LabelReportItem";
import { UserReportItem }  from "../types/UserReportItem";
export const calculateRevenue = (users: User[]): number => {
    return users.reduce( (total: number, currentUser: User) => {
        return total + currentUser.fee * (currentUser.origin === "app_store" ? 0.7 : 0.9);
    }, 0 );
};


export const calculateAmountPerLabel = (centralData: CentralDataItem[], totalRevenue: number): LabelReportItem[] => {
    let secondsTotal = 0;
    const secondsPerLabel: NumberArray = centralData.reduce((totalPerLabel: NumberArray, element: CentralDataItem) => {
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

export const calculateSecondsPerUser = (centralData: CentralDataItem[]): UserReportItem[] => {
    const secondsPerUser: NumberArray = centralData.reduce((totalPerUser: NumberArray, element: CentralDataItem) => {
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

export const getUserStats = (usersStats: UserReportItem[], userId: string): UserReportItem => {
    return usersStats.find(userStat => userStat.userId === userId);
};


