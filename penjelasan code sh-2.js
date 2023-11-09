function sha256(message) {
  // Fungsi untuk melakukan right rotate pada sebuah nilai
  function rightRotate(n, x) {
    return (x >>> n) | (x << (32 - n));
  }

  // Fungsi untuk mengubah array byte menjadi string hex
  function toHexString(byteArray) {
    return Array.from(byteArray, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  }

  // Langkah 1: Preprocessing Pesan
  function preprocess(message) {
    const bitLength = message.length * 8;

    // Menambahkan 1 diakhir pesan dan padding dengan 0
    message.push(0x80);
    while (message.length % 64 !== 56) {
      message.push(0x00);
    }

    // Menambahkan panjang bit pesan pada akhir pesan
    for (let i = 7; i >= 0; i--) {
      message.push((bitLength >>> (i * 8)) & 0xFF);
    }

    return message;
  }

  // Langkah 2: Pengaturan Konstanta
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    // ... (konstanta lainnya)
  ];

  // Langkah 3: Inisialisasi Hash Awal
  const h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  // Langkah 4: Pengolahan Blok
  function sha256Block(block, h) {
    const words = new Array(64);

    // Membuat 16 kata dari blok pesan
    for (let i = 0; i < 16; i++) {
      words[i] = (block[i * 4] << 24) | (block[i * 4 + 1] << 16) | (block[i * 4 + 2] << 8) | (block[i * 4 + 3]);
    }

    // Membuat kata tambahan dari 16 kata sebelumnya
    for (let i = 16; i < 64; i++) {
      const s0 = rightRotate(7, words[i - 15]) ^ rightRotate(18, words[i - 15]) ^ (words[i - 15] >>> 3);
      const s1 = rightRotate(17, words[i - 2]) ^ rightRotate(19, words[i - 2]) ^ (words[i - 2] >>> 10);
      words[i] = words[i - 16] + s0 + words[i - 7] + s1;
    }

    // Inisialisasi variabel sementara
    let [a, b, c, d, e, f, g, hTemp] = h;

    // Langkah 4a: Proses Pengolahan Blok
    for (let i = 0; i < 64; i++) {
      const S1 = rightRotate(6, e) ^ rightRotate(11, e) ^ rightRotate(25, e);
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = hTemp + S1 + ch + k[i] + words[i];
      const S0 = rightRotate(2, a) ^ rightRotate(13, a) ^ rightRotate(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = S0 + maj;

      // Update variabel sementara
      hTemp = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    // Langkah 4b: Update Hash
    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
    h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0;
    h[7] = (h[7] + hTemp) >>> 0;
  }

  // Langkah 5: Pengolahan Pesan
  message = preprocess(Array.from(message, char => char.charCodeAt(0)));

  // Langkah 6: Pengolahan Setiap Blok
  for (let i = 0; i < message.length; i += 64) {
    sha256Block(message.slice(i, i + 64), h);
  }

  // Langkah 7: Hasil Akhir
  return toHexString(new Uint8Array([].concat(
      h[0] >> 24, h[0] >> 16, h[0] >> 8, h[0],
      h[1] >> 24, h[1] >> 16, h[1] >> 8, h[1],
      h[2] >> 24, h[2] >> 16, h[2] >> 8, h[2],
      h[3] >> 24, h[3] >> 16, h[3] >> 8, h[3],
      h[4] >> 24, h[4] >> 16, h[4] >> 8, h[4],
      h[5] >> 24, h[5] >> 16, h[5] >> 8, h[5],
      h[6] >> 24, h[6] >> 16, h[6] >> 8, h[6],
      h[7] >> 24, h[7] >> 16, h[7] >> 8, h[7])
    ));
}

// Contoh penggunaan
const message = "Hello, SHA-256!";
const hash = sha256(message);
console.log("Message:", message);
console.log("SHA-256 Hash:", hash);
