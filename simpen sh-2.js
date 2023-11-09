function sha256(message) {
    // Step 1: Inisialisasi nilai awal (Initial Hash Values)
    const H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
  
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
  
    // Fungsi untuk menghitung SHA-256 hash
    function sha256Hash(binaryMessage) {
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
      let [a, b, c, d, e, f, g, h] = H;
  
      // Step 4: Iterasi Utama (Main Loop)
      for (let i = 0; i < binaryMessage.length; i += 64) {
        const chunk = binaryMessage.slice(i, i + 64);
        const words = new Array(64);
  
        // Inisialisasi 16 kata pertama dengan data pesan
        for (let j = 0; j < 16; j++) {
          words[j] = (chunk[j * 4] << 24) | (chunk[j * 4 + 1] << 16) | (chunk[j * 4 + 2] << 8) | chunk[j * 4 + 3];
        }
  
        // Ekspansi kata
        for (let j = 16; j < 64; j++) {
          const s0 = (words[j - 15] >>> 7) ^ (words[j - 15] >>> 18) ^ (words[j - 15] >>> 3);
          const s1 = (words[j - 2] >>> 17) ^ (words[j - 2] >>> 19) ^ (words[j - 2] >>> 10);
          words[j] = (words[j - 16] + s0 + words[j - 7] + s1) >>> 0;
        }
  
        // Step 5: Iterasi Perputaran (Rounds)
        for (let j = 0; j < 64; j++) {
          const S1 = (e >>> 6) ^ (e >>> 11) ^ (e >>> 25);
          const ch = (e & f) ^ ((~e) & g);
          const temp1 = (h + S1 + ch + K[j] + words[j]) >>> 0;
          const S0 = (a >>> 2) ^ (a >>> 13) ^ (a >>> 22);
          const maj = (a & b) ^ (a & c) ^ (b & c);
          const temp2 = (S0 + maj) >>> 0;
  
          h = g;
          g = f;
          f = e;
          e = (d + temp1) >>> 0;
          d = c;
          c = b;
          b = a;
          a = (temp1 + temp2) >>> 0;
        }
  
        // Menambahkan hasil perputaran ke hash yang ada
        H[0] = (H[0] + a) >>> 0;
        H[1] = (H[1] + b) >>> 0;
        H[2] = (H[2] + c) >>> 0;
        H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0;
        H[5] = (H[5] + f) >>> 0;
        H[6] = (H[6] + g) >>> 0;
        H[7] = (H[7] + h) >>> 0;
      }
  
      // Step 6: Menggabungkan nilai hash awal dengan hasil perhitungan
      const finalHash = new Uint8Array(32);
      for (let i = 0; i < 8; i++) {
        finalHash[i * 4] = (H[i] >> 24) & 0xFF;
        finalHash[i * 4 + 1] = (H[i] >> 16) & 0xFF;
        finalHash[i * 4 + 2] = (H[i] >> 8) & 0xFF;
        finalHash[i * 4 + 3] = H[i] & 0xFF;
      }
  
      return finalHash;
    }
  
    const binaryMessage = stringToBinary(message);
    const hash = sha256Hash(binaryMessage);
  
    // Mengonversi hash menjadi string heksadesimal
    let hashString = '';
    for (let i = 0; i < hash.length; i++) {
      const hex = hash[i].toString(16);
      if (hex.length < 2) {
        hashString += '0';
      }
      hashString += hex;
    }
  
    return hashString;
  }