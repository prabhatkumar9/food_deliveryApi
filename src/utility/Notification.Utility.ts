/**
 * email
 */



/**
 * notification
 */



/**
 * OTP
 */
export const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));

    return { otp, expiry };
}


/** using twilio api service */
export const OnRequestOTP = async (otp: number, to: string) => {

    const accountSid = 'AC695f775af69bacf0c62cfa89cfeeee43';
    const authToken = '5ce62691579d47ac2893722f4590cffe';
    const client = require('twilio')(accountSid, authToken);

    client.messages.create({
        body: `Your OTP is ${otp} for account verification.`,
        from: '+14158860691',
        to: `+91${to}`
    }).then((message: any) => console.log("twilio sms response ::: ", message))
        .catch((e: any) => {
            console.log("twilio sms error ::: ", e)
        });
}


/**
 * payment notification
 */