const { subtle } = require('crypto').webcrypto;

const EllipticCurves = require("./EllipticCurves");


class CipherService {
    
    
    
    async keyAgreedment( clientPublicKey ){
        const ecdh = new EllipticCurves();
       
        const serverPublicKey = await ecdh.generateKeys();
        const secret =await ecdh.keyagreement( clientPublicKey )
        
        return {
            secret,
            serverPublicKey
        }
    }
}

module.exports = new CipherService();