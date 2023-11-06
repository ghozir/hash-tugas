const Funct = require('./function')
this.fungsi = new Funct()

const input = `Sejarah Dinar dan Dirham
Emas sebagai investasi safe haven telah disandang sejak lama sepanjang sejarah peradaban manusia. Dinar dan dirham merupakan merupakan mata uang sah dalam sejarah Islam, sejak masa Nabi Muhammad SAW.

Dinar dan dirham merupakan koin yang terbuat dari logam mulia. Dinar terbuat dari emas, dan dirham terbuat dari perak atau silver. Kedua logam mulia ini digunakan sebagai mata uang miliki bangsa Romawi dan Persia. Sebelumnya, bangsa Arab berdagang dengan menerapkan sistem barter (tukar menukar barang) dan tidak pernah memproduksi mata uang sendiri.

Bangsa Arab mengadopsidinar dan dirham sebagai sistem mata uang dan hal ini berlangsung hingga zaman Nabi Muhammad SAW. Dalam proses penimbangan bobot dinar dan dirham tersebut, Nabi Muhammad SAW dibantu oleh seorang sahabatnya, yaitu Arqam bin Abi Arqam yang merupakan seorang ahli tempa emas dan perak pada masa itu.`


const pubKey = this.fun.generatePublic(m)
const privateKey = this.fun.generatePrivate(m,pubKey)
console.log(`private key: ${privateKey},${n}`)
console.log(`public key: ${pubKey},${n}`)

const enkrip = this.fun.encryptString(input,[pubKey,n])
const decryptString = this.fun.decryptString(enkrip,[privateKey,n])
console.log(enkrip)
console.log(decryptString)
