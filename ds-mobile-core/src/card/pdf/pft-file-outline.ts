import { join } from 'path';
const font = join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'common',
  'font',
  'arialnova_light.ttf',
);

const fontBold = join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'common',
  'font',
  'ArialNova-Bold.ttf',
);

export function generateTitle(doc: PDFKit.PDFDocument, title) {
  doc.font(fontBold).text(title, 50, 100, { align: 'center' });
  generateHr(doc, doc.y + 5);
}

export function generateCustomerInfo(doc: PDFKit.PDFDocument, data: any) {
  const beginDate = formatDate(new Date(data.beginDate));
  const endDate = formatDate(new Date(data.endDate));
  doc
    .fontSize(10)
    .font(font)
    .text(`Карта:   ${data.card}`, 50, 130)
    .text(`Дата с:  ${beginDate}`, 50, 150)
    .text(`Дата по: ${endDate}`, 50, 170);
}

export function generateTableHeader(doc: PDFKit.PDFDocument, tableTop: number) {
  const position = tableTop + (0 + 1) * 50;
  generateTable(doc, position, 'Дата', 'Сумма', 'Тип', 'Автомойка', 'Пост');
  generateHr(doc, doc.y + 2);
}

export function generateReportTable(doc: PDFKit.PDFDocument, data: any) {
  let i,
    tableTop = 200;
  doc.font(fontBold);
  generateTableHeader(doc, tableTop);

  doc.font(font);
  tableTop = 220;
  for (i = 0; i < data.length; i++) {
    const item = data[i];
    const position = tableTop + (i + 1) * 50;
    const date = formatDate(item.operDate);
    generateTable(
      doc,
      position,
      date,
      item.operSum,
      item.typeName,
      item.cwName,
      item.devName,
    );
  }
}
export function generateTable(
  doc: PDFKit.PDFDocument,
  yPosition: number,
  c1: string,
  c2: string,
  c3: string,
  c4: string,
  c5: string,
) {
  doc
    .fontSize(10)
    .text(c1, 50, yPosition)
    .text(c2, 150, yPosition)
    .text(c3, 220, yPosition, { width: 90, align: 'right' })
    .text(c4, 350, yPosition, { width: 90, align: 'right' })
    .text(c5, 500, yPosition, { width: 50, align: 'right' });
}

export function generateHr(doc: PDFKit.PDFDocument, yPadding: number) {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, yPadding)
    .lineTo(550, yPadding)
    .stroke();
}

function formatDate(date: Date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
