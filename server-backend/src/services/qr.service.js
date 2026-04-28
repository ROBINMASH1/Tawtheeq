const qrcode = require('qrcode');
const { PDFDocument } = require('pdf-lib');


//Generates a QR code image buffer from a URL.
exports.generateQRCode = async (verificationUrl) => {
  try {
    // Generate QR code as PNG buffer
    const qrBuffer = await qrcode.toBuffer(verificationUrl, {
      errorCorrectionLevel: 'H', // High error correction for damage resistance
      margin: 1,
      width: 150
    });
    return qrBuffer;
  } catch (error) {
    console.error("QR Code Generation Error:", error);
    throw new Error("Failed to generate QR code");
  }
};

// Embeds a QR code image into a PDF buffer.
exports.embedQRInPDF = async (pdfBuffer, qrImageBuffer) => {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Embed the PNG image
    const qrImage = await pdfDoc.embedPng(qrImageBuffer);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Draw the QR code on the bottom right (adjust coordinates as needed)
    const { width, height } = firstPage.getSize();
    const qrSize = 100;

    firstPage.drawImage(qrImage, {
      x: width - qrSize - 50,
      y: 50,
      width: qrSize,
      height: qrSize,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const modifiedPdfBytes = await pdfDoc.save();

    // Convert back to Buffer
    return Buffer.from(modifiedPdfBytes);
  } catch (error) {
    console.error("PDF QR Embed Error:", error);
    throw new Error("Failed to embed QR code into PDF");
  }
};
