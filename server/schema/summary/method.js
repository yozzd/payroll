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
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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

const genPDFSumAllow = async (p, y) => {
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
        { text: intpre0(e.tAllow).format(), alignment: 'right' },
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
      { text: intpre0(p.sAllow).format(), alignment: 'right' },
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
                text: 'Summary Allowance', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Allowance - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_allow.pdf`));
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

const genXLSSumAllow = async (p, y) => {
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
          A2: { t: 's', v: `Summary Allowance - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tAllow, z: '#,##0' };

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
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sAllow, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_allow.xlsx`;
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

const genPDFSumOAllow = async (p, y) => {
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
        { text: intpre0(e.tOAllow).format(), alignment: 'right' },
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
      { text: intpre0(p.sOAllow).format(), alignment: 'right' },
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
                text: 'Summary Other Allowance', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Other Allowance - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_other_allow.pdf`));
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

const genXLSSumOAllow = async (p, y) => {
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
          A2: { t: 's', v: `Summary Other Allowance - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tOAllow, z: '#,##0' };

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
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sOAllow, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_other_allow.xlsx`;
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

const genPDFSumPesangon = async (p, y) => {
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
        { text: intpre0(e.tPesangon).format(), alignment: 'right' },
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
      { text: intpre0(p.sPesangon).format(), alignment: 'right' },
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
                text: 'Summary Pesangon, Serv', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Pesangon, Serv - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_pesangon.pdf`));
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

const genXLSSumPesangon = async (p, y) => {
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
          A2: { t: 's', v: `Summary Pesangon, Serv - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tPesangon, z: '#,##0' };

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
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sPesangon, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_pesangon.xlsx`;
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

const genPDFSumThr = async (p, y) => {
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
        { text: intpre0(e.tThr).format(), alignment: 'right' },
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
      { text: intpre0(p.sThr).format(), alignment: 'right' },
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
                text: 'Summary Thr, Leave', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Thr, Leave - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_thr.pdf`));
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

const genXLSSumThr = async (p, y) => {
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
          A2: { t: 's', v: `Summary Thr, Leave - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tThr, z: '#,##0' };

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
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sThr, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_thr.xlsx`;
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

const genPDFSumOIncome = async (p, y) => {
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
        { text: intpre0(e.tOIncome).format(), alignment: 'right' },
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
      { text: intpre0(p.sOIncome).format(), alignment: 'right' },
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
                text: 'Summary Other Income', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Other Income - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_other_income.pdf`));
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

const genXLSSumOIncome = async (p, y) => {
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
          A2: { t: 's', v: `Summary Other Income - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tOIncome, z: '#,##0' };

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
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sOIncome, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_other_income.xlsx`;
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

const genPDFSumAbsent = async (p, y) => {
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
        { text: intpre0(e.tAbsent).format(), alignment: 'right' },
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
      { text: intpre0(p.sAbsent).format(), alignment: 'right' },
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
                text: 'Summary Absent', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Absent - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_absent.pdf`));
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

const genXLSSumAbsent = async (p, y) => {
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
          A2: { t: 's', v: `Summary Absent - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tAbsent, z: '#,##0' };

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
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sAbsent, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_absent.xlsx`;
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

const genPDFSumODeduction = async (p, y) => {
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
        { text: intpre0(e.tODeduction).format(), alignment: 'right' },
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
      { text: intpre0(p.sODeduction).format(), alignment: 'right' },
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
                text: 'Summary Other Deduction', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Other Deduction - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_other_deduction.pdf`));
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

const genXLSSumODeduction = async (p, y) => {
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
          A2: { t: 's', v: `Summary Other Deduction - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tODeduction, z: '#,##0' };

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
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sODeduction, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_other_deduction.xlsx`;
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

const genPDFSumICo = async (p, y) => {
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
        { text: intpre0(e.tICo).format(), alignment: 'right' },
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
      { text: intpre0(p.sICo).format(), alignment: 'right' },
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
                text: 'Summary Ins Paid By Company', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Ins Paid By Company - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_ins_co.pdf`));
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

const genXLSSumICo = async (p, y) => {
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
          A2: { t: 's', v: `Summary Ins Paid By Company - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tICo, z: '#,##0' };

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
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sICo, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_ins_co.xlsx`;
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

const genPDFSumIEmp = async (p, y) => {
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
        { text: intpre0(e.tIEmp).format(), alignment: 'right' },
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
      { text: intpre0(p.sIEmp).format(), alignment: 'right' },
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
                text: 'Summary Ins Paid By Employee', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Ins Paid By Employee - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_ins_emp.pdf`));
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

const genXLSSumIEmp = async (p, y) => {
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
          A2: { t: 's', v: `Summary Ins Paid By Employee - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          H3: { t: 's', v: 'February' },
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
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.tIEmp, z: '#,##0' };

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
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sIEmp, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_ins_emp.xlsx`;
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

const genPDFSumTax = async (p, y) => {
  try {
    const { employee } = p;
    await fs.ensureDir(`static/summary/${y}`);

    const vw1 = [
      [
        {
          text: 'No', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'No Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Nama Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Hire Date', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Position', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Department', bold: true, alignment: 'center', rowSpan: 2
        },
        {
          text: 'January', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'February', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'March', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'April', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'May', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'June', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'July', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'August', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'September', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'October', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'November', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'December', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Total', bold: true, alignment: 'center', rowSpan: 2,
        },
      ],
      [
        '', '', '', '', '', '',
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        { text: 'DTP', bold: true, alignment: 'center' }, { text: 'Non DTP', bold: true, alignment: 'center' },
        '',
      ],
    ];

    employee.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' }, { text: e.e0, alignment: 'center' },
        e.d0, { text: idDateFormat(e.i0, 'dd-MM-yyyy'), alignment: 'center' }, e.y0, e.u0,
        { text: intpre0(e.jan1).format(), alignment: 'right' }, { text: intpre0(e.jan2).format(), alignment: 'right' },
        { text: intpre0(e.feb1).format(), alignment: 'right' }, { text: intpre0(e.feb2).format(), alignment: 'right' },
        { text: intpre0(e.mar1).format(), alignment: 'right' }, { text: intpre0(e.mar2).format(), alignment: 'right' },
        { text: intpre0(e.apr1).format(), alignment: 'right' }, { text: intpre0(e.apr2).format(), alignment: 'right' },
        { text: intpre0(e.mei1).format(), alignment: 'right' }, { text: intpre0(e.mei2).format(), alignment: 'right' },
        { text: intpre0(e.jun1).format(), alignment: 'right' }, { text: intpre0(e.jun2).format(), alignment: 'right' },
        { text: intpre0(e.jul1).format(), alignment: 'right' }, { text: intpre0(e.jul2).format(), alignment: 'right' },
        { text: intpre0(e.agu1).format(), alignment: 'right' }, { text: intpre0(e.agu2).format(), alignment: 'right' },
        { text: intpre0(e.sep1).format(), alignment: 'right' }, { text: intpre0(e.sep2).format(), alignment: 'right' },
        { text: intpre0(e.okt1).format(), alignment: 'right' }, { text: intpre0(e.okt2).format(), alignment: 'right' },
        { text: intpre0(e.nov1).format(), alignment: 'right' }, { text: intpre0(e.nov2).format(), alignment: 'right' },
        { text: intpre0(e.des1).format(), alignment: 'right' }, { text: intpre0(e.des2).format(), alignment: 'right' },
        { text: intpre0(e.tTax).format(), alignment: 'right' },
      ]);

      return true;
    });

    vw1.push([
      '', '', '', '', '', '',
      { text: intpre0(p.totJan1).format(), alignment: 'right' }, { text: intpre0(p.totJan2).format(), alignment: 'right' },
      { text: intpre0(p.totFeb1).format(), alignment: 'right' }, { text: intpre0(p.totFeb2).format(), alignment: 'right' },
      { text: intpre0(p.totMar1).format(), alignment: 'right' }, { text: intpre0(p.totMar2).format(), alignment: 'right' },
      { text: intpre0(p.totApr1).format(), alignment: 'right' }, { text: intpre0(p.totApr2).format(), alignment: 'right' },
      { text: intpre0(p.totMei1).format(), alignment: 'right' }, { text: intpre0(p.totMei2).format(), alignment: 'right' },
      { text: intpre0(p.totJun1).format(), alignment: 'right' }, { text: intpre0(p.totJun2).format(), alignment: 'right' },
      { text: intpre0(p.totJul1).format(), alignment: 'right' }, { text: intpre0(p.totJul2).format(), alignment: 'right' },
      { text: intpre0(p.totAgu1).format(), alignment: 'right' }, { text: intpre0(p.totAgu2).format(), alignment: 'right' },
      { text: intpre0(p.totSep1).format(), alignment: 'right' }, { text: intpre0(p.totSep2).format(), alignment: 'right' },
      { text: intpre0(p.totOkt1).format(), alignment: 'right' }, { text: intpre0(p.totOkt2).format(), alignment: 'right' },
      { text: intpre0(p.totNov1).format(), alignment: 'right' }, { text: intpre0(p.totNov2).format(), alignment: 'right' },
      { text: intpre0(p.totDes1).format(), alignment: 'right' }, { text: intpre0(p.totDes2).format(), alignment: 'right' },
      { text: intpre0(p.sTax).format(), alignment: 'right' },
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
                text: 'Summary Tax', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary Tax - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [
              10, 20, 60, 25, 40, 40, 25, 25,
              25, 25, 25, 25, 25, 25, 25, 25,
              25, 25, 25, 25, 25, 25, 25, 25,
              25, 25, 25, 25, 25, 25, 25, 25,
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
          fontSize: 4,
          margin: [-10, -10, -10, 0],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_tax.pdf`));
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

const genXLSSumTax = async (p, y) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/summary/${y}`);

    const len = e.length + 4;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:AE${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `Summary Tax - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'January' },
          G4: { t: 's', v: 'DTP' },
          H4: { t: 's', v: 'Non DTP' },
          I3: { t: 's', v: 'February' },
          I4: { t: 's', v: 'DTP' },
          J4: { t: 's', v: 'Non DTP' },
          K3: { t: 's', v: 'March' },
          K4: { t: 's', v: 'DTP' },
          L4: { t: 's', v: 'Non DTP' },
          M3: { t: 's', v: 'April' },
          M4: { t: 's', v: 'DTP' },
          N4: { t: 's', v: 'Non DTP' },
          O3: { t: 's', v: 'May' },
          O4: { t: 's', v: 'DTP' },
          P4: { t: 's', v: 'Non DTP' },
          Q3: { t: 's', v: 'June' },
          Q4: { t: 's', v: 'DTP' },
          R4: { t: 's', v: 'Non DTP' },
          S3: { t: 's', v: 'July' },
          S4: { t: 's', v: 'DTP' },
          T4: { t: 's', v: 'Non DTP' },
          U3: { t: 's', v: 'August' },
          U4: { t: 's', v: 'DTP' },
          V4: { t: 's', v: 'Non DTP' },
          W3: { t: 's', v: 'September' },
          W4: { t: 's', v: 'DTP' },
          X4: { t: 's', v: 'Non DTP' },
          Y3: { t: 's', v: 'October' },
          Y4: { t: 's', v: 'DTP' },
          Z4: { t: 's', v: 'Non DTP' },
          AA3: { t: 's', v: 'November' },
          AA4: { t: 's', v: 'DTP' },
          AB4: { t: 's', v: 'Non DTP' },
          AC3: { t: 's', v: 'December' },
          AC4: { t: 's', v: 'DTP' },
          AD4: { t: 's', v: 'Non DTP' },
          AE3: { t: 's', v: 'Total' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 30 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 30 } },
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
            { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
            { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },
            { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } },
            { s: { r: 2, c: 6 }, e: { r: 2, c: 7 } },
            { s: { r: 2, c: 8 }, e: { r: 2, c: 9 } },
            { s: { r: 2, c: 10 }, e: { r: 2, c: 11 } },
            { s: { r: 2, c: 12 }, e: { r: 2, c: 13 } },
            { s: { r: 2, c: 14 }, e: { r: 2, c: 15 } },
            { s: { r: 2, c: 16 }, e: { r: 2, c: 17 } },
            { s: { r: 2, c: 18 }, e: { r: 2, c: 19 } },
            { s: { r: 2, c: 20 }, e: { r: 2, c: 21 } },
            { s: { r: 2, c: 22 }, e: { r: 2, c: 23 } },
            { s: { r: 2, c: 24 }, e: { r: 2, c: 25 } },
            { s: { r: 2, c: 26 }, e: { r: 2, c: 27 } },
            { s: { r: 2, c: 28 }, e: { r: 2, c: 29 } },
            { s: { r: 2, c: 30 }, e: { r: 3, c: 30 } },
          ],
          '!cols': [
            { wpx: 26 }, { wpx: 65 }, { wpx: 240 }, { wpx: 65 },
            { wpx: 120 }, { wpx: 200 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
            { wpx: 90 },
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
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: t.jan1, z: '#,##0' };
      wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: t.jan2, z: '#,##0' };
      wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: t.feb1, z: '#,##0' };
      wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: t.feb2, z: '#,##0' };
      wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: t.mar1, z: '#,##0' };
      wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: t.mar2, z: '#,##0' };
      wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: t.apr1, z: '#,##0' };
      wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: t.apr2, z: '#,##0' };
      wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: t.mei1, z: '#,##0' };
      wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: t.mei2, z: '#,##0' };
      wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: t.jun1, z: '#,##0' };
      wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: t.jun2, z: '#,##0' };
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.jul1, z: '#,##0' };
      wb.Sheets.Sheet1[`T${row}`] = { t: 'n', v: t.jul2, z: '#,##0' };
      wb.Sheets.Sheet1[`U${row}`] = { t: 'n', v: t.agu1, z: '#,##0' };
      wb.Sheets.Sheet1[`V${row}`] = { t: 'n', v: t.agu2, z: '#,##0' };
      wb.Sheets.Sheet1[`W${row}`] = { t: 'n', v: t.sep1, z: '#,##0' };
      wb.Sheets.Sheet1[`X${row}`] = { t: 'n', v: t.sep2, z: '#,##0' };
      wb.Sheets.Sheet1[`Y${row}`] = { t: 'n', v: t.okt1, z: '#,##0' };
      wb.Sheets.Sheet1[`Z${row}`] = { t: 'n', v: t.okt2, z: '#,##0' };
      wb.Sheets.Sheet1[`AA${row}`] = { t: 'n', v: t.nov1, z: '#,##0' };
      wb.Sheets.Sheet1[`AB${row}`] = { t: 'n', v: t.nov2, z: '#,##0' };
      wb.Sheets.Sheet1[`AC${row}`] = { t: 'n', v: t.des1, z: '#,##0' };
      wb.Sheets.Sheet1[`AD${row}`] = { t: 'n', v: t.des2, z: '#,##0' };
      wb.Sheets.Sheet1[`AE${row}`] = { t: 'n', v: t.tTax, z: '#,##0' };

      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: p.totJan1, z: '#,##0' };
    wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: p.totJan2, z: '#,##0' };
    wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: p.totFeb1, z: '#,##0' };
    wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: p.totFeb2, z: '#,##0' };
    wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: p.totMar1, z: '#,##0' };
    wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: p.totMar2, z: '#,##0' };
    wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: p.totApr1, z: '#,##0' };
    wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: p.totApr2, z: '#,##0' };
    wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: p.totMei1, z: '#,##0' };
    wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: p.totMei2, z: '#,##0' };
    wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: p.totJun1, z: '#,##0' };
    wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: p.totJun2, z: '#,##0' };
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.totJul1, z: '#,##0' };
    wb.Sheets.Sheet1[`T${row}`] = { t: 'n', v: p.totJul2, z: '#,##0' };
    wb.Sheets.Sheet1[`U${row}`] = { t: 'n', v: p.totAgu1, z: '#,##0' };
    wb.Sheets.Sheet1[`V${row}`] = { t: 'n', v: p.totAgu2, z: '#,##0' };
    wb.Sheets.Sheet1[`W${row}`] = { t: 'n', v: p.totSep1, z: '#,##0' };
    wb.Sheets.Sheet1[`X${row}`] = { t: 'n', v: p.totSep2, z: '#,##0' };
    wb.Sheets.Sheet1[`Y${row}`] = { t: 'n', v: p.totOkt1, z: '#,##0' };
    wb.Sheets.Sheet1[`Z${row}`] = { t: 'n', v: p.totOkt2, z: '#,##0' };
    wb.Sheets.Sheet1[`AA${row}`] = { t: 'n', v: p.totNov1, z: '#,##0' };
    wb.Sheets.Sheet1[`AB${row}`] = { t: 'n', v: p.totNov2, z: '#,##0' };
    wb.Sheets.Sheet1[`AC${row}`] = { t: 'n', v: p.totDes1, z: '#,##0' };
    wb.Sheets.Sheet1[`AD${row}`] = { t: 'n', v: p.totDes2, z: '#,##0' };
    wb.Sheets.Sheet1[`AE${row}`] = { t: 'n', v: p.sTax, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_tax.xlsx`;
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

const genPDFSumAll = async (p, y) => {
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
          text: 'Basic', bold: true, alignment: 'center',
        },
        {
          text: 'OT', bold: true, alignment: 'center',
        },
        {
          text: 'Allowance', bold: true, alignment: 'center',
        },
        {
          text: 'Other Allowance', bold: true, alignment: 'center',
        },
        {
          text: 'Pesangon, Serv.', bold: true, alignment: 'center',
        },
        {
          text: 'Thr, Leave', bold: true, alignment: 'center',
        },
        {
          text: 'Other Income', bold: true, alignment: 'center',
        },
        {
          text: 'Absent', bold: true, alignment: 'center',
        },
        {
          text: 'Other Deduction', bold: true, alignment: 'center',
        },
        {
          text: 'Ins. Paid By Co', bold: true, alignment: 'center',
        },
        {
          text: 'Ins. Paid By Emp', bold: true, alignment: 'center',
        },
        {
          text: 'Tax Ready Paid', bold: true, alignment: 'center',
        },
      ],
    ];

    employee.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' }, { text: e.e0, alignment: 'center' },
        e.d0, { text: idDateFormat(e.i0, 'dd-MM-yyyy'), alignment: 'center' }, e.y0, e.u0,
        { text: intpre0(e.tBasic).format(), alignment: 'right' },
        { text: intpre0(e.tOT).format(), alignment: 'right' },
        { text: intpre0(e.tAllow).format(), alignment: 'right' },
        { text: intpre0(e.tOAllow).format(), alignment: 'right' },
        { text: intpre0(e.tPesangon).format(), alignment: 'right' },
        { text: intpre0(e.tThr).format(), alignment: 'right' },
        { text: intpre0(e.tOIncome).format(), alignment: 'right' },
        { text: intpre0(e.tAbsent).format(), alignment: 'right' },
        { text: intpre0(e.tODeduction).format(), alignment: 'right' },
        { text: intpre0(e.tICo).format(), alignment: 'right' },
        { text: intpre0(e.tIEmp).format(), alignment: 'right' },
        { text: intpre0(e.tTax).format(), alignment: 'right' },
      ]);

      return true;
    });

    vw1.push([
      '', '', '', '', '', '',
      { text: intpre0(p.sBasic).format(), alignment: 'right' },
      { text: intpre0(p.sOT).format(), alignment: 'right' },
      { text: intpre0(p.sAllow).format(), alignment: 'right' },
      { text: intpre0(p.sOAllow).format(), alignment: 'right' },
      { text: intpre0(p.sPesangon).format(), alignment: 'right' },
      { text: intpre0(p.sThr).format(), alignment: 'right' },
      { text: intpre0(p.sOIncome).format(), alignment: 'right' },
      { text: intpre0(p.sAbsent).format(), alignment: 'right' },
      { text: intpre0(p.sODeduction).format(), alignment: 'right' },
      { text: intpre0(p.sICo).format(), alignment: 'right' },
      { text: intpre0(p.sIEmp).format(), alignment: 'right' },
      { text: intpre0(p.sTax).format(), alignment: 'right' },
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
                text: 'Summary', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Summary - January - December ${y}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
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
      pdfDoc.pipe(fs.createWriteStream(`static/summary/${y}/${y}_sum_all.pdf`));
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

const genXLSSumAll = async (p, y) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/summary/${y}`);

    const len = e.length + 4;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:R${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `Summary - January - December ${y}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'Basic' },
          H3: { t: 's', v: 'OT' },
          I3: { t: 's', v: 'Allowance' },
          J3: { t: 's', v: 'Other Allowance' },
          K3: { t: 's', v: 'Pesangon, Serv.' },
          L3: { t: 's', v: 'Thr, Leave' },
          M3: { t: 's', v: 'Other Income' },
          N3: { t: 's', v: 'Absent' },
          O3: { t: 's', v: 'Other Deduction' },
          P3: { t: 's', v: 'Ins. Paid By Co' },
          Q3: { t: 's', v: 'Ins. Paid By Emp' },
          R3: { t: 's', v: 'Tax Ready Paid' },
          '!cols': [
            { wpx: 26 }, { wpx: 65 }, { wpx: 240 }, { wpx: 65 },
            { wpx: 120 }, { wpx: 200 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 },
            { wpx: 90 }, { wpx: 90 },
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
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: t.tBasic, z: '#,##0' };
      wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: t.tOT, z: '#,##0' };
      wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: t.tAllow, z: '#,##0' };
      wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: t.tOAllow, z: '#,##0' };
      wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: t.tPesangon, z: '#,##0' };
      wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: t.tThr, z: '#,##0' };
      wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: t.tOIncome, z: '#,##0' };
      wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: t.tAbsent, z: '#,##0' };
      wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: t.tODeduction, z: '#,##0' };
      wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: t.tICo, z: '#,##0' };
      wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: t.tIEmp, z: '#,##0' };
      wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: t.tTax, z: '#,##0' };

      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: p.sBasic, z: '#,##0' };
    wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: p.sOT, z: '#,##0' };
    wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: p.sAllow, z: '#,##0' };
    wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: p.sOAllow, z: '#,##0' };
    wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: p.sPesangon, z: '#,##0' };
    wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: p.sThr, z: '#,##0' };
    wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: p.sOIncome, z: '#,##0' };
    wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: p.sAbsent, z: '#,##0' };
    wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: p.sODeduction, z: '#,##0' };
    wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: p.sICo, z: '#,##0' };
    wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: p.sIEmp, z: '#,##0' };
    wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: p.sTax, z: '#,##0' };

    const fn = `static/summary/${y}/${y}_sum_all.xlsx`;
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
  genPDFSumAllow,
  genXLSSumAllow,
  genPDFSumOAllow,
  genXLSSumOAllow,
  genPDFSumPesangon,
  genXLSSumPesangon,
  genPDFSumThr,
  genXLSSumThr,
  genPDFSumOIncome,
  genXLSSumOIncome,
  genPDFSumAbsent,
  genXLSSumAbsent,
  genPDFSumODeduction,
  genXLSSumODeduction,
  genPDFSumICo,
  genXLSSumICo,
  genPDFSumIEmp,
  genXLSSumIEmp,
  genPDFSumTax,
  genXLSSumTax,
  genPDFSumAll,
  genXLSSumAll,
};
