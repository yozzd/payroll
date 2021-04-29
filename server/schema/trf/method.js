const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const { xlsPass } = require('../../config');

const { intpre0, intpre0v2 } = require('../scalar/number');

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
    const { employee } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

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
          text: 'Bank No.', bold: true, alignment: 'center',
        },
        {
          text: 'Bank Name', bold: true, alignment: 'center',
        },
        {
          text: 'Take Home Pay', bold: true, alignment: 'center',
        },
        {
          text: 'THP for Bank', bold: true, alignment: 'center',
        },
      ],
    ];

    employee.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' }, { text: e.e0, alignment: 'center' },
        e.d0, e.t0, e.s0,
        { text: intpre0(e.ec0).format(), alignment: 'right' },
        { text: intpre0(e.ec0F).format(), alignment: 'right' },
      ]);

      return true;
    });

    vw1.push(['', '', '', '', '', { text: intpre0(p.sum1).format(), alignment: 'right' }, { text: intpre0(p.sum2).format(), alignment: 'right' }]);

    const docDefinition = {
      footer: (currentPage, pageCount) => ({
        columns: [
          { text: `${currentPage.toString()} / ${pageCount}`, fontSize: 8, margin: [20, 0] },
        ],
      }),
      content: [
        {
          style: 'tbl1',
          table: {
            widths: [170, 200, 135],
            body: [
              [{
                image: 'static/images/logo.png', width: 60, rowSpan: 2, border: [false, false, false, false],
              }, {
                text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true, fontSize: 8, border: [false, false, false, true],
              }, {
                text: 'BY TRANSFER', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
              }],
              ['', { text: 'Kawasan Industri Sekupang Kav. 34 Batam - Indonesia', border: [false, false, false, false] }, {
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
                text: `By Transfer - Periode Payroll ${p.period} ${p.year}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl1',
          table: {
            widths: [15, 40, 160, 70, 40, 60, 60],
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
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/report/${p.dir}/${p.dir}_trf.pdf`));
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
      wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: intpre0v2(t.ec0).format() };
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: intpre0v2(t.ec0F).format() };
      
      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`A${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`B${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`C${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: intpre0v2(p.sum1).format() };
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: intpre0v2(p.sum2).format() };

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
  genPDF,
  genXLS,
};
