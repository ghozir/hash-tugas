const Funct = require('./functionSh1')
sha1 = require('js-sha1')
this.fungsi = new Funct()

const input = `Kisah mukjizat oleh Nabi Muhammad ini terjadi saat kaum kafir menentangnya untuk membuktikan kenabiannya. Rasulullah akhirnya menunjukkannya dengan membelah bulan atas kebesaran Allah. Kalangan Quraisy tentu terkejut pada apa yang bisa Muhammad lakukan.

“Bahwa orang Mekkah meminta utusan Allah untuk menunjukkan kepada mereka tentang mukjizat, dan ia menunjukkan kepada mereka adanya pemisahan bulan.” (Sahih Al Bukhari)

Membelah bulan ini tentu hanya salah satu dari banyaknya mukjizat dari Nabi Muhammad atas kebesaran Allah.`

const pubKey = this.fun.generatePublic(m)
const privateKey = this.fun.generatePrivate(m, pubKey)
console.log(`private key: ${privateKey},${n}`)
console.log(`public key: ${pubKey},${n}`)

const enkrip = this.fun.encryptString(input, [pubKey, n])
const decryptString = this.fun.decryptString(enkrip, [privateKey, n])
const hash = sha1.create()
console.log(enkrip)
console.log(decryptString)


const FunctionSha1 = require('./functionSh1')
this.fungsiSha1 = new FunctionSha1()
  
  // Contoh penggunaans
  const inputString = `s`;

  
  const sha1Hash = this.fungsiSha1.sha1(inputString);
  console.log('SHA-1 Hash:', sha1Hash);  