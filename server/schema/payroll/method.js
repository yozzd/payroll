const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');

const { idDateFormat } = require('../scalar/date');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const generateSlip = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/slip/${p.dir}`);

    const docDefinition = {
      // userPassword: e.slip.pw,
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
                text: 'SALARY SLIP', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
              }],
              ['', { text: 'Kawasan Industri Sekupang Kav. 34 Batam - Indonesia', border: [false, false, false, false] }, {
                text: idDateFormat(p.to, 'MMMM yyyy'), bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, false],
              }],
            ],
          },
        },
        {
          style: 'tbl2',
          table: {
            widths: [110, 148, 110, 148],
            body: [
              ['Employee No.', { text: e.e0, bold: true }, '', ''],
              ['Employee Name', { text: e.d0, bold: true }, '', ''],
              ['Bank Account', `MANDIRI / ${e.t0}`, '', ''],
              ['Department', e.u0, '', ''],
              ['Section', e.v0, 'Marital Status', e.r0],
              ['Position', e.y0, 'JPK ID', e.z0],
              ['Tax ID', e.q0, 'BPJS Health ID', e.aa0],
            ],
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
          margin: [-10, 40, -10, 0],
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(`static/slip/${p.dir}/${e.slip.name}.pdf`));
    pdfDoc.end();
  } catch (err) {
    if (typeof err === 'string') {
      throw new GraphQLError(err);
    } else {
      throw new GraphQLError(err.message);
    }
  }
};

module.exports = { generateSlip };
