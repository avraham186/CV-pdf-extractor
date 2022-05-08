const dbService = require('./DB-service')
const ObjectId = require('mongodb').ObjectId

async function save(applicant) {
    const applicantToSave = {}
    Object.entries(applicant).forEach(([key, value]) => {
        const valueToSave = () => {
            if (value !== null && key !== 'rawData') {
                value.reduce((acc, val) => acc.concat(val), []);
                return value.join(',')
            } else return value
        }
        applicantToSave[key] = valueToSave()
    })
    console.log('applicant to save', applicantToSave.email,
        applicantToSave.linkedinProfileUrl,
        applicantToSave.mobilePhone,
        applicantToSave.idNum,
        applicantToSave.skills,
        'the raw data field is a large binary...'
    )
    // CREATE
    try {
        await dbService.getCollection('cvs')
        const db = dbService.getDB()
        await db.collection('cvs').insertOne(applicantToSave)
        console.log('saved to database');
        return applicantToSave
    } catch (err) {
        console.log('cannot add applicant', err)
        throw err
    }
}
module.exports = {
    save,
}