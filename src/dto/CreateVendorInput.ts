export interface CreateVendorInput {
    name: string,
    ownerName: string,
    foodType: [string],
    pincode: string,
    address: string,
    phone: string,
    email: string,
    password: string,
    // foods:[],
}

export interface EditVendorInput {
    name: string,
    foodType: [string],
    pincode: string,
    address: string,
    phone: string,
}

export interface VendorLoginInput {
    email: string,
    password: string,
}


export interface VendorPayload {
    _id: string,
    email: string,
    name: string,
    foodtypes: [string]
}