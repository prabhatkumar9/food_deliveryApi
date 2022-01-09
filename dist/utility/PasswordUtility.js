"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
// Importing modules
const crypto = require('crypto');
class PasswordUtil {
    constructor() { }
    // Creating a unique salt for a particular user
    createSalt() {
        return crypto.randomBytes(16).toString('hex');
    }
    // Hashing user's salt and password with 1000 iterations,
    // 64 length and sha512 digest
    createHash(salt, password) {
        return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    }
    // generate new hash with salt and password
    // compare with old hash 
    validatePassword(hash, salt, password) {
        let newHash = this.createHash(salt, password);
        if (hash === newHash) {
            return true;
        }
        return false;
    }
}
exports.PasswordUtil = PasswordUtil;
//# sourceMappingURL=PasswordUtility.js.map