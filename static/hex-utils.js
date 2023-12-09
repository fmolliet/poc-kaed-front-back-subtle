function hexToBytes(stringHex) {
    return new Uint8Array(stringHex.match(/../g).map(h=>parseInt(h,16))).buffer;
}

function buf2hex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}