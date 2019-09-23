export class User {
    id: string;

    productType: string;

    fee: number;
    origin: string;

    constructor(id?: string, productType?: string, fee?: string, origin?: string) {
        this.id = id;
        this.productType = productType;
        this.fee = parseFloat(fee.replace(",","."));
        this.origin = origin;
    }
};

