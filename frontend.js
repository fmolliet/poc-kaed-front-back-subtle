function hexToBytes(hex) {
    return new Uint8Array(hex.match(/../g).map(h=>parseInt(h,16))).buffer;
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
  }

window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    false,
    ["deriveKey"],
  ).then( keypair => {
    console.log(keypair)
    window.crypto.subtle.exportKey("spki", keypair.publicKey).then((keyArray)=>{
        let keystring = buf2hex(keyArray);
        //console.log(keyArray)
        console.log(keystring)
        console.log(hexToBytes(keystring))
        window.crypto.subtle.importKey("spki", hexToBytes(keystring), {
      name: "ECDH",
      namedCurve: "P-256",
    }, true, ["deriveKey"]).then((publicKey)=>{
            console.log(publicKey)
        })
                                       
    })
  })