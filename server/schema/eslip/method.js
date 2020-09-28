const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const { format } = require('date-fns');
const nodemailer = require('nodemailer');

const { intpre0, floatpre2, floatpre3 } = require('../scalar/number');
const { idDateFormat } = require('../scalar/date');

const smtp = require('../../config/smtp');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const generateESlip = async (p, e) => {
  try {
    const d = e.e0.split('-');
    const dir = format(new Date(p.from), 'yyyyMM');
    const dob = format(new Date(`${d[2]} ${d[1]} ${d[0]}`), 'ddMMyy');
    await fs.ensureDir(`static/eslip/${dir}`);

    const ctbl1 = [
      ['Basic Salary', '', '', { text: intpre0(e.q0).format(), alignment: 'right' }],
      ['Overtime', { text: floatpre2(e.r0).format(), alignment: 'right' }, 'Wage/173', { text: intpre0(e.s0).format(), alignment: 'right' }],
      ['Insentif', { text: floatpre2(e.t0).format(), alignment: 'right' }, intpre0(e.u0).format(), { text: intpre0(e.v0).format(), alignment: 'right' }],
      ['Official Overtime', { text: floatpre2(e.w0).format(), alignment: 'right' }, 'Wage/173', { text: intpre0(e.x0).format(), alignment: 'right' }],
    ];

    if (e.y0 || e.z0 || e.aa0 || e.ab0 || e.ac0 || e.ad0 || e.ae0 || e.af0 || e.ag0 || e.ah0 || e.ai0 || e.aj0 || e.ak0) {
      ctbl1.push(['', '', '', '']);
      ctbl1.push([{ text: 'FIXED ALLOWANCES', bold: true }, '', '', '']);
    }
    if (e.y0) ctbl1.push(['Living Allowance', '', '', { text: intpre0(e.y0).format(), alignment: 'right' }]);
    if (e.z0) ctbl1.push(['Housing Allowance', '', '', { text: intpre0(e.z0).format(), alignment: 'right' }]);
    if (e.aa0) ctbl1.push(['Functional Position Allowance', '', '', { text: intpre0(e.aa0).format(), alignment: 'right' }]);
    if (e.ab0) ctbl1.push(['Functional Allowance', '', '', { text: intpre0(e.ab0).format(), alignment: 'right' }]);
    if (e.ac0) ctbl1.push(['Coordinator Allowance', '', '', { text: intpre0(e.ac0).format(), alignment: 'right' }]);
    if (e.ad0) ctbl1.push(['Transport Allowance', '', '', { text: intpre0(e.ad0).format(), alignment: 'right' }]);
    if (e.ae0) ctbl1.push(['Communication Allowance', '', '', { text: intpre0(e.ae0).format(), alignment: 'right' }]);
    if (e.af0) ctbl1.push(['Expertise Allowance', '', '', { text: intpre0(e.af0).format(), alignment: 'right' }]);
    if (e.ag0) ctbl1.push(['Honorarium Allowance', '', '', { text: intpre0(e.ag0).format(), alignment: 'right' }]);
    if (e.ah0) ctbl1.push(['Position Variable Allowance', '', '', { text: intpre0(e.ah0).format(), alignment: 'right' }]);
    if (e.ai0) ctbl1.push(['Functional Variable Allowance', '', '', { text: intpre0(e.ai0).format(), alignment: 'right' }]);
    if (e.aj0) ctbl1.push(['Acting/PLT Allowance', '', '', { text: intpre0(e.aj0).format(), alignment: 'right' }]);
    if (e.ak0) ctbl1.push(['Others Allowance', '', '', { text: intpre0(e.ak0).format(), alignment: 'right' }]);
    if (e.al0 || e.am0 || e.an0 || e.ao0 || e.ap0 || e.aq0 || e.ar0 || e.as0) {
      ctbl1.push(['', '', '', '']);
      ctbl1.push([{ text: 'NON-FIXED ALLOWANCES', bold: true }, '', '', '']);
    }
    if (e.al0) ctbl1.push(['Functional Allowance', '', '', { text: intpre0(e.al0).format(), alignment: 'right' }]);
    if (e.am0) ctbl1.push(['Shift Allowance', '', '', { text: intpre0(e.am0).format(), alignment: 'right' }]);
    if (e.an0) ctbl1.push(['Tig Welding Allowance', '', '', { text: intpre0(e.an0).format(), alignment: 'right' }]);
    if (e.ao0) ctbl1.push(['Plasma Cutting Allowance', '', '', { text: intpre0(e.ao0).format(), alignment: 'right' }]);
    if (e.ap0) ctbl1.push(['LKS Allowance', '', '', { text: intpre0(e.ap0).format(), alignment: 'right' }]);
    if (e.aq0) ctbl1.push(['Koperasi Allowance', '', '', { text: intpre0(e.aq0).format(), alignment: 'right' }]);
    if (e.ar0) ctbl1.push(['Quality System Allowance', '', '', { text: intpre0(e.ar0).format(), alignment: 'right' }]);
    if (e.as0) ctbl1.push(['Others Allowance', '', '', { text: intpre0(e.as0).format(), alignment: 'right' }]);
    ctbl1.push(['', '', '', '']);
    ctbl1.push(['Retro Pay', '', '', { text: intpre0(e.bd0).format(), alignment: 'right' }]);
    if (e.at0) ctbl1.push(['Payments of Leave', '', '', { text: intpre0(e.at0).format(), alignment: 'right' }]);
    if (e.au0) ctbl1.push([{ text: 'Religious Holiday Allowance (THR)', colSpan: 2 }, '', '', { text: intpre0(e.au0).format(), alignment: 'right' }]);
    if (e.av0) ctbl1.push(['Uang Pisah', '', '', { text: intpre0(e.av0).format(), alignment: 'right' }]);
    if (e.aw0) ctbl1.push(['Uang Penghargaan Masa Kerja', '', '', { text: intpre0(e.aw0).format(), alignment: 'right' }]);
    if (e.ax0) ctbl1.push(['Uang Pesangon', '', '', { text: intpre0(e.ax0).format(), alignment: 'right' }]);
    if (e.ay0) ctbl1.push(['Uang Penggantian Hak', '', '15%', { text: intpre0(e.ay0).format(), alignment: 'right' }]);
    if (e.az0) ctbl1.push(['Bonus', '', '', { text: intpre0(e.az0).format(), alignment: 'right' }]);
    ctbl1.push([{ text: 'Other additions are not taxable', colSpan: 2 }, '', '', { text: intpre0(e.ba0).format(), alignment: 'right' }]);
    ctbl1.push([{ text: 'TOTAL EARNINGS', bold: true, alignment: 'right' }, '', '', {
      text: intpre0(e.br0).format(), bold: true, alignment: 'right', fillColor: '#EEEEEE',
    }]);

    const ctbl2 = [
      ['Absent (Days)', floatpre3(e.bb0).format(), { text: intpre0(e.bc0).format(), alignment: 'right' }],
      ['Income Tax NPWP', '', { text: intpre0(e.be0).format(), alignment: 'right' }],
      ['Income Tax Non NPWP', '', { text: intpre0(e.bf0).format(), alignment: 'right' }],
      ['JHT', '2%', { text: intpre0(e.bg0).format(), alignment: 'right' }],
      ['BPJS Health', '1%', { text: intpre0(e.bh0).format(), alignment: 'right' }],
      ['Pension', '1%', { text: intpre0(e.bi0).format(), alignment: 'right' }],
      ['Loan', '', { text: intpre0(e.bj0).format(), alignment: 'right' }],
      ['Kopkar', '', { text: intpre0(e.bk0).format(), alignment: 'right' }],
      ['Canteen', '', { text: intpre0(e.bl0).format(), alignment: 'right' }],
      ['Retro Deductions', '', { text: intpre0(e.bm0).format(), alignment: 'right' }],
      ['Underpayment of Taxes', '', { text: intpre0(e.bn0).format(), alignment: 'right' }],
      [{ text: 'TOTAL DEDUCTIONS', bold: true, alignment: 'right' }, '', {
        text: intpre0(e.bo0).format(), bold: true, alignment: 'right', fillColor: '#EEEEEE',
      }],
      ['', '', ''],
      [{ text: 'GROSS', bold: true }, '', { text: intpre0(e.bp0).format(), bold: true, alignment: 'right' }],
      [{ text: 'Government Borne Tax Returns', colSpan: 2 }, '', { text: intpre0(e.bq0).format(), bold: true, alignment: 'right' }],
    ];

    const notes = [
      ['', 'Note :', '', ''],
      ['-', e.bt0, 'Approved by,', 'Received by,'],
      ['-', { text: 'If there is correction on the limit of complaint on the 15th of each month', rowSpan: 2 }, { text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true }, { text: e.c0, bold: true }],
      ['', '', e.bw0, ''],
    ];

    if (e.bu0) notes.push(['-', e.bu0, '', '']);
    if (e.bv0) notes.push(['-', e.bv0, '', '']);

    const docDefinition = {
      userPassword: `${e.b0.slice(-3)}${dob}`,
      content: [
        {
          style: 'tbl1',
          table: {
            widths: [170, 200, 135],
            body: [
              [{
                image: 'static/images/logo.png', width: 80, height: 20, rowSpan: 2, border: [false, false, false, false],
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
              ['Employee No.', { text: e.b0, bold: true }, '', ''],
              ['Employee Name', { text: e.c0, bold: true }, '', ''],
              ['Bank Account', `MANDIRI / ${e.i0}`, '', ''],
              ['Department', e.j0, '', ''],
              ['Section', e.k0, 'Marital Status', e.n0],
              ['Position', e.l0, 'JPK ID', e.o0],
              ['Tax ID', e.m0, 'BPJS Health ID', e.p0],
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
            {
              style: 'tbl5',
              table: {
                widths: [110, 75, 50],
                heights: 12,
                body: ctbl2,
              },
              layout: 'noBorders',
            },
          ],
        },
        {
          style: 'tbl3',
          table: {
            widths: [266, 186, 63],
            body: [
              ['', 'NET PAYMENT', { text: intpre0(e.bs0).format(), alignment: 'right', margin: [0, 0, 5, 0] }],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl2',
          table: {
            widths: [2, 168, 170, 160],
            body: notes,
          },
          layout: 'noBorders',
        },
      ],
      styles: {
        tbl1: {
          fontSize: 8,
          margin: [-10, -20, -10, 0],
        },
        tbl2: {
          fontSize: 8,
          margin: [-10, 20, -10, 0],
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
    pdfDoc.pipe(fs.createWriteStream(`static/eslip/${dir}/${e._id}.pdf`));
    pdfDoc.end();

    e.slipPath = `/eslip/${dir}/${e._id}.pdf`;

    return { sStatus: 1, slipPath: e.slipPath };
  } catch (err) {
    if (typeof err === 'string') {
      throw new GraphQLError(err);
    } else {
      throw new GraphQLError(err.message);
    }
  }
};

const sendESlip = async (p, e) => {
  try {
    const dir = format(new Date(p.from), 'yyyyMM');

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: true,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
      tls: { rejectUnauthorized: false },
    });

    let html = '';
    html += `<div>Terlampir slip gaji untuk pembayaran ${idDateFormat(p.to, 'MMMM yyyy')}</div>`;
    html += '<div>Slip gaji ini dilindungi kata sandi dan kata sandi dalam bentuk (format xxxddmmyy) :</div>';
    html += '<div>- 3 digit terakhir nomor karyawan</div>';
    html += '<div>- 2 digit tanggal lahir</div>';
    html += '<div>- 2 digit bulan lahir</div>';
    html += '<div>- 2 digit terakhir tahun lahir</div>';
    html += '<p>Untuk masalah terkait pembayaran, Anda dapat menghubungi Departemen HRD atau Departemen Keuangan untuk bantuan lebih lanjut.</p>';
    html += '<div>Catatan:</div>';
    html += '<div>Ini adalah email yang dibuat oleh sistem, mohon jangan dibalas.</div>';
    html += '<div>Apabila slip gagal dibuka, kemungkinan tanggal lahir yang didaftarkan tidak sesuai dengan sistem. Dan lakukan pengajuan perubahan data.</div>';
    html += '<div>Untuk membuka file yang dilindungi kata sandi ini, Anda memerlukan Adobe Reader.</div>';
    html += '<p>-----------------------------------------------------------------------------------</p>';
    html += `<div>Attached is the payslip for ${idDateFormat(p.to, 'MMMM yyyy')}</div>`;
    html += '<div>It is password protected and the password is in the form of (format xxxddmmyy) :</div>';
    html += '<div>- The last 3 digits of the employee number</div>';
    html += '<div>- 2 digit date of birth</div>';
    html += '<div>- 2 digit month of birth</div>';
    html += '<div>- The last 2 digits of the year of birth</div>';
    html += '<p>For any pay related issue, you may contact your local HRD Department or Finance Department for further assistance.</p>';
    html += '<div>Note:</div>';
    html += '<div>This is a system generated mail, please do not reply.</div>';
    html += '<div>If you fail to open the slip, it is possible that the registered date of birth is not in accordance with the system. And make a data change submission.</div>';
    html += '<div>To open this password protected file, you need Adobe Reader.</div>';

    const message = {
      from: `"Labtech Info" <${smtp.sender}>`,
      to: e.h0,
      subject: 'Labtech Info - No Reply',
      html,
      attachments: [
        {
          filename: `${e._id}.pdf`,
          path: `static/eslip/${dir}/${e._id}.pdf`,
        },
      ],
    };

    const info = await transporter.sendMail(message);

    return info;
  } catch (err) {
    if (typeof err === 'string') {
      throw new GraphQLError(err);
    } else {
      throw new GraphQLError(err.message);
    }
  }
};

module.exports = { generateESlip, sendESlip };
