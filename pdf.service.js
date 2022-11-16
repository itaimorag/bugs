const PDFDocument = require('pdfkit')
const fs = require('fs')

module.exports = {
    buildBugsPDF,
}

function buildBugsPDF(bugs, filename = 'Bugs.pdf') {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filename));
    bugs.forEach((bug) => {
      
        for (const key in bug) {
            doc
            .fontSize(20)
            .text(`${key}:${bug[key]}`);
            doc.moveDown(2);
        }
        if (bug !== bugs[bugs.length - 1]) {
            doc
                .addPage()
        }
        // Finalize PDF file
    })
    doc.end();
}
// doc.rect(0, 0, doc.page.width, doc.page.height).fill('#302ed6');
