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
        { text: intpre0(e.tBasic).format(), alignment: 'right' },
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
      { text: intpre0(p.sBasic).format(), alignment: 'right' },
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
                text: 'Summary Basic', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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

const genXLSSumBasic = async (p, y) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/summary/${y}`);

    const len = e.length + 4;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:S${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `Summary Basic - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date.' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February'},
          I3: { t: 's', v: 'March' },
          J3: { t: 's', v: 'April' },
          K3: { t: 's', v: 'May' },
          L3: { t: 's', v: 'June' },
          M3: { t: 's', v: 'July' },
          N3: { t: 's', v: 'August' },
          O3: { t: 's', v: 'September' },
          P3: { t: 's', v: 'October' },
          Q3: { t: 's', v: 'November' },
          R3: { t: 's', v: 'December' },
          S3: { t: 's', v: 'Total' },
          '!cols': [
            { wpx: 26 }, { wpx: 65 }, { wpx: 240 }, { wpx: 65 },
            { wpx: 120 }, { wpx: 200 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 }, { wpx: 90 },
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
      wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: idDateFormat(t.i0, 'dd-MM-yyyy') };
      wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: t.y0 };
      wb.Sheets.Sheet1[`F${row}`] = { t: 's', v: t.u0 };
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: t.jan, z: '#,##0' };
      wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: t.feb, z: '#,##0' };
      wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: t.mar, z: '#,##0' };
      wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: t.apr, z: '#,##0' };
      wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: t.mei, z: '#,##0' };
      wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: t.jun, z: '#,##0' };
      wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: t.jul, z: '#,##0' };
      wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: t.agu, z: '#,##0' };
      wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: t.sep, z: '#,##0' };
      wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: t.okt, z: '#,##0' };
      wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: t.nov, z: '#,##0' };
      wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: t.des, z: '#,##0' };
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tBasic, z: '#,##0' };

      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: p.totJan, z: '#,##0' };
    wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: p.totFeb, z: '#,##0' };
    wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: p.totMar, z: '#,##0' };
    wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: p.totApr, z: '#,##0' };
    wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: p.totMei, z: '#,##0' };
    wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: p.totJun, z: '#,##0' };
    wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: p.totJul, z: '#,##0' };
    wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: p.totAgu, z: '#,##0' };
    wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: p.totSep, z: '#,##0' };
    wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: p.totOkt, z: '#,##0' };
    wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: p.totNov, z: '#,##0' };
    wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: p.totDes, z: '#,##0' };
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sBasic, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_basic.xlsx`;
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

const genPDFSumOT = async (p, y) => {
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
        { text: intpre0(e.tOT).format(), alignment: 'right' },
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
      { text: intpre0(p.sOT).format(), alignment: 'right' },
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
                text: 'Summary OT', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary OT - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_ot.pdf`));
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

const genXLSSumOT = async (p, y) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/summary/${y}`);

    const len = e.length + 4;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:S${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `Summary OT - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date.' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February'},
          I3: { t: 's', v: 'March' },
          J3: { t: 's', v: 'April' },
          K3: { t: 's', v: 'May' },
          L3: { t: 's', v: 'June' },
          M3: { t: 's', v: 'July' },
          N3: { t: 's', v: 'August' },
          O3: { t: 's', v: 'September' },
          P3: { t: 's', v: 'October' },
          Q3: { t: 's', v: 'November' },
          R3: { t: 's', v: 'December' },
          S3: { t: 's', v: 'Total' },
          '!cols': [
            { wpx: 26 }, { wpx: 65 }, { wpx: 240 }, { wpx: 65 },
            { wpx: 120 }, { wpx: 200 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 }, { wpx: 90 },
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
      wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: idDateFormat(t.i0, 'dd-MM-yyyy') };
      wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: t.y0 };
      wb.Sheets.Sheet1[`F${row}`] = { t: 's', v: t.u0 };
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: t.jan, z: '#,##0' };
      wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: t.feb, z: '#,##0' };
      wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: t.mar, z: '#,##0' };
      wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: t.apr, z: '#,##0' };
      wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: t.mei, z: '#,##0' };
      wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: t.jun, z: '#,##0' };
      wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: t.jul, z: '#,##0' };
      wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: t.agu, z: '#,##0' };
      wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: t.sep, z: '#,##0' };
      wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: t.okt, z: '#,##0' };
      wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: t.nov, z: '#,##0' };
      wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: t.des, z: '#,##0' };
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tOT, z: '#,##0' };

      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: p.totJan, z: '#,##0' };
    wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: p.totFeb, z: '#,##0' };
    wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: p.totMar, z: '#,##0' };
    wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: p.totApr, z: '#,##0' };
    wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: p.totMei, z: '#,##0' };
    wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: p.totJun, z: '#,##0' };
    wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: p.totJul, z: '#,##0' };
    wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: p.totAgu, z: '#,##0' };
    wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: p.totSep, z: '#,##0' };
    wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: p.totOkt, z: '#,##0' };
    wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: p.totNov, z: '#,##0' };
    wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: p.totDes, z: '#,##0' };
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sOT, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_ot.xlsx`;
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
  genPDFSumOT,
  genXLSSumOT,
};
