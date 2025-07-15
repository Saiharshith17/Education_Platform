import { PDFDocument } from 'pdf-lib';

async function trimPDFto40(file) {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);

  if (pdfDoc.getPageCount() <= 40) {
    // No trimming needed
    return file;
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, [...Array(40).keys()]);
  copiedPages.forEach((p) => newPdf.addPage(p));

  const newBytes = await newPdf.save();
  return new File([newBytes], `trimmed-${file.name}`, { type: 'application/pdf' });
}
