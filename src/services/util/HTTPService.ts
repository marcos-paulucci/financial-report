import fetch from "node-fetch";

export const HTTPGet = async (url: string): Promise<any> => {
    //"https://jsonplaceholder.typicode.com/todos/1"
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};
