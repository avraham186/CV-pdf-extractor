const { MongoClient } = require('mongodb');
const config = require('./config/index')

module.exports = {
    getCollection,
    getDB
}

// Database Name
const dbName = 'APPLICANT_DB'

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        console.log('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        console.logr('Cannot Connect to DB', err)
        throw err
    }
}
function getDB() {
    return dbConn
}