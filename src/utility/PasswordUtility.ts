// Importing modules
const crypto = require('crypto');

export class PasswordUtil {

    constructor() { }

    // Creating a unique salt for a particular user
    public createSalt() {
        return crypto.randomBytes(16).toString('hex');
    }

    // Hashing user's salt and password with 1000 iterations,
    // 64 length and sha512 digest
    public createHash(salt: string, password: string) {
        return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    }


    // generate new hash with salt and password
    // compare with old hash 
    public validatePassword(hash: string, salt: string, password: string) {
        let newHash = this.createHash(salt, password);
        if (hash === newHash) {
            return true;
        }
        return false;
    }


}