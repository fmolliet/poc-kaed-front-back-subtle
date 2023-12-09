//const { randomBytes } = require('crypto')

const cipherService = require('./CipherService');


class Controller {
    
    async initialize( req, res ){
        
        console.log(req.body)
        
        if ( !req.body && !req.body.clientPublicKey ){
            res.status(400).json({message:"Invalid body"});
        }
        
        try {
            const { clientPublicKey } = req.body;
            
            const { secret, serverPublicKey } = await cipherService.keyAgreedment(clientPublicKey);
            
            //const contextId = randomBytes(32).toString('base64');
            
            //await cacheService.set(contextId, cryptogram);
            
            console.log( `Server Computed Secret: ${secret}` );
            
            return res.json({ serverPublicKey }).status(200);
        } catch(err){
            return res.status(500).send({message: err.message});
        }
    }
}

module.exports = new Controller();