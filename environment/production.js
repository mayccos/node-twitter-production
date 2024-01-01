require('dotenv').config()

module.exports = {
    dbUrl: `mongodb+srv://mayccos:${process.env.MONGODB_PASSWORD}@cluster-projet-14.nxgcf.mongodb.net/twitter`,
    cert: '/etc/letsencrypt/live/www.mayccos.fr/fullchain.pem',
    key: '/etc/letsencrypt/live/www.mayccos.fr/privkey.pem',
    portHttp: 80,
    portHttps: 443,
}
