const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');

const { intpre0 } = require('../scalar/number');
const { gDateFormat } = require('../scalar/date');

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

module.exports = {
  genPDF,
};
