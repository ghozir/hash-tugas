const FunctionSha1 = require('./functionSh1')
this.fungsi = new FunctionSha1()

// Contoh penggunaan
const inputString = `Kisah mukjizat oleh Nabi Muhammad ini terjadi saat kaum kafir menentangnya untuk membuktikan kenabiannya. Rasulullah akhirnya menunjukkannya dengan membelah bulan atas kebesaran Allah. Kalangan Quraisy tentu terkejut pada apa yang bisa Muhammad lakukan.

“Bahwa orang Mekkah meminta utusan Allah untuk menunjukkan kepada mereka tentang mukjizat, dan ia menunjukkan kepada mereka adanya pemisahan bulan.” (Sahih Al Bukhari)

Membelah bulan ini tentu hanya salah satu dari banyaknya mukjizat dari Nabi Muhammad atas kebesaran Allah.`
const sha1 = this.fungsi.sha1(inputString)
console.log('SHA-256 Hash:', sha1)
