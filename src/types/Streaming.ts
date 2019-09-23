export class Streaming {

    date: Date;
  
    userId: string;

    region: string;

    trackId: string;

    seconds: number;

    constructor (date?: Date, userId?: string, region?: string, trackId?: string, seconds?: string){
        this.date = date;
        this.userId = userId;
        this.region = region;
        this.trackId = trackId;
        this.seconds = parseInt(seconds, 10);
    }

};

