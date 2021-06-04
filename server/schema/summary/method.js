const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const { xlsPass } = require('../../config');

const { intpre0 } = require('../scalar/number');
const { idDateFormat } = require('../scalar/date');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
    bolditalics: 'static/font/Roboto-MediumItalic.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const genPDFSumBasic = async (p, y) => {
  try {
    const { employee } = p;
    await fs.ensureDir(`static/summary/${y}`);

    const vw1 = [
      [
        {
          text: 'No', bold: true, alignment: 'center',
        },
        {
          text: 'No Karyawan', bold: true, alignment: 'center',
        },
        {
          text: 'Nama Karyawan', bold: true, alignment: 'center',
        },
        {
          text: 'Hire Date', bold: true, alignment: 'center',
        },
        {
          text: 'Position', bold: true, alignment: 'center',
        },
        {
          text: 'Department', bold: true, alignment: 'center',
        },
        {
          text: 'January', bold: true, alignment: 'center',
        },
        {
          text: 'February', bold: true, alignment: 'center',
        },
        {
          text: 'March', bold: true, alignment: 'center',
        },
        {
          text: 'April', bold: true, alignment: 'center',
        },
        {
          text: 'May', bold: true, alignment: 'center',
        },
        {
          text: 'June', bold: true, alignment: 'center',
        },
        {
          text: 'July', bold: true, alignment: 'center',
        },
        {
          text: 'August', bold: true, alignment: 'center',
        },
        {
          text: 'September', bold: true, alignment: 'center',
        },
        {
          text: 'October', bold: true, alignment: 'center',
        },
        {
          text: 'November', bold: true, alignment: 'center',
        },
        {
          text: 'December', bold: true, alignment: 'center',
        },
        {
          text: 'Total', bold: true, alignment: 'center',
        },
      ],
    ];

    employee.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' }, { text: e.e0, alignment: 'center' },
        e.d0, { text: idDateFormat(e.i0, 'dd-MM-yyyy'), alignment: 'center' }, e.y0, e.u0,
        { text: intpre0(e.jan).format(), alignment: 'right' },
        { text: intpre0(e.feb).format(), alignment: 'right' },
        { text: intpre0(e.mar).format(), alignment: 'right' },
        { text: intpre0(e.apr).format(), alignment: 'right' },
        { text: intpre0(e.mei).format(), alignment: 'right' },
        { text: intpre0(e.jun).format(), alignment: 'right' },
        { text: intpre0(e.jul).format(), alignment: 'right' },
        { text: intpre0(e.agu).format(), alignment: 'right' },
        { text: intpre0(e.sep).format(), alignment: 'right' },
        { text: intpre0(e.okt).format(), alignment: 'right' },
        { text: intpre0(e.nov).format(), alignment: 'right' },
        { text: intpre0(e.des).format(), alignment: 'right' },
        { text: intpre0(e.totM).format(), alignment: 'right' },
      ]);

      return true;
    });

    vw1.push([
      '', '', '', '', '', '',
      { text: intpre0(p.totJan).format(), alignment: 'right' },
      { text: intpre0(p.totFeb).format(), alignment: 'right' },
      { text: intpre0(p.totMar).format(), alignment: 'right' },
      { text: intpre0(p.totApr).format(), alignment: 'right' },
      { text: intpre0(p.totMei).format(), alignment: 'right' },
      { text: intpre0(p.totJun).format(), alignment: 'right' },
      { text: intpre0(p.totJul).format(), alignment: 'right' },
      { text: intpre0(p.totAgu).format(), alignment: 'right' },
      { text: intpre0(p.totSep).format(), alignment: 'right' },
      { text: intpre0(p.totOkt).format(), alignment: 'right' },
      { text: intpre0(p.totNov).format(), alignment: 'right' },
      { text: intpre0(p.totDes).format(), alignment: 'right' },
      { text: intpre0(p.totAM).format(), alignment: 'right' },
    ]);

    const docDefinition = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      footer: (currentPage, pageCount) => ({
        columns: [
          { text: `${currentPage.toString()} / ${pageCount}`, fontSize: 8, margin: [20, 0] },
        ],
      }),
      content: [
        {
          style: 'tbl1',
          table: {
            widths: [170, 540, 200, 135],
            body: [
              [{
                image: 'static/images/logo.png', width: 60, rowSpan: 2, border: [false, false, false, false],
              }, { text: '', border: [false, false, false, false] }, {
                text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true, fontSize: 8, border: [false, false, false, true],
              }, {
                text: 'SUMMARY BASIC', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Basic - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [
              15, 30, 130, 40, 60, 120, 40, 40,
              40, 40, 40, 40, 40, 40, 40, 40,
              40, 40, 40,
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_basic.pdf`));
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

const genXLSSumBasic = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const len = e.length + 4;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:G${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `BY TRANSFER - PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Bank No.' },
          E3: { t: 's', v: 'Bank Name' },
          F3: { t: 's', v: 'Take Home Pay' },
          G3: { t: 's', v: 'THP for Bank' },
          '!cols': [
            { wpx: 26 }, { wpx: 72 }, { wpx: 234 }, { wpx: 95 },
            { wpx: 63 }, { wpx: 81 }, { wpx: 75 },
          ],
        },
      },
    };

    let row = 3;
    e.map((t, i) => {
      row += 1;
      wb.Sheets.Sheet1[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet1[`B${row}`] = { t: 's', v: t.e0 };
      wb.Sheets.Sheet1[`C${row}`] = { t: 's', v: t.d0 };
      wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: t.t0 };
      wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: t.s0 };
      wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: t.ec0, z: '#,##0' };
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: t.ec0F, z: '#,##0' };

      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: p.sum1, z: '#,##0' };
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: p.sum2, z: '#,##0' };

    const fn = `static/report/${p.dir}/${p.dir}_trf.xlsx`;
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
  genPDFSumBasic,
  genXLSSumBasic,
};
