export class CentralDataItem {
    date: Date;

    user_id: string;

    product_type: string;
    fee: number;

    origin: string;

    region: string;

    track_id: string;

    track_name: string;

    track_label: string;

    seconds: number;

    constructor(date: Date, user_id: string, product_type: string, fee: number, 
        origin: string, region: string, track_id: string, track_name: string, 
        track_label: string, seconds: number){
            this.date = date;
            this.user_id = user_id;
            this.product_type = product_type;
            this.fee = fee;
            this.origin = origin;
            this.region = region;
            this.track_id = track_id;
            this.track_name = track_name;
            this.track_label = track_label;
            this.seconds = seconds;
    }
};