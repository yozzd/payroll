const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const { xlsPass } = require('../../config');

const { intpre0, intpre0v2 } = require('../scalar/number');
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
    const { employee } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

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
          text: 'No. KPJ', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'No. BPJS Kesehatan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Tanggal Lahir', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Upah', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Iuran JKK', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Iuran JKM', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Iuran JHT Tenaga Kerja', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Iuran Jaminan Pensiun', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Total Iuran', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Catatan', bold: true, alignment: 'center', rowSpan: 2,
        },
      ],
      [
        '', '', '', '', '', '', '', '', '',
        {
          text: 'Pemberi Kerja', bold: true, alignment: 'center',
        },
        {
          text: 'Tenaga Kerja', bold: true, alignment: 'center',
        },
        {
          text: 'Pemberi Kerja', bold: true, alignment: 'center',
        },
        {
          text: 'Tenaga Kerja', bold: true, alignment: 'center',
        },
        '', '',
      ],
    ];

    employee.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' }, { text: e.e0, alignment: 'center' },
        e.d0, e.z0, e.aa0,
        { text: gDateFormat(e.o0, 'yyyy-MM-dd'), alignment: 'right' },
        { text: intpre0(e.ay0).format(), alignment: 'right' },
        { text: intpre0(e.cb0).format(), alignment: 'right' },
        { text: intpre0(e.cc0).format(), alignment: 'right' },
        { text: intpre0(e.cd0).format(), alignment: 'right' },
        { text: intpre0(e.ce0).format(), alignment: 'right' },
        { text: intpre0(e.ci0).format(), alignment: 'right' },
        { text: intpre0(e.cj0).format(), alignment: 'right' },
        { text: intpre0(e.cm0).format(), alignment: 'right' },
        e.ck0,
      ]);

      return true;
    });

    vw1.push([
      '', '', '', '', '', '',
      { text: intpre0(p.sum1).format(), alignment: 'right' },
      { text: intpre0(p.sum2).format(), alignment: 'right' },
      { text: intpre0(p.sum3).format(), alignment: 'right' },
      { text: intpre0(p.sum4).format(), alignment: 'right' },
      { text: intpre0(p.sum5).format(), alignment: 'right' },
      { text: intpre0(p.sum6).format(), alignment: 'right' },
      { text: intpre0(p.sum7).format(), alignment: 'right' },
      { text: intpre0(p.sum8).format(), alignment: 'right' },
      '',
    ]);

    const vw2 = [
      [{ text: `Batam, ${idDateFormat(new Date(), 'dd-MM-yyyy')}`, colSpan: 5 }, '', '', '', ''],
      ['Prepared By,', 'Checked By,', 'Reviewed By,', 'Knowledge By,', 'Approved By,'],
      ['', '', '', '', ''],
      ['Ayu Fatimah', 'Ronal P. Siahaan', 'Hendra SP / Yutin Sudarni', 'Gusti Very Wealthy', 'Eko Hernanto'],
      [{ text: 'Personel', bold: true }, { text: 'Payroll Controller', bold: true }, { text: 'HR & GA Dept. / Finance Dept.', bold: true }, { text: 'Finance & HRGA Division', bold: true }, { text: 'Management PT. Labtech Penta International', bold: true }],
    ];

    const docDefinition = {
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
            widths: [170, 200, 200, 135],
            body: [
              [{
                image: 'static/images/logo.png', width: 60, rowSpan: 2, border: [false, false, false, false],
              }, { text: '', border: [false, false, false, false] }, {
                text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true, fontSize: 8, border: [false, false, false, true],
              }, {
                text: 'BPJS KETENAGAKERJAAN', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `BPJS Ketenagakerjaan - Periode Payroll ${p.period} ${p.year}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [
              15, 30, 100, 40, 60, 40, 40,
              40, 40, 40, 40, 40, 40, 40, 40,
            ],
            body: vw1,
          },
        },
        {
          style: 'tbl3',
          margin: [10, 40, 0, 0],
          table: {
            widths: [95, 95, 95, 95, 95],
            heights: [5, 5, 20, 5, 5],
            body: vw2,
          },
          layout: 'noBorders',
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
      pdfDoc.pipe(fs.createWriteStream(`static/report/${p.dir}/${p.dir}_ktg.pdf`));
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

    const len = e.length + 5;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:O${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `BPJS KETENAGAKERJAAN - PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'No KPJ' },
          E3: { t: 's', v: 'No BPJS Kesehatan' },
          F3: { t: 's', v: 'Tanggal Lahir' },
          G3: { t: 's', v: 'Upah' },
          H3: { t: 's', v: 'Iuran JKK' },
          I3: { t: 's', v: 'Iuran JKM' },
          J3: { t: 's', v: 'Iuran JHT Tenaga Kerja' },
          J4: { t: 's', v: 'Pemberi Kerja' },
          K4: { t: 's', v: 'Tenaga Kerja' },
          L3: { t: 's', v: 'Iuran Jaminan Pensiun' },
          L4: { t: 's', v: 'Pemberi Kerja' },
          M4: { t: 's', v: 'Tenaga Kerja' },
          N3: { t: 's', v: 'Total Iuran' },
          O3: { t: 's', v: 'Catatan' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 14 } },
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
            { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
            { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },
            { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } },
            { s: { r: 2, c: 6 }, e: { r: 3, c: 6 } },
            { s: { r: 2, c: 7 }, e: { r: 3, c: 7 } },
            { s: { r: 2, c: 8 }, e: { r: 3, c: 8 } },
            { s: { r: 2, c: 9 }, e: { r: 2, c: 10 } },
            { s: { r: 2, c: 11 }, e: { r: 2, c: 12 } },
            { s: { r: 2, c: 13 }, e: { r: 3, c: 13 } },
            { s: { r: 2, c: 14 }, e: { r: 3, c: 14 } },
          ],
        },
      },
    };

    let row = 4;
    e.map((t, i) => {
      row += 1;
      wb.Sheets.Sheet1[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet1[`B${row}`] = { t: 's', v: t.e0 };
      wb.Sheets.Sheet1[`C${row}`] = { t: 's', v: t.d0 };
      wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: t.z0 ? t.z0 : '' };
      wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: t.aa0 ? t.aa0 : '' };
      wb.Sheets.Sheet1[`F${row}`] = { t: 's', v: t.o0 ? gDateFormat(t.o0, 'dd-MM-yyyy') : '' };
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: intpre0v2(t.ay0).format() };
      wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: intpre0v2(t.cb0).format() };
      wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: intpre0v2(t.cc0).format() };
      wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: intpre0v2(t.cd0).format() };
      wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: intpre0v2(t.ce0).format() };
      wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: intpre0v2(t.ci0).format() };
      wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: intpre0v2(t.cj0).format() };
      wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: intpre0v2(t.cm0).format() };
      wb.Sheets.Sheet1[`O${row}`] = { t: 's', v: t.ck0 ? t.ck0 : '' };

      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`A${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`B${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`C${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`F${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: intpre0v2(p.sum1).format() };
    wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: intpre0v2(p.sum2).format() };
    wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: intpre0v2(p.sum3).format() };
    wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: intpre0v2(p.sum4).format() };
    wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: intpre0v2(p.sum5).format() };
    wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: intpre0v2(p.sum6).format() };
    wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: intpre0v2(p.sum7).format() };
    wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: intpre0v2(p.sum8).format() };
    wb.Sheets.Sheet1[`O${row}`] = { t: 's', v: '' };

    const fn = `static/report/${p.dir}/${p.dir}_ktg.xlsx`;
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
