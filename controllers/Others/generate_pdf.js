const fs = require("fs");
const path = require("path");
const PDFkit = require("pdfkit");
const currentDate = require("./current_date");

function generatePDF(hostelName, res, rechargeHistory, totalAmount) {
  const doc = new PDFkit({ size: "A4", margin: 50 });
  function calculateTextWidth(text, font, fontSize) {
    doc.font(font);
    doc.fontSize(fontSize);
    return doc.widthOfString(text);
  }
  function xCenterPositioner(cellWidth, cellValue, fontFamily, fontSize) {
    return (
      (cellWidth - calculateTextWidth(cellValue, fontFamily, fontSize)) / 2
    );
  }
  function yCenterPositioner(cellHeight, fontSize) {
    return (cellHeight - fontSize) / 2;
  }
  const pdfFilePath = path.join(__dirname, "PDF", "invoice.pdf");
  const logoPath = path.join(__dirname, "PDF", "vsense.png");
  const stream = fs.createWriteStream(pdfFilePath);
  doc.pipe(stream);
  //header section
  doc
    .font("Times-Roman")
    .fontSize(15)
    .text("Alvas Education Foundation", { align: "center" })
    .moveDown(0.5)
    .font("Times-Bold")
    .fontSize(23)
    .text("Vsense Technologies", { continued: true })
    .font("Times-Bold")
    .fontSize(23)
    .text(" , Idea To Product.")
    .moveDown(0.1)
    .font("Times-Roman")
    .fontSize(18)
    .text(
      "An incubated startup of Alvas Institue of Engineering and Technology,Moodbidri-574227",
      { width: 400 }
    )
    .moveDown(0.1)
    .fontSize(15)
    .text("www.vsensetechnologies.com,", {
      link: "www.vsensetechnologies.com",
      continued: true,
    })
    .text("info.vsensetech@gmail.com\n")
    .moveDown(0.1)
    .text("+918147212905");
  doc.image(logoPath, 470, 70, { width: 80 });
  doc.lineWidth(3);
  //date and sub heading
  doc
    .moveTo(doc.page.margins.left, 190)
    .lineTo(doc.page.width - doc.page.margins.left, 190)
    .stroke();
  doc
    .font("Times-Roman")
    .fontSize(16)
    .text(
      `${
        hostelName.charAt(0).toUpperCase() + hostelName.slice(1).toLowerCase()
      } Hostel Recharge Summary`,
      doc.page.margins.left,
      210
    )
    .moveDown(0.2)
    .text(`Date: ${currentDate().indDate}`);
  //table of recharge history
  const startX = doc.page.margins.left;
  let startY = 270;
  let cellWidth = 0;
  const cellHeight = 40;
  let numColumns = 3;
  const numRows = rechargeHistory.length;
  const borderWidth = 1;
  let x = startX;
  let y = 0;
  let currentPageNumber = 1;
  doc.lineWidth(borderWidth);

  for (let row = 0, index = 0; index < numRows + 1; row++, index++) {
    for (let col = 0; col < numColumns; col++) {
      x = x + cellWidth;
      if (
        (currentPageNumber === 1 && row > 12) ||
        (currentPageNumber !== 1 && row > 18)
      ) {
        doc.addPage();
        row = 1;
        startY = 0;
        currentPageNumber++;
      }
      y = startY + row * cellHeight;
      switch (col) {
        case 0:
          cellWidth = 160;
          break;
        case 1:
          cellWidth = 155;
          break;
        case 2:
          cellWidth = 180;
          break;
      }

      doc.rect(x, y, cellWidth, cellHeight).stroke();
      if (row === 0) {
        switch (col) {
          case 0:
            doc
              .font("Times-Roman")
              .fontSize(15)
              .text(
                "Card ID",
                x + xCenterPositioner(cellWidth, "Card ID", "Times-Roman", 15),
                y + yCenterPositioner(cellHeight, 15)
              );
            break;
          case 1:
            doc
              .font("Times-Roman")
              .text(
                "Roll Number",
                x +
                  xCenterPositioner(
                    cellWidth,
                    "Roll Number",
                    "Times-Roman",
                    15
                  ),
                y + yCenterPositioner(cellHeight, 15)
              );
            break;
          case 2:
            doc
              .font("Times-Roman")
              .text(
                "Amount",
                x + xCenterPositioner(cellWidth, "Amount", "Times-Roman", 15),
                y + yCenterPositioner(cellHeight, 15)
              );
        }
      } else {
        switch (col) {
          case 0:
            doc
              .font("Times-Roman")
              .fontSize(2)
              .text(
                rechargeHistory[index - 1].cardId,
                x +
                  xCenterPositioner(
                    cellWidth,
                    rechargeHistory[index - 1].cardId,
                    "Times-Roman",
                    15
                  ),
                y + yCenterPositioner(cellHeight, 15)
              );
            break;
          case 1:
            doc
              .font("Times-Roman")
              .fontSize(14)
              .text(
                rechargeHistory[index - 1].rollNumber,
                x +
                  xCenterPositioner(
                    cellWidth,
                    rechargeHistory[index - 1].rollNumber,
                    "Times-Roman",
                    15
                  ),
                y + yCenterPositioner(cellHeight, 15)
              );
            break;
          case 2:
            doc
              .font("Times-Roman")
              .fontSize(15)
              .text(
                rechargeHistory[index - 1].amount + " RS",
                x +
                  xCenterPositioner(
                    cellWidth,
                    String(rechargeHistory[index - 1].amount + " RS"),
                    "Times-Roman",
                    15
                  ),
                y + yCenterPositioner(cellHeight, 15)
              );
        }
      }
    }
    x = startX;
    if (index === numRows) {
      doc.lineWidth(1);
      doc.rect(x, y + cellHeight, 315, cellHeight).stroke();
      doc
        .font("Times-Roman")
        .fontSize(15)
        .text(
          "Total Recharge Amount",
          x +
            xCenterPositioner(315, "Total Recharge Amount", "Times-Roman", 15),
          y + yCenterPositioner(cellHeight, 15) + cellHeight
        );
      doc.lineWidth(1);
      doc.rect(x + 315, y + cellHeight, 180, cellHeight).stroke();
      doc
        .font("Times-Roman")
        .fontSize(15)
        .text(
          totalAmount + " RS",
          x +
            xCenterPositioner(
              180,
              String(totalAmount + " RS"),
              "Times-Roman",
              15
            ) +
            315,
          y + yCenterPositioner(cellHeight, 15) + cellHeight
        )
        .moveDown(3)
        .text("Software Developed By :", doc.page.margins.left)
        .lineWidth(1)
        .moveTo(doc.page.margins.left, y + 136)
        .lineTo(200, y + 136)
        .stroke()
        .moveDown(0.45)
        .text("Gowtham MA & Shubhanga CS")
        .text("2021-22 Batch")
        .text("AIET,Moodbidri");
    }
    cellWidth = 0;
  }
  doc.end();
  stream.on("finish", () => {
    res.header({ "Content-Type": "application/pdf" });
    res.download(pdfFilePath, "recharge.pdf", (error) => {
      if (error) {
        res.status(500).json({ error: "Server Error" });
      } else {
        fs.unlink(pdfFilePath, (error) => {
          if (error) {
            res.status(500).json({ error: "Server Error" });
          }
        });
      }
    });
  });
}

module.exports = generatePDF;
