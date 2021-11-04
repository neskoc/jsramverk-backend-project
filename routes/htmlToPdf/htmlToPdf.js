// routes/htmlToPdf.js

"use strict";

const express = require('express');
const router = express.Router();
const htmlToPdf = require('html-pdf-node');

router.post("/", function(request, response) {
    try {
        const options = { format: 'A4' };
        const content = request.body.content.content ? request.body.content.content : "<p></p>";
        const file = { content: content };

        htmlToPdf.generatePdf(file, options).then(pdfBuffer => {
            console.log("PDF Buffer:-", pdfBuffer);
            response.status(201).send(Buffer.from(pdfBuffer));
        });
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});

module.exports = router;
