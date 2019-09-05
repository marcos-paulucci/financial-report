import { HTTPGet } from "./HTTPService";
import { getCSVFileContents } from "./readFileService";
import { User } from "../types/User";
import { Streaming } from "../types/Streaming";
import { Track } from "../types/Track";


const buildObjectFromValues = (values: string[], instance: any) => {
    return values.reduce( (obj: any, value: any, index: number) => {
        const keys: string[] = Object.keys(instance),
            actualKey = keys[index];
        obj[actualKey] = value;          
        return obj;
    }, instance);
};

const _buildTrackFromJson = (trackJson: any): Track => {
    const arrayValues: any[] =  Object.keys(trackJson).map(function(key: string) {
        return trackJson[key];
    });
    return buildObjectFromValues(arrayValues, new Track());
};

const _buildUserFromJson = (userValues: any[]): User => {
    return buildObjectFromValues(userValues, new User());
};

const _buildStreamingsFromJson = (streamingValues: any[]): Streaming => {
    return buildObjectFromValues(streamingValues, new Streaming());
}; 

const _retrieveTracks = async (): Promise<Track[]> => {
    const tracksJson: any[] = await HTTPGet("https://backend-assignment.s3.eu-central-1.amazonaws.com/tracks.json");
    const tracks: Track[] = tracksJson.map(_buildTrackFromJson);
    return tracks;
};

const _retrieveUsers = async (): Promise<User[]> => {
    const usersCSV: any[] = await getCSVFileContents("users.csv");
    const values: User[] = usersCSV.map( userCsv => {
        const arrayValues: string[] =  Object.keys(userCsv).map(function(key) {
            return userCsv[key];
        }).toString().split(";");
        return _buildUserFromJson(arrayValues);
    });
    return values;
};

const _retrieveStreamings = async (): Promise<Streaming[]> => {
    const streamingsCSV: Streaming[] = await getCSVFileContents("streaming.csv");
    const values: Streaming[] = streamingsCSV.map( strCsv => {
        const arrayValues: any[] =  Object.keys(strCsv).map(function(key: string) {
            return strCsv[key];
        }).toString().split(";");
        return _buildStreamingsFromJson(arrayValues);
    });
    return values;
};

export const retrieveTracks = _retrieveTracks;
export const retrieveUsers = _retrieveUsers;
export const retrieveStreamings = _retrieveStreamings;

export const buildTrackFromJson = _buildTrackFromJson;

export const buildUserFromJson = _buildUserFromJson;


