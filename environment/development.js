require('dotenv').config()

const path = require('path')

module.exports = {
    dbUrl: `mongodb+srv://mayccos:${process.env.MONGODB_PASSWORD}@cluster-projet-14.nxgcf.mongodb.net/twitter`,
    cert: path.join(__dirname, '../ssl/local.crt'),
    key: path.join(__dirname, '../ssl/local.key'),
}
