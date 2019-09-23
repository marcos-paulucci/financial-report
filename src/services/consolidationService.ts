import { User } from "../types/User";
import { Streaming } from "../types/Streaming";
import { Track } from "../types/Track";
import { Consolidated } from "../types/Consolidated";
import { ConsolidatedItem } from "../types/ConsolidatedItem";
import { LabelReportItem } from "../types/LabelReportItem";
import { UserReportItem } from "../types/UserReportItem";
import { UsersMap } from "../types/UsersMap";
import { TracksMap } from "../types/TracksMap";
import { retrieveTracks, retrieveUsers, retrieveStreamings } from "./externalDataService";
import { calculateAmountPerLabel, calculateRevenue, calculateSecondsPerUser } from "./financialReportService";
import { DBSingleton } from "../types/DBSingleton";

const consolidationDAO: DBSingleton =  DBSingleton.getInstance();
const partitioningTime: number = parseInt(require("config").get("partitioning-time"), 10);
 
/**
* Build the consolidated data source.
* @param users The users from the users file
* @param tracks The tracks from the tracks endpoint
* @param streamings The streamings from the streamings file
* @param endDate The time by which the process should stop and release the thread for the event loop to continue working
* @param usersMap Associative array userId -> user . Defaults to empty
* @param tracksMap The tracks array trackId -> track . Defaults to empty
* @param secondsStreamed The total seconds streamed, defaults to 0
* @param rowsResult The consolidated rows result. Starts as an empty array and the process adds the new created rows on each iteration
* @param currentIndex The current index of the streamings file we are currently on. Starts at 0
* @param resolveMethodParam The Promise.resolve method
* @returns A Promise of the Consolidated data
*/
export const buildDataSource = (
    users: User[],
    tracks: Track[],
    streamings: Streaming[],
    endDate: Date,
    usersMap: UsersMap = {},
    tracksMap: TracksMap = {},
    secondsStreamed: number = 0,
    rowsResult: ConsolidatedItem[] =  [],
    currentIndex: number = 0,
    resolveMethodParam?: Function
): Promise<Consolidated> => {

    /**
    * Retrieve the user with this id from the users list.
    * @param userId The user id
    * @returns User
    */
    const getUser = (userId: string): User => {
        let user: User = usersMap[userId];
        if (!user){
            user = users.find(user => user.id === userId);
            usersMap[userId] = user;
        }
        return user;
    };
    /**
    * Retrieve the track with this id from the tracks list.
    * @param trackId The track id
    * @returns Track
    */
    const getTrack = (trackId: string): Track => {
        let track: Track = tracksMap[trackId];
        if (!track){
            track = tracks.find(track => track.id === trackId);
            tracksMap[trackId] = track;
        }
        return track;
    };
    /**
    * Since the amount of data to process can be long, this method
    * does the job of building data for a certain amount of time defined by endDate.
    * Uses micro tasking/partitioning by calling setImmediate to avoid I/O starvation and to avoid blocking the event loop. 
    * @param resolveMethod The Promise.resolve method to resolve the Promise when we got to the end of the streamings array
    */
    const doWork = (resolveMethod: Function) => {
        let i: number = currentIndex;
        while(i < streamings.length && new Date() < endDate){
            const streaming: Streaming = streamings[i];
            const track: Track = getTrack(streaming.trackId);
            if (track) {
                const user: User = getUser(streaming.userId);
                secondsStreamed += streaming.seconds;
                rowsResult.push(new ConsolidatedItem(streaming.date, streaming.userId, user.productType, user.fee, 
                    user.origin, streaming.region, streaming.trackId, track.name, 
                    track.label, streaming.seconds));
            }
            i++;
        }      
        if (i < streamings.length){
            const newEndDate = new Date(endDate.getTime() + partitioningTime);
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
                i,
                resolveMethod));
        } else {
            resolveMethod(new Consolidated(rowsResult, secondsStreamed));
            console.log("consolidation finished!");
        }
    };
    // If current index is 0 it means we are on the first call to the function and we have to return a promise of the result
    // and start doing work, passing the Promise's resolve function.
    if (currentIndex === 0 ){
        return new Promise((resolve) => {
            doWork(resolve);
        });
    } else {
        // Otherwise we just do the work passing again the received Promise.resolve parameter
        doWork(resolveMethodParam);
    }
};

/**
* COnsolidate the data from users, streamings, tracks, into a single place, an in memory object that is actually a singleton
* @param trackId The track id
* @returns Track
*/
export const consolidateData = async () => {
    const users = await retrieveUsers();
    const tracks = await retrieveTracks();
    const streamings = await retrieveStreamings();
    const currentTime = new Date();
    let centralData: Consolidated;
    try {
        centralData = await buildDataSource(users, tracks, streamings, new Date(currentTime.getTime() + partitioningTime));
    } catch(error){
        console.error();
    }
    const revenue: number = calculateRevenue(users);
    const amountsPerLabel: LabelReportItem[] = calculateAmountPerLabel(centralData.centralDataRows, revenue);
    const secondsPerUser: UserReportItem[] = calculateSecondsPerUser(centralData.centralDataRows);
    consolidationDAO.amountsPerLabel = amountsPerLabel;
    consolidationDAO.secondsPerUser = secondsPerUser;
    consolidationDAO.revenue = revenue;
    consolidationDAO.consolidated = centralData;
};

/**
* @returns The consolidated data or an empty array in case consolidation has never run
*/
export const getConsolidatedData = (): ConsolidatedItem[]  => {
    return consolidationDAO.consolidated ? consolidationDAO.consolidated.centralDataRows : [];
};

/**
* @returns The total revenue or null in case consolidation has never run
*/
export const getRevenue = (): number  => {
    return consolidationDAO.revenue || null;
};

/**
* @returns The list of seconds per user or an empty array in case consolidation has never run
*/
export const getSecondsPerUser = (): UserReportItem[]  => {
    return consolidationDAO.secondsPerUser;
};

/**
* @returns The amounts per label or an empty array in case consolidation has never run
*/
export const getAmountsPerLabel = (): LabelReportItem[]  => {
    return consolidationDAO.amountsPerLabel;
};