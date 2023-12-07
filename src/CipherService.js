const { subtle } = require('crypto').webcrypto;




class CipherService {
    
    buf2hex(buffer) { // buffer is an ArrayBuffer
        return [...new Uint8Array(buffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
    }
    
    hex2Bytes(hex) {
        let bytes = [];
        for (let c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }
    
    async keyAgreedment( clientPublicKey ){
       
        console.log(subtle)
        const keypair = await subtle.generateKey({
            name: "ECDH",
            namedCurve: "P-256",
          },false, ['deriveKey']);  
       
        return {
            secret: "",
            serverPublicKey:  this.buf2hex(await subtle.exportKey("spki", keypair.publicKey))
        }
    }
}

module.exports = new CipherService();