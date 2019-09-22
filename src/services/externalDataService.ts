import { HTTPGet } from "./util/HTTPService";
import { getCSVFileContents } from "./util/readFileService";
import { User } from "../types/User";
import { Streaming } from "../types/Streaming";
import { Track } from "../types/Track";

export const buildTrackFromJson = (trackJson: any): Track => {
    const arrayValues: any[] =  Object.keys(trackJson).map(function(key: string) {
        return trackJson[key];
    });
    return new Track(...arrayValues);
};

export const retrieveTracks = async (): Promise<Track[]> => {
    const tracksJson: any[] = await HTTPGet("https://backend-assignment.s3.eu-central-1.amazonaws.com/tracks.json");
    const tracks: Track[] = tracksJson.map(buildTrackFromJson);
    return tracks;
};

export const retrieveUsers = async (): Promise<User[]> => {
    const usersCSV: any[] = await getCSVFileContents("users.csv");
    const values: User[] = usersCSV.map( userCsv => {
        const arrayValues: string[] =  Object.keys(userCsv).map(function(key) {
            return userCsv[key];
        }).toString().split(";");
        return new User(...arrayValues);
    });
    return values;
};

export const retrieveStreamings = async (): Promise<Streaming[]> => {
    const streamingsCSV: any[] = await getCSVFileContents("streaming.csv");
    const values: Streaming[] = streamingsCSV.map( strCsv => {
        const arrayValues: any[] =  Object.keys(strCsv).map(function(key: string) {
            return strCsv[key];
        }).toString().split(";");
        return new Streaming(...arrayValues);
    });
    return values;
};


