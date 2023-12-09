function encodeHex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

function decodeHex(stringHex) {
    return new Uint8Array(stringHex.match(/../g).map(h=>parseInt(h,16))).buffer;
}

module.exports = { encodeHex, decodeHex};