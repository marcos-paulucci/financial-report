import { createReadStream } from "fs";
import csv  from "csv-parser";
import path from "path";

const getFilePath =  (fileName: string) => path.join(__dirname, "../..", "files", fileName);

/**
* Retrieve data for a csv file. This csv package uses streams, which will not block the event loop and will take
* pieces of the file asynchronously by filling a buffer and calling our callback to process the new chunks of data
* @param filename to be located on the files directory
* @returns Promise for the data
*/
const _getCSVFileContents = (filename: string): Promise<any[]> => {
    const dataAcum: any[] = [];
    return new Promise((resolve, _) => {
        createReadStream(getFilePath(filename))
            .pipe(csv({ separator: "\n" }))
            .on("data", function(data){
                try {
                    dataAcum.push(data);
                }
                catch(err) {
                    console.error(err);
                }
            })
            .on("end",function(){
                resolve(dataAcum);
            });
    });
};

export const getCSVFileContents = _getCSVFileContents;

