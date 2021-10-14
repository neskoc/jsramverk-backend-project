// routes/htmlToPdf.js

"use strict";

const express = require('express');
const router = express.Router();
const htmlToPdf = require('html-pdf-node');

router.post("/", function(request, response) {
    try {
        const options = { format: 'A4' };
        const file = { content: request.body.content.content };

        htmlToPdf.generatePdf(file, options).then(pdfBuffer => {
           /*  const data = {
                data: pdfBuffer
            }; */

            console.log("PDF Buffer:-", pdfBuffer);
            response.status(201).send(Buffer.from(pdfBuffer));
        });
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});

module.exports = router;
