import { createReadStream } from "fs";
import csv  from "csv-parser";
import path from "path";

const getFilePath =  (fileName: string) => path.join(__dirname, "..", "files", fileName);


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
                console.log("end of file");
            });
    });
};

export const getCSVFileContents = _getCSVFileContents;

