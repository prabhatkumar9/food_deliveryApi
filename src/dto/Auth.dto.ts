import { VendorPayload, CustomerPayload } from ".";


export type AuthPayload = VendorPayload | CustomerPayload;
// | UserPayload | AdminPayload;