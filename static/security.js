const subtle                 = window.crypto.subtle;
const KEY_PARAMETERS_SPEC    = {name: "ECDH",namedCurve: "P-256"};
const CIPHER_PARAMETERS_SPEC = {name:"AES-GCM", length: 256};
const ECDH = "ECDH";

const CIPHER_KEY_USAGES =  ["encrypt", "decrypt"];


function EllipticCurves(){
    this.privateKey = null;
}

/**
 * @returns  {Promise<string>}
 */
EllipticCurves.prototype.generateKeys = function(){
    function generateKey(){
        return subtle.generateKey( KEY_PARAMETERS_SPEC,false,["deriveKey"])
    }
    
    function exportPublicKey(keypair){
        return subtle.exportKey("spki", keypair.publicKey)
    }
    
    function convertToString( publicKeyArraybuffer ){
        return buf2hex(publicKeyArraybuffer)
    }

    function storePrivateKey(keypair){
        this.privateKey = keypair.privateKey;
        return keypair;
    }
    
    return new Promise(function(resolve, reject){
        generateKey()
            .then(storePrivateKey.bind(this))
            .then(exportPublicKey)
            .then(convertToString)
            .then(resolve);
    }.bind(this));
}

/**
 * 
 * @param {string} serverPublicKey 
 * @returns {Promise<string>}
 */
EllipticCurves.prototype.keyagreement = function(serverPublicKey){
    
    function importPublicKey(serverPublicKey){
        return subtle.importKey("spki", hexToBytes(serverPublicKey),KEY_PARAMETERS_SPEC,true, []);
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
        importPublicKey(serverPublicKey)
            .then(deriveSecretKey.bind(this))
            .then(exportSecretKey)
            .then(buf2hex)
            .then(resolve);
    }.bind(this));
}


const ecdh = new EllipticCurves();

const ecdh2 = new EllipticCurves();



ecdh.generateKeys().then((clientPublicKey)=>{
    console.log(clientPublicKey)
    console.log(ecdh)
    ecdh2.generateKeys().then((serverPublicKey)=>{
        ecdh.keyagreement(serverPublicKey).then((secret)=>{
            console.log("client Computed Secret:" + secret)
        });
        ecdh2.keyagreement(clientPublicKey).then((secret)=>{
            console.log("server Computed Secret:" + secret)
        });
    })
});