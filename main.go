package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"math"
)

// Struct testCase
type testCase struct {
	hashCode string
	string
}

// Test case, bisa diabaikan aja
// hashCode digenerate dari https://www.md5hashgenerator.com/
var testCases = []testCase{
	{"0cc175b9c0f1b6a831c399e269772661", "a"},
	{"900150983cd24fb0d6963f7d28e17f72", "abc"},
	{"f96b697d7cb7938d525a2f31aaf161d0", "message digest"},
	{"ea62e02c3c2f8407661c6a471f67e067", `Kisah mukjizat oleh Nabi Muhammad ini terjadi saat kaum kafir menentangnya untuk membuktikan kenabiannya. Rasulullah akhirnya menunjukkannya dengan membelah bulan atas kebesaran Allah. Kalangan Quraisy tentu terkejut pada apa yang bisa Muhammad lakukan.“Bahwa orang Mekkah meminta utusan Allah untuk menunjukkan kepada mereka tentang mukjizat, dan ia menunjukkan kepada mereka adanya pemisahan bulan.” (Sahih Al Bukhari). Membelah bulan ini tentu hanya salah satu dari banyaknya mukjizat dari Nabi Muhammad atas kebesaran Allah.`},
}

// For more details of the MD5 algo
// https://en.wikipedia.org/wiki/MD5#Algorithm
func main() {
	// Loop testCase
	for _, tc := range testCases {
		fmt.Printf("%s\n%x\n\n", tc.hashCode, md5(tc.string))
	}
}

// Define shift amounts and table for md5 calculation
var shift = [...]uint{7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21}
var table [64]uint32

// Inisiasi table dengan sin dari var "i"
func init() {
	for i := range table {
		table[i] = uint32((1 << 32) * math.Abs(math.Sin(float64(i+1))))
	}
}

// md5 Main function untuk membuat hash MD5
func md5(s string) (r [16]byte) {
	// Konversi pesan asli dalam array of bytes
	padded := bytes.NewBuffer([]byte(s))
	// Append pesan dengan angka asal, tapi harus berukuran 1 bit (0x80 adalah literal integer 80 dalam bentuk hexadecimal)
	padded.WriteByte(0x80)
	// Append pesan dengan angka "0" sampai panjang pesan dalam bit adalah 448 (mod 512)
	for padded.Len()%64 != 56 {
		padded.WriteByte(0)
	}
	// Tambahkan panjang asli dalam bit mod (2 pow 64) ke pesan
	messageLenBits := uint64(len(s)) * 8
	binary.Write(padded, binary.LittleEndian, messageLenBits)

	var a, b, c, d uint32 = 0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476
	var buffer [16]uint32
    // Proses pesan dalam chunks 512-bit berturut2
	for binary.Read(padded, binary.LittleEndian, buffer[:]) == nil {
		a1, b1, c1, d1 := a, b, c, d
		// Main loop
		for j := 0; j < 64; j++ {
			var f uint32
			bufferIndex := j
			round := j >> 4
			// Lakukan operasi yang berbeda untuk tiap rounds
			switch round {
			case 0:
				f = (b1 & c1) | (^b1 & d1)
			case 1:
				f = (b1 & d1) | (c1 & ^d1)
				bufferIndex = (bufferIndex*5 + 1) & 0x0F
			case 2:
				f = b1 ^ c1 ^ d1
				bufferIndex = (bufferIndex*3 + 5) & 0x0F
			case 3:
				f = c1 ^ (b1 | ^d1)
				bufferIndex = (bufferIndex * 7) & 0x0F
			}
			// Perhitungan new value dengan melakukan shifting
			sa := shift[(round<<2)|(j&3)]
			a1 += f + buffer[bufferIndex] + table[j]
			a1, d1, c1, b1 = d1, c1, b1, a1<<sa|a1>>(32-sa)+b1
		}
		a, b, c, d = a+a1, b+b1, c+c1, d+d1
	}

	// Output hasil dengan encoding little endian
    // byte yang paling tidak signifikan harus dienkripsi terlebih dahulu dengan byte yang tersisa dienkripsi dalam urutan
    // Ref https://dicom.nema.org/medical/dicom/current/output/chtml/part05/sect_7.3.html
	binary.Write(bytes.NewBuffer(r[:0]), binary.LittleEndian, []uint32{a, b, c, d})
	return
}
