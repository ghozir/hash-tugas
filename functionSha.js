class FunctionSha1 {
  sha1 (message) {
    const messageArray = this.stringToUtf8Array(message)
    const mLen = messageArray.length
    const nBitsTotal = mLen * 8
    const paddingLen = mLen % 64 < 56 ? 64 - (mLen % 64) : 128 - (mLen % 64)
    const paddedMessage = new Uint8Array(mLen + paddingLen)

    // Append the bit '1' to the message
    paddedMessage.set([0x80], mLen)

    // Append length in bits as 64-bit big-endian integer
    for (let i = 0; i < 8; i++) {
      paddedMessage[paddedMessage.length - 8 + i] = (nBitsTotal >>> (56 - i * 8)) & 0xff
    }

    let H0 = 0x67452301
    let H1 = 0xEFCDAB89
    let H2 = 0x98BADCFE
    let H3 = 0x10325476
    let H4 = 0xC3D2E1F0

    const K = new Uint32Array([
      0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6
    ])

    const chunkSize = 512 / 8 // 64 bytes
    for (let offset = 0; offset < paddedMessage.length; offset += chunkSize) {
      const W = new Uint32Array(80)

      for (let i = 0; i < 16; i++) {
        W[i] = (
          (paddedMessage[offset + i * 4] << 24) |
              (paddedMessage[offset + i * 4 + 1] << 16) |
              (paddedMessage[offset + i * 4 + 2] << 8) |
              (paddedMessage[offset + i * 4 + 3])
        )
      }

      for (let i = 16; i < 80; i++) {
        W[i] = this.leftRotate(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
      }

      let A = H0
      let B = H1
      let C = H2
      let D = H3
      let E = H4

      for (let i = 0; i < 80; i++) {
        let f, k

        if (i < 20) {
          f = (B & C) | ((~B) & D)
          k = K[0]
        } else if (i < 40) {
          f = B ^ C ^ D
          k = K[1]
        } else if (i < 60) {
          f = (B & C) | (B & D) | (C & D)
          k = K[2]
        } else {
          f = B ^ C ^ D
          k = K[3]
        }

        const temp = (this.leftRotate(A, 5) + f + E + k + W[i]) & 0xffffffff
        E = D
        D = C
        C = this.leftRotate(B, 30)
        B = A
        A = temp
      }

      H0 = (H0 + A) & 0xffffffff
      H1 = (H1 + B) & 0xffffffff
      H2 = (H2 + C) & 0xffffffff
      H3 = (H3 + D) & 0xffffffff
      H4 = (H4 + E) & 0xffffffff
    }

    return this.uint32ToHex(H0) + this.uint32ToHex(H1) + this.uint32ToHex(H2) + this.uint32ToHex(H3) + this.uint32ToHex(H4)
  }

  sha256 (message) {
    // Langkah 3: Inisialisasi Hash Awal
    const h = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]

    // Langkah 5: Pengolahan Pesan
    message = this.preprocess(Array.from(message, char => char.charCodeAt(0)))

    // Langkah 6: Pengolahan Setiap Blok
    for (let i = 0; i < message.length; i += 64) {
      this.sha256Block(message.slice(i, i + 64), h)
    }

    // Langkah 7: Hasil Akhir
    return this.toHexString(new Uint8Array([].concat(
      h[0] >> 24, h[0] >> 16, h[0] >> 8, h[0],
      h[1] >> 24, h[1] >> 16, h[1] >> 8, h[1],
      h[2] >> 24, h[2] >> 16, h[2] >> 8, h[2],
      h[3] >> 24, h[3] >> 16, h[3] >> 8, h[3],
      h[4] >> 24, h[4] >> 16, h[4] >> 8, h[4],
      h[5] >> 24, h[5] >> 16, h[5] >> 8, h[5],
      h[6] >> 24, h[6] >> 16, h[6] >> 8, h[6],
      h[7] >> 24, h[7] >> 16, h[7] >> 8, h[7])
    ))
  }

  stringToUtf8Array (str) {
    const utf8 = unescape(encodeURIComponent(str))
    const arr = new Uint8Array(utf8.length)
    for (let i = 0; i < utf8.length; i++) {
      arr[i] = utf8.charCodeAt(i)
    }
    return arr
  }

  uint32ToHex (n) {
    const hexChars = '0123456789abcdef'
    let hex = ''
    for (let i = 0; i < 8; i++) {
      hex += hexChars[(n >>> (28 - i * 4)) & 0xf]
    }
    return hex
  }

  leftRotate (n, b) {
    return (n << b) | (n >>> (32 - b))
  }

  sha256Block (block, h) {
    // Langkah 2: Pengaturan Konstanta
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
      0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
      0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
      0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
      0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
      0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]

    const words = new Array(64)

    // Membuat 16 kata dari blok pesan
    for (let i = 0; i < 16; i++) {
      words[i] = (block[i * 4] << 24) | (block[i * 4 + 1] << 16) | (block[i * 4 + 2] << 8) | (block[i * 4 + 3])
    }

    // Membuat kata tambahan dari 16 kata sebelumnya
    for (let i = 16; i < 64; i++) {
      const s0 = this.rightRotate(7, words[i - 15]) ^ this.rightRotate(18, words[i - 15]) ^ (words[i - 15] >>> 3)
      const s1 = this.rightRotate(17, words[i - 2]) ^ this.rightRotate(19, words[i - 2]) ^ (words[i - 2] >>> 10)
      words[i] = words[i - 16] + s0 + words[i - 7] + s1
    }

    // Inisialisasi variabel sementara
    let [a, b, c, d, e, f, g, hTemp] = h

    // Langkah 4a: Proses Pengolahan Blok
    for (let i = 0; i < 64; i++) {
      const S1 = this.rightRotate(6, e) ^ this.rightRotate(11, e) ^ this.rightRotate(25, e)
      const ch = (e & f) ^ ((~e) & g)
      const temp1 = hTemp + S1 + ch + k[i] + words[i]
      const S0 = this.rightRotate(2, a) ^ this.rightRotate(13, a) ^ this.rightRotate(22, a)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const temp2 = S0 + maj

      // Update variabel sementara
      hTemp = g
      g = f
      f = e
      e = (d + temp1) >>> 0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) >>> 0
    }

    // Langkah 4b: Update Hash
    h[0] = (h[0] + a) >>> 0
    h[1] = (h[1] + b) >>> 0
    h[2] = (h[2] + c) >>> 0
    h[3] = (h[3] + d) >>> 0
    h[4] = (h[4] + e) >>> 0
    h[5] = (h[5] + f) >>> 0
    h[6] = (h[6] + g) >>> 0
    h[7] = (h[7] + hTemp) >>> 0
  }

  rightRotate (n, x) {
    return (x >>> n) | (x << (32 - n))
  }

  toHexString (byteArray) {
    return Array.from(byteArray, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2)
    }).join('')
  }

  // Langkah 1: Preprocessing Pesan
  preprocess (message) {
    const bitLength = message.length * 8

    // Menambahkan 1 diakhir pesan dan padding dengan 0
    message.push(0x80)
    while (message.length % 64 !== 56) {
      message.push(0x00)
    }

    // Menambahkan panjang bit pesan pada akhir pesan
    for (let i = 7; i >= 0; i--) {
      message.push((bitLength >>> (i * 8)) & 0xFF)
    }

    return message
  }
}

module.exports = FunctionSha1
