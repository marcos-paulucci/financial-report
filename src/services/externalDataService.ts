import { HTTPGet } from "./util/HTTPService";
import { getCSVFileContents } from "./util/readFileService";
import { User } from "../types/User";
import { Streaming } from "../types/Streaming";
import { Track } from "../types/Track";
const tracksUri = require("config").get("tracks-uri");
const usersFile = require("config").get("users-file");
const streamingsFile = require("config").get("streamings-file");

/**
* @returns Builds a track out of an array of values
*/
export const buildTrackFromJson = (trackJson: any): Track => {
    const arrayValues: any[] =  Object.keys(trackJson).map(function(key: string) {
        return trackJson[key];
    });
    return new Track(...arrayValues);
};

/**
* @returns Retrieves tracks from endpoint and builds tracks array
*/
export const retrieveTracks = async (): Promise<Track[]> => {
    const tracksJson: any[] = await HTTPGet(tracksUri);
    const tracks: Track[] = tracksJson.map(buildTrackFromJson);
    return tracks;
};

/**
* @returns Retrieves users from file and builds users array
*/
export const retrieveUsers = async (): Promise<User[]> => {
    const usersCSV: any[] = await getCSVFileContents(usersFile);
    const values: User[] = usersCSV.map( userCsv => {
        const arrayValues: string[] =  Object.keys(userCsv).map(function(key) {
            return userCsv[key];
        }).toString().split(";");
        return new User(...arrayValues);
    });
    return values;
};


/**
* @returns Retrieves streamings from file and builds streamings array
*/
export const retrieveStreamings = async (): Promise<Streaming[]> => {
    const streamingsCSV: any[] = await getCSVFileContents(streamingsFile);
    const values: Streaming[] = streamingsCSV.map( strCsv => {
        const arrayValues: any[] =  Object.keys(strCsv).map(function(key: string) {
            return strCsv[key];
        }).toString().split(";");
        return new Streaming(...arrayValues);
    });
    return values;
};


