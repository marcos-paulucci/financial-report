export class User {
    id: string;

    productType: string;

    fee: number;
    origin: string;

    constructor(id?: string, productType?: string, fee?: number, origin?: string) {
        this.id = id;
        this.productType = productType;
        this.fee = fee;
        this.origin = origin;
    }
    // static userFactory(id?: string, productType?: string, fee?: number, origin?: string): User{
    //     const user: User = new User();
    //     user.id = id;
    //     user.productType = productType;
    //     user.fee = fee;
    //     user.origin = origin;
    //     return user;
    // }

};

