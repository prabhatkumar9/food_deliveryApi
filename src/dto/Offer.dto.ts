export interface OfferDTO {
    offerType: string;
    title: string;// INR 200 off on weekends
    vendors: [any];
    description: string;
    minValue: number; // minimum order value
    offerAmount: number; // 200 INR
    startValidity: Date;
    endValidity: Date;
    promoCode: string; // WEEK200
    promoType: string; // user // all // bank //card
    bank: [any];
    bins: [any];
    pincode: string;
    isActive: boolean;
}