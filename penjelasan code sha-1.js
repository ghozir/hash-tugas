function sha1(message) {
    // Step 1: Inisialisasi nilai awal (Initial Hash Values)
    const H0 = 0x67452301;
    const H1 = 0xEFCDAB89;
    const H2 = 0x98BADCFE;
    const H3 = 0x10325476;
    const H4 = 0xC3D2E1F0;
  
    // Fungsi untuk mengonversi pesan menjadi representasi biner
    function stringToBinary(message) {
      const binaryMessage = [];
      for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i);
        binaryMessage.push((charCode >> 8) & 0xFF);
        binaryMessage.push(charCode & 0xFF);
      }
      return binaryMessage;
    }
  
    // Fungsi untuk menghitung SHA-1 hash
    function sha1Hash(binaryMessage) {
      // Step 2: Pemrosesan Pesan (Message Processing)
      const messageLength = binaryMessage.length * 8;
      binaryMessage.push(0x80); // Menambahkan bit '1' pada akhir pesan
      while ((binaryMessage.length * 8) % 512 !== 448) {
        binaryMessage.push(0x00); // Padding dengan bit '0'
      }
      const lengthBytes = [];
      for (let i = 56; i >= 0; i -= 8) {
        lengthBytes.push((messageLength >> i) & 0xFF);
      }
      binaryMessage.push(...lengthBytes);
  
      // Step 3: Inisialisasi variabel
      let [A, B, C, D, E] = [H0, H1, H2, H3, H4];
  
      // Step 4: Iterasi Utama (Main Loop)
      for (let i = 0; i < binaryMessage.length; i += 64) {
        const chunk = binaryMessage.slice(i, i + 64);
        const words = new Array(80);
  
        // Inisialisasi 16 kata pertama dengan data pesan
        for (let j = 0; j < 16; j++) {
          words[j] = (chunk[j * 4] << 24) | (chunk[j * 4 + 1] << 16) | (chunk[j * 4 + 2] << 8) | chunk[j * 4 + 3];
        }
  
        // Ekspansi kata
        for (let j = 16; j < 80; j++) {
          words[j] = words[j - 3] ^ words[j - 8] ^ words[j - 14] ^ words[j - 16];
          words[j] = (words[j] << 1) | (words[j] >>> 31);
        }
  
        // Inisialisasi variabel hash
        let [a, b, c, d, e] = [A, B, C, D, E];
  
        // Step 5: Iterasi Perputaran (Rounds)
        for (let j = 0; j < 80; j++) {
          let f, k;
          if (j < 20) {
            f = (b & c) | ((~b) & d);
            k = 0x5A827999;
          } else if (j < 40) {
            f = b ^ c ^ d;
            k = 0x6ED9EBA1;
          } else if (j < 60) {
            f = (b & c) | (b & d) | (c & d);
            k = 0x8F1BBCDC;
          } else {
            f = b ^ c ^ d;
            k = 0xCA62C1D6;
          }
  
          const temp = ((a << 5) | (a >>> 27)) + f + e + k + words[j];
          e = d;
          d = c;
          c = (b << 30) | (b >>> 2);
          b = a;
          a = temp;
        }
  
        // Menambahkan hasil perputaran ke hash yang ada
        A = (A + a) & 0xFFFFFFFF;
        B = (B + b) & 0xFFFFFFFF;
        C = (C + c) & 0xFFFFFFFF;
        D = (D + d) & 0xFFFFFFFF;
        E = (E + e) & 0xFFFFFFFF;
      }
  
      // Step 6: Menggabungkan nilai hash awal dengan hasil perhitungan
      const finalHash = (A << 128) | (B << 96) | (C << 64) | (D << 32) | E;
  
      return finalHash.toString(16).toUpperCase();
    }
  
    const binaryMessage = stringToBinary(message);
    const hash = sha1Hash(binaryMessage);
  
    return hash;
  }
  
  // Contoh penggunaan
  const inputString = 'Ini adalah teks yang akan di-hash';
  const sha1Hash = sha1(inputString);
  console.log('SHA-1 Hash:', sha1Hash);
  