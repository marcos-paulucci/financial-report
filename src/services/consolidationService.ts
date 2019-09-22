import { User } from "../types/User";
import { Streaming } from "../types/Streaming";
import { Track } from "../types/Track";
import { SourceOfTruth } from "../types/SourceOfTruth";
import { CentralDataItem } from "../types/CentralDataItem";
import { LabelReportItem } from "../types/LabelReportItem";
import { UserReportItem } from "../types/UserReportItem";
import { UsersArray } from "../types/UsersArray";
import { TracksArray } from "../types/TracksArray";
import { retrieveTracks, retrieveUsers, retrieveStreamings } from "./externalDataService";
import { calculateAmountPerLabel, calculateRevenue, calculateSecondsPerUser } from "./financialReportService";
import consolidationDAO from "../daos/ConsolidationDAO";

 
export const buildDataSource = (
    users: User[],
    tracks: Track[],
    streamings: Streaming[],
    endDate: Date,
    usersMap: UsersArray = {},
    tracksMap: TracksArray = {},
    secondsStreamed: number = 0,
    rowsResult: CentralDataItem[] =  [],
    currentIndex: number = 0
): Promise<SourceOfTruth> => {
    console.log("Date: " + endDate);
    const getUser = (userId: string): User => {
        let user: User = usersMap[userId];
        if (!user){
            user = users.find(user => user.id === userId);
            usersMap[userId] = user;
        }
        return user;
    };
    const getTrack = (trackId: string): Track => {
        let track: Track = tracksMap[trackId];
        if (!track){
            track = tracks.find(track => track.id === trackId);
            tracksMap[trackId] = track;
        }
        return track;
    };
    const consolidatedPromise: Promise<SourceOfTruth> = new Promise((resolve) => {
        let i: number = currentIndex;
        while(i < streamings.length && new Date() < endDate){
            const streaming: Streaming = streamings[i];
            const track: Track = getTrack(streaming.trackId);
            if (track) {
                const user: User = getUser(streaming.userId);
                secondsStreamed += streaming.seconds;
                rowsResult.push(new CentralDataItem(streaming.date, streaming.userId, user.productType, user.fee, 
                    user.origin, streaming.region, streaming.trackId, track.name, 
                    track.label, streaming.seconds));
            }
            i++;
        }
        if (i < streamings.length){
            const newEndDate = new Date(endDate.getTime() + 2);
            setImmediate(buildDataSource.bind(
                null,
                users,
                tracks,
                streamings,
                newEndDate,
                usersMap,
                tracksMap,
                secondsStreamed,
                rowsResult,
                i));
        } else {
            resolve(new SourceOfTruth(rowsResult, secondsStreamed));
        }
    });
    return consolidatedPromise;
    
};

export const consolidateData = async () => {
    const users = await retrieveUsers();
    const tracks = await retrieveTracks();
    const streamings = await retrieveStreamings();
    const currentTime = new Date();
    const centralData: SourceOfTruth = await buildDataSource(users, tracks, streamings, new Date(currentTime.getTime() + 1));
    const revenue: number = calculateRevenue(users);
    const amountsPerLabel: LabelReportItem[] = calculateAmountPerLabel(centralData.centralDataRows, revenue);
    const secondsPerUser: UserReportItem[] = calculateSecondsPerUser(centralData.centralDataRows);
    consolidationDAO.amountsPerLabel = amountsPerLabel;
    consolidationDAO.secondsPerUser = secondsPerUser;
    consolidationDAO.revenue = revenue;
    consolidationDAO.sourceOfTruth = centralData;
};

export const getConsolidatedData = (): CentralDataItem[]  => {
    return consolidationDAO.sourceOfTruth.centralDataRows;
};

export const getSecondsPerUser = (): UserReportItem[]  => {
    return consolidationDAO.secondsPerUser;
};

export const getAmountsPerLabel = (): LabelReportItem[]  => {
    return consolidationDAO.amountsPerLabel;
};