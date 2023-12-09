const { subtle } = require('crypto').webcrypto;
const {encodeHex, decodeHex} = require('./utils');

const KEY_PARAMETERS_SPEC    = {name: "ECDH",namedCurve: "P-256"};
const CIPHER_PARAMETERS_SPEC = {name:"AES-GCM", length: 256};
const ECDH = "ECDH";

const CIPHER_KEY_USAGES =  ["encrypt", "decrypt"];


class EllipticCurves {
    
    privateKey = null;
    
    /**
     * @returns  {Promise<string>}
     */
    generateKeys(){
        function generateKey(){
            return subtle.generateKey( KEY_PARAMETERS_SPEC,false,["deriveKey"])
        }
        
        function exportPublicKey(keypair){
            return subtle.exportKey("spki", keypair.publicKey)
        }
        
        function storePrivateKey(keypair){
            this.privateKey = keypair.privateKey;
            return keypair;
        }
        
        return new Promise(function(resolve, reject){
            generateKey()
                .then(storePrivateKey.bind(this))
                .then(exportPublicKey)
                .then(encodeHex)
                .then(resolve);
        }.bind(this));
    }
    
    /**
     * 
     * @param {string} clientPublicKey 
     * @returns {Promise<string>}
     */
    keyagreement(clientPublicKey){
    
        function importPublicKey(clientPublicKey){
            return subtle.importKey("spki", decodeHex(clientPublicKey),KEY_PARAMETERS_SPEC,true, []);
        }
        
        function getECDHParameters(publicKey){
            return { name: ECDH, public: publicKey }
        }
        
        function deriveSecretKey( cryptoPublicKey){
            return subtle.deriveKey( getECDHParameters(cryptoPublicKey),this.privateKey,CIPHER_PARAMETERS_SPEC, true, CIPHER_KEY_USAGES);  
        }
        
        function exportSecretKey( cryptoKey ){
            return subtle.exportKey('raw', cryptoKey);
        }
    
        return new Promise(function(resolve, reject){
            importPublicKey(clientPublicKey)
                .then(deriveSecretKey.bind(this))
                .then(exportSecretKey)
                .then(encodeHex)
                .then(resolve);
        }.bind(this));
    }
}

module.exports = EllipticCurves;