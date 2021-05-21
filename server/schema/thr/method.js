const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const nodemailer = require('nodemailer');

const { getMonth } = require('date-fns');
const { intpre0 } = require('../scalar/number');
const { idDateFormat } = require('../scalar/date');

const smtp = require('../../config/smtp');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const generateThr = async (p, thrPass) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/thr/${p.dir}`);

    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    const ctbl1 = [
      [{ text: 'BASIC THR CALCULATION :', colSpan: 2 }, ''],
      ['Basic Salary', { text: intpre0(e.k0).format(), alignment: 'right' }],
      [{ text: 'FIXED ALLOWANCES :', colSpan: 2 }, ''],
      ['Living Allowance', { text: intpre0(e.l0).format(), alignment: 'right' }],
      ['Housing Allowance', { text: intpre0(e.m0).format(), alignment: 'right' }],
      ['Functional Position Allowance', { text: intpre0(e.n0).format(), alignment: 'right' }],
      ['Functional Allowance', { text: intpre0(e.o0).format(), alignment: 'right' }],
      ['Coordinator Allowance', { text: intpre0(e.p0).format(), alignment: 'right' }],
      ['Transport Allowance', { text: intpre0(e.q0).format(), alignment: 'right' }],
      ['Communication Allowance', { text: intpre0(e.r0).format(), alignment: 'right' }],
      ['Expertise Allowance', { text: intpre0(e.s0).format(), alignment: 'right' }],
      ['Honorarium Allowance', { text: intpre0(e.t0).format(), alignment: 'right' }],
      ['Position Variable Allowance', { text: intpre0(e.u0).format(), alignment: 'right' }],
      ['Functional Variable Allowance', { text: intpre0(e.v0).format(), alignment: 'right' }],
      ['Acting/PLT Allowance', { text: intpre0(e.w0).format(), alignment: 'right' }],
      ['Others Allowance', { text: intpre0(e.x0).format(), alignment: 'right' }],
      [{ text: 'TOTAL >>>', alignment: 'right', bold: true }, { text: intpre0(e.y0).format(), alignment: 'right', bold: true }],
    ];

    const ctbl2 = [
      ['', '', ''],
      [{ text: 'THR Prorate :', colSpan: 3 }, '', ''],
      ['THR', `${e.z0}/12`, { text: intpre0(e.aa0).format(), alignment: 'right' }],
      [{ text: 'Installment Time :', colSpan: 3 }, '', ''],
    ];

    const start = getMonth(p.from);
    const end = getMonth(p.to);
    const ds = [e.ac0, e.ad0, e.ae0, e.af0, e.ag0, e.ah0];

    for (let i = start; i <= end; i += 1) {
      if (ds[i - start] && i === end) {
        ctbl2.push([
          'Penalty 5%', { text: intpre0(ds[i - start]).format(), alignment: 'right' }, '',
        ]);
      } else {
        ctbl2.push([
          `${months[i]} ${p.year}`, { text: intpre0(ds[i - start]).format(), alignment: 'right' }, '',
        ]);
      }
    }

    ctbl2.push([{
      text: 'THR THIS MONTH >>>', colSpan: 2, alignment: 'right', bold: true,
    }, '', { text: intpre0(e.ac0).format(), alignment: 'right', bold: true }]);

    const notes = [
      ['Note :', 'Approved By', 'Received By'],
      [`Installment Time : ${e.ab0} Months`, '', ''],
      ['Tax on THR is calculated at the end of December 2021', 'PT. LABTECH', e.c0],
      ['The Installment value is recalculated if Resign / Finish after this THR', e.ai0, e.j0],
      ['Nilai Penalty sebesar 5% akan ditambahkan pada pembayaran ke tiga cicilan THR ini', '', ''],
      ['Nilai Cicilan ketiga pada bulan Juli belum termasuk Penalty 5%', '', ''],
      ['This is computer generated letter, no signature is required', '', ''],
    ];

    const docDefinition = {
      userPassword: !thrPass ? false : e.slip.pw,
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
                text: 'THR MUSLIM SLIP', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
              }],
              ['', { text: 'Kawasan Industri Sekupang Kav. 34 Batam - Indonesia', border: [false, false, false, false] }, {
                text: idDateFormat(p.from, 'MMMM yyyy'), bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, false],
              }],
            ],
          },
        },
        {
          style: 'tbl2',
          table: {
            widths: [110, 148, 10, 254],
            body: [
              ['Employee No.', { text: e.b0, bold: true, colSpan: 3 }, '', ''],
              ['Employee Name', { text: e.c0, bold: true, colSpan: 3 }, '', ''],
              ['Bank', 'MANDIRI', '/', e.f0],
              ['Position', e.i0, '/', e.g0],
              [{
                text: 'SELAMAT HARI RAYA IDUL FITRI', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 15, 0, 0],
              }, '', '', ''],
              [{
                text: 'MOHON MAAF LAHIR & BATHIN', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 0, 0, 10],
              }, '', '', ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [522],
            heights: [12],
            body: [['']],
          },
          layout: 'noBorders',
        },
        {
          columns: [
            {
              style: 'tbl4',
              table: {
                widths: [110, 50],
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
            widths: [522],
            heights: [12],
            body: [['']],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl2',
          table: {
            widths: [262, 130, 130],
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
          margin: [0, 10, -10, 0],
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(`static/thr/${p.dir}/${e.slip.name}.pdf`));
    pdfDoc.end();

    return { sStatus: 1 };
  } catch (err) {
    if (typeof err === 'string') {
      throw new GraphQLError(err);
    } else {
      throw new GraphQLError(err.message);
    }
  }
};

const sendThr = async (p) => {
  try {
    const { employee: e } = p;

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
    html += `<div>Terlampir slip THR untuk pembayaran ${idDateFormat(p.to, 'MMMM yyyy')}</div>`;
    html += '<div>Slip THR ini dilindungi kata sandi dan kata sandi dalam bentuk (format xxxddmmyy) :</div>';
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
    html += `<div>Attached is the THR slip for ${idDateFormat(p.to, 'MMMM yyyy')}</div>`;
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
      to: e.e0,
      subject: 'Labtech Info - No Reply',
      html,
      attachments: [
        {
          filename: `${e.slip.name}.pdf`,
          path: `static/thr/${p.dir}/${e.slip.name}.pdf`,
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

module.exports = { generateThr, sendThr };
