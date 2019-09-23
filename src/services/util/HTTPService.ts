import fetch from "node-fetch";

/**
* Retrieve JSOn data from uri
* @param url
* @returns Promise for the data
*/
export const HTTPGet = async (url: string): Promise<any> => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};
