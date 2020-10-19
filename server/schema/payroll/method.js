const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');

const { intpre0, floatpre2, floatpre3 } = require('../scalar/number');
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

    const ctbl1 = [
      ['Basic Salary', '', '', { text: intpre0(e.g0).format(), alignment: 'right' }],
      ['Overtime', { text: floatpre2(e.ab0).format(), alignment: 'right' }, 'Wage/173', { text: intpre0(e.ac0).format(), alignment: 'right' }],
      ['Insentif', { text: floatpre2(e.af0).format(), alignment: 'right' }, intpre0(e.ag0).format(), { text: intpre0(e.ah0).format(), alignment: 'right' }],
      ['Official Overtime', { text: floatpre2(e.ad0).format(), alignment: 'right' }, 'Wage/173', { text: intpre0(e.ae0).format(), alignment: 'right' }],
    ];

    if (e.aj0 || e.ak0 || e.al0 || e.am0 || e.an0 || e.ao0 || e.ap0
      || e.aq0 || e.ar0 || e.as0 || e.at0 || e.au0 || e.av0) {
      ctbl1.push(['', '', '', '']);
      ctbl1.push([{ text: 'FIXED ALLOWANCES', bold: true }, '', '', '']);
    }
    if (e.aj0) ctbl1.push(['Living Allowance', '', '', { text: intpre0(e.aj0).format(), alignment: 'right' }]);
    if (e.ak0) ctbl1.push(['Housing Allowance', '', '', { text: intpre0(e.ak0).format(), alignment: 'right' }]);
    if (e.al0) ctbl1.push(['Functional Position Allowance', '', '', { text: intpre0(e.al0).format(), alignment: 'right' }]);
    if (e.am0) ctbl1.push(['Functional Allowance', '', '', { text: intpre0(e.am0).format(), alignment: 'right' }]);
    if (e.an0) ctbl1.push(['Coordinator Allowance', '', '', { text: intpre0(e.an0).format(), alignment: 'right' }]);
    if (e.ao0) ctbl1.push(['Transport Allowance', '', '', { text: intpre0(e.ao0).format(), alignment: 'right' }]);
    if (e.ap0) ctbl1.push(['Communication Allowance', '', '', { text: intpre0(e.ap0).format(), alignment: 'right' }]);
    if (e.aq0) ctbl1.push(['Expertise Allowance', '', '', { text: intpre0(e.aq0).format(), alignment: 'right' }]);
    if (e.ar0) ctbl1.push(['Honorarium Allowance', '', '', { text: intpre0(e.ar0).format(), alignment: 'right' }]);
    if (e.as0) ctbl1.push(['Position Variable Allowance', '', '', { text: intpre0(e.as0).format(), alignment: 'right' }]);
    if (e.at0) ctbl1.push(['Functional Variable Allowance', '', '', { text: intpre0(e.at0).format(), alignment: 'right' }]);
    if (e.au0) ctbl1.push(['Acting/PLT Allowance', '', '', { text: intpre0(e.au0).format(), alignment: 'right' }]);
    if (e.av0) ctbl1.push(['Others Allowance', '', '', { text: intpre0(e.av0).format(), alignment: 'right' }]);

    if (e.ba0 || e.bb0 || e.bc0 || e.bd0 || e.be0 || e.bf0 || e.bg0 || e.bh0 || e.bi0) {
      ctbl1.push(['', '', '', '']);
      ctbl1.push([{ text: 'NON-FIXED ALLOWANCES', bold: true }, '', '', '']);
    }
    if (e.ba0) ctbl1.push(['Functional Allowance', '', '', { text: intpre0(e.ba0).format(), alignment: 'right' }]);
    if (e.bb0) ctbl1.push(['Shift Allowance', '', '', { text: intpre0(e.bb0).format(), alignment: 'right' }]);
    if (e.bc0) ctbl1.push(['Tig Welding Allowance', '', '', { text: intpre0(e.bc0).format(), alignment: 'right' }]);
    if (e.bd0) ctbl1.push(['Plasma Cutting Allowance', '', '', { text: intpre0(e.bd0).format(), alignment: 'right' }]);
    if (e.be0) ctbl1.push(['LKS Allowance', '', '', { text: intpre0(e.be0).format(), alignment: 'right' }]);
    if (e.bf0) ctbl1.push(['Koperasi Allowance', '', '', { text: intpre0(e.bf0).format(), alignment: 'right' }]);
    if (e.bg0) ctbl1.push(['Quality System Allowance', '', '', { text: intpre0(e.bg0).format(), alignment: 'right' }]);
    if (e.bh0) ctbl1.push([{ text: 'Penghargaan Masa Kerja Allowance', colSpan: 2 }, '', '', { text: intpre0(e.bh0).format(), alignment: 'right' }]);
    if (e.bi0) ctbl1.push(['Others Allowance', '', '', { text: intpre0(e.bi0).format(), alignment: 'right' }]);

    ctbl1.push(['', '', '', '']);
    ctbl1.push(['Retro Pay', '', '', { text: intpre0(e.bu0).format(), alignment: 'right' }]);
    if (e.bz0) ctbl1.push(['Payments of Leave', '', '', { text: intpre0(e.bz0).format(), alignment: 'right' }]);
    if (e.bx0) ctbl1.push([{ text: 'Religious Holiday Allowance (THR)', colSpan: 2 }, '', '', { text: intpre0(e.bx0).format(), alignment: 'right' }]);
    if (e.dt0) ctbl1.push(['Uang Pisah', '', '', { text: intpre0(e.dt0).format(), alignment: 'right' }]);
    if (e.dx0) ctbl1.push(['Uang Penghargaan Masa Kerja', '', '', { text: intpre0(e.dx0).format(), alignment: 'right' }]);
    if (e.dv0) ctbl1.push(['Uang Pesangon', '', '', { text: intpre0(e.dv0).format(), alignment: 'right' }]);
    if (e.dy0) ctbl1.push(['Uang Penggantian Hak', '', '15%', { text: intpre0(e.dy0).format(), alignment: 'right' }]);
    if (e.dr0) ctbl1.push(['Bonus', '', '', { text: intpre0(e.dr0).format(), alignment: 'right' }]);
    ctbl1.push([{ text: 'Other additions are not taxable', colSpan: 2 }, '', '', { text: intpre0(e.bv0).format(), alignment: 'right' }]);
    ctbl1.push([{ text: 'TOTAL EARNINGS', bold: true, alignment: 'right' }, '', '', {
      text: intpre0(e.ca0).format(), bold: true, alignment: 'right', fillColor: '#EEEEEE',
    }]);

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
        {
          style: 'tbl3',
          table: {
            widths: [266, 256],
            body: [
              [{ text: 'EARNINGS', margin: [5, 0, 0, 0] }, 'DEDUCTIONS'],
            ],
          },
          layout: 'noBorders',
        },
        {
          columns: [
            {
              style: 'tbl4',
              table: {
                widths: [110, 30, 45, 50],
                heights: 12,
                body: ctbl1,
              },
              layout: 'noBorders',
            },
            // {
            //   style: 'tbl5',
            //   table: {
            //     widths: [110, 75, 50],
            //     heights: 12,
            //     body: ctbl2,
            //   },
            //   layout: 'noBorders',
            // },
          ],
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
        tbl3: {
          fontSize: 8,
          bold: true,
          fillColor: '#EEEEEE',
          margin: [-10, 10, -10, 0],
        },
        tbl4: {
          fontSize: 8,
          margin: [-10, 10, 0, 0],
        },
        tbl5: {
          fontSize: 8,
          margin: [7, 10, -10, 0],
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
