const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const { xlsPass } = require('../../config');

const { intpre0, floatpre2 } = require('../scalar/number');
const { gDateFormat, idDateFormat } = require('../scalar/date');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
    bolditalics: 'static/font/Roboto-MediumItalic.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const genPDF = async (p) => {
  try {
    const { category } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const vw1 = [
      [
        {
          text: 'No', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Department', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Upah', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'OT', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Percentage', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Jumlah Karyawan', bold: true, alignment: 'center', colSpan: 2,
        },
        '',
      ],
      [
        '', '', '', '', '',
        {
          text: 'Active', bold: true, alignment: 'center',
        },
        {
          text: 'Final Payment', bold: true, alignment: 'center',
        },
      ],
    ];

    category.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' },
        { text: e.department },
        { text: intpre0(e.upah).format(), alignment: 'right' },
        { text: intpre0(e.ot).format(), alignment: 'right' },
        { text: `${floatpre2(e.percentage).format()}%`, alignment: 'right' },
        { text: e.active, alignment: 'right' },
        { text: e.finalPay, alignment: 'right' },
      ]);

      return true;
    });

    vw1.push([
      '', '',
      { text: intpre0(p.totUpah).format(), alignment: 'right' },
      { text: intpre0(p.totOt).format(), alignment: 'right' },
      '',
      { text: intpre0(p.totActive).format(), alignment: 'right' },
      { text: intpre0(p.totFinalPay).format(), alignment: 'right' },
    ]);

    const docDefinition = {
      content: [
        {
          style: 'tbl1',
          table: {
            widths: [170, 0, 200, 125],
            body: [
              [{
                image: 'static/images/logo.png', width: 60, rowSpan: 2, border: [false, false, false, false],
              }, { text: '', border: [false, false, false, false] }, {
                text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true, fontSize: 8, border: [false, false, false, true],
              }, {
                text: 'PERCENTAGE OT', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
              }],
              ['', { text: '', border: [false, false, false, false] }, { text: 'Kawasan Industri Sekupang Kav. 34 Batam - Indonesia', border: [false, false, false, false] }, {
                text: '', border: [false, false, false, false],
              }],
            ],
          },
        },
        {
          style: 'tbl2',
          table: {
            widths: [110, 412],
            body: [
              [{
                text: `Percentage OT - Periode Payroll ${p.period} ${p.year}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [
              15, 120, 60, 60, 60, 60, 60,
            ],
            body: vw1,
          },
        },
      ],
      styles: {
        tbl1: {
          fontSize: 8,
          margin: [-10, -10, -10, 0],
        },
        tbl2: {
          fontSize: 8,
          margin: [-10, 40, -10, 10],
        },
        tbl3: {
          fontSize: 6,
          margin: [-10, -10, -10, 0],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/report/${p.dir}/${p.dir}_percentage.pdf`));
      pdfDoc.on('end', () => {
        resolve({ sStatus: 1 });
      });
      pdfDoc.end();
    });
  } catch (err) {
    if (typeof err === 'string') {
      throw new GraphQLError(err);
    } else {
      throw new GraphQLError(err.message);
    }
  }
};

const genXLS = async (p) => {
  try {
    const { category: e } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const len = e.length + 5;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:G${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `PERCENTAGE OT - PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'Department' },
          C3: { t: 's', v: 'Upah' },
          D3: { t: 's', v: 'OT' },
          E3: { t: 's', v: 'Percentage' },
          F3: { t: 's', v: 'Jumlah Karyawan' },
          F4: { t: 's', v: 'Active' },
          G4: { t: 's', v: 'Final Payment' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
            { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
            { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },
            { s: { r: 2, c: 5 }, e: { r: 2, c: 6 } },
          ],
          '!cols': [
            { wpx: 26 }, { wpx: 200 }, { wpx: 75 }, { wpx: 75 },
            { wpx: 75 }, { wpx: 75 }, { wpx: 75 },
          ],
        },
      },
    };

    let row = 4;
    e.map((t, i) => {
      row += 1;
      wb.Sheets.Sheet1[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet1[`B${row}`] = { t: 's', v: t.department };
      wb.Sheets.Sheet1[`C${row}`] = { t: 'n', v: t.upah, z: '#,##0' };
      wb.Sheets.Sheet1[`D${row}`] = { t: 'n', v: t.ot, z: '#,##0' };
      wb.Sheets.Sheet1[`E${row}`] = { t: 'n', v: t.percentage, z: '0.00' };
      wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: t.active };
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: t.finalPay };

      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`C${row}`] = { t: 'n', v: p.totUpah, z: '#,##0' };
    wb.Sheets.Sheet1[`D${row}`] = { t: 'n', v: p.totOt, z: '#,##0' };
    wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: p.totActive };
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: p.totFinalPay };

    const fn = `static/report/${p.dir}/${p.dir}_percentage.xlsx`;
    const content = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', bookSST: false });
    fs.writeFileSync(fn, content);

    return XlsxPopulate.fromFileAsync(fn)
      .then((workbook) => workbook.toFileAsync(fn, { password: xlsPass })
        .then(() => ({ sStatus: 1 })));
  } catch (err) {
    if (typeof err === 'string') {
      throw new GraphQLError(err);
    } else {
      throw new GraphQLError(err.message);
    }
  }
};

module.exports = {
  genPDF,
  genXLS,
};
