
class FunctionSha1 {
    constructor() {

      }

      sha1(message) {
        const messageArray = this.stringToUtf8Array(message);
        const mLen = messageArray.length;
        const nBitsTotal = mLen * 8;
        const paddingLen = mLen % 64 < 56 ? 64 - (mLen % 64) : 128 - (mLen % 64);
        const paddedMessage = new Uint8Array(mLen + paddingLen);
      
        // Append the bit '1' to the message
        paddedMessage.set([0x80], mLen);
      
        // Append length in bits as 64-bit big-endian integer
        for (let i = 0; i < 8; i++) {
          paddedMessage[paddedMessage.length - 8 + i] = (nBitsTotal >>> (56 - i * 8)) & 0xff;
        }
      
        let H0 = 0x67452301;
        let H1 = 0xEFCDAB89;
        let H2 = 0x98BADCFE;
        let H3 = 0x10325476;
        let H4 = 0xC3D2E1F0;
      
        const K = new Uint32Array([
          0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6
        ]);
      
        const chunkSize = 512 / 8; // 64 bytes
        for (let offset = 0; offset < paddedMessage.length; offset += chunkSize) {
          const W = new Uint32Array(80);
      
          for (let i = 0; i < 16; i++) {
            W[i] = (
              (paddedMessage[offset + i * 4] << 24) |
              (paddedMessage[offset + i * 4 + 1] << 16) |
              (paddedMessage[offset + i * 4 + 2] << 8) |
              (paddedMessage[offset + i * 4 + 3])
            );
          }
      
          for (let i = 16; i < 80; i++) {
            W[i] = this.leftRotate(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
          }
      
          let A = H0;
          let B = H1;
          let C = H2;
          let D = H3;
          let E = H4;
      
          for (let i = 0; i < 80; i++) {
            let f, k;
      
            if (i < 20) {
              f = (B & C) | ((~B) & D);
              k = K[0];
            } else if (i < 40) {
              f = B ^ C ^ D;
              k = K[1];
            } else if (i < 60) {
              f = (B & C) | (B & D) | (C & D);
              k = K[2];
            } else {
              f = B ^ C ^ D;
              k = K[3];
            }
      
            const temp = (this.leftRotate(A, 5) + f + E + k + W[i]) & 0xffffffff;
            E = D;
            D = C;
            C = this.leftRotate(B, 30);
            B = A;
            A = temp;
          }
      
          H0 = (H0 + A) & 0xffffffff;
          H1 = (H1 + B) & 0xffffffff;
          H2 = (H2 + C) & 0xffffffff;
          H3 = (H3 + D) & 0xffffffff;
          H4 = (H4 + E) & 0xffffffff;
        }
      
        return this.uint32ToHex(H0) + this.uint32ToHex(H1) + this.uint32ToHex(H2) + this.uint32ToHex(H3) + this.uint32ToHex(H4);
      }

      stringToUtf8Array(str) {
        const utf8 = unescape(encodeURIComponent(str));
        const arr = new Uint8Array(utf8.length);
        for (let i = 0; i < utf8.length; i++) {
          arr[i] = utf8.charCodeAt(i);
        }
        return arr;
      }
    
      uint32ToHex(n) {
        const hexChars = '0123456789abcdef';
        let hex = '';
        for (let i = 0; i < 8; i++) {
          hex += hexChars[(n >>> (28 - i * 4)) & 0xf];
        }
        return hex;
      }

      leftRotate(n, b) {
        return (n << b) | (n >>> (32 - b));
      }

}

module.exports = FunctionSha1;