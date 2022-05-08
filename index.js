const express = require("express")
const fileUpload = require("express-fileupload")
const pdfParse = require("pdf-parse")
const fs = require('fs')
const applicantService = require('./applicant-service')
const Binary = require('mongodb').Binary

const app = express()

app.use("/", express.static("public"))


//for use in browser uncomment this code
// app.use(fileUpload())
// app.post("/extract-text", (req, res) => {
//     if (!req.files && !req.files.pdfFile) {
//         res.status(400)
//         res.end()
//     }
//     pdfParse(req.files.pdfFile).then(result => {
//         const rules = {
//             mailRule: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
//             linkedinProfileUrlRule: /(http)?(s)?(:\/\/)?(www\.)?(linkedin\.com)(\/(in|pub|mwlite)).+?(?=[^a-zA-Z0-9\-])/gmi,
//             mobilePhoneRule: /(^\d{10}$)|([0-9]{3}-[0-9]{1}-[0-9]{4,6})|([0-9]{3}-[0-9]{7})/mg,
//             idNum: /[0-9]{1}[-][0-9]{8}|[0-9]{9}|[0-9]{8}/,
//             skills: /^.*frontend:.*$|^.*backend:.*$/gmi
//         }
//         const text = result.text.replace('  ', "").replace(',', '\n')
//         const fields = {
//             email: text.match(rules.mailRule),
//             linkedinProfileUrl: text.match(rules.linkedinProfileUrlRule),
//             mobilePhone: text.match(rules.mobilePhoneRule),
//             idNum: text.match(rules.idNum),
//             skills: text.match(rules.skills),
//             rawData: req.files.pdfFile.data
//         }
//         //save fields as document in mongo
//         applicantService.save(fields)
//         res.send(result.text)
//     })
// })
// app.listen(3000)



//for use without browser uncomment this code

//path to the pdf file
const pdfFile = fs.readFileSync('./cv-example/avraham kuperwasser CV 2.pdf');

pdfParse(pdfFile).then(result => {
    const rules = {
        mailRule: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
        linkedinProfileUrlRule: /(http)?(s)?(:\/\/)?(www\.)?(linkedin\.com)(\/(in|pub|mwlite)).+?(?=[^a-zA-Z0-9\-])/gmi,
        mobilePhoneRule: /(^\d{10}$)|([0-9]{3}-[0-9]{1}-[0-9]{4,6})|([0-9]{3}-[0-9]{7})/mg,
        idNum: /(?<!\d)\d{1}(?!\d)[-](?<!\d)\d{8}(?!\d)|(?<!\d)\d{9}(?!\d)|(?<!\d)\d{8}(?!\d)/,
        skills: /^.*frontend:.*$|^.*backend:.*$/gmi
    }
    const text = result.text.replace('  ', "").replace(',', '\n')
    const fields = {
        email: text.match(rules.mailRule),
        linkedinProfileUrl: text.match(rules.linkedinProfileUrlRule),
        mobilePhone: text.match(rules.mobilePhoneRule),
        idNum: text.match(rules.idNum),
        skills: text.match(rules.skills),
        rawData: Binary(pdfFile)
    }
    //save fields as document in mongo
    applicantService.save(fields)
})