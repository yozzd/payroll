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

const generateTax = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/tax/${p.dir}`);

    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    const ctbl1 = [
      [{ text: e.h0, bold: true }, '', { text: intpre0(Math.abs(e.i0)).format(), alignment: 'right', fontSize: 10 }],
      // [`Installment ${p.year} :`, '', ''],
    ];

    // const start = getMonth(p.from);
    // const end = getMonth(p.to);
    // const ds = [e.j0, e.k0, e.l0, e.m0, e.n0, e.o0];

    // for (let i = start; i <= end; i += 1) {
    //   ctbl1.push([
    //     '', months[i], { text: intpre0(Math.abs(ds[i - start])).format(), alignment: 'right'},
    //   ]);
    // }

    const docDefinition = {
      userPassword: e.slip.pw,
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
                text: 'TAX 21', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
              ['Employee No.', { text: e.b0, bold: true }],
              ['Employee Name', { text: e.c0, bold: true }],
              ['Department', e.f0],
              ['Position', e.g0],
              [{
                text: `TAX 21 YEAR ${p.year - 1}`, colSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [100, 10, 60],
            body: ctbl1,
          },
          layout: 'noBorders',
        },
        // {
        //   style: 'tbl2',
        //   table: {
        //     widths: [552],
        //     body: [
        //       [ `Note: ${e.p0}` ],
        //     ],
        //   },
        //   layout: 'noBorders',
        // },
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
          margin: [150, 10, 0, 0],
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(`static/tax/${p.dir}/${e.slip.name}.pdf`));
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

const sendTax = async (p) => {
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
    html += `<div>Terlampir slip Pajak untuk tahun ${p.year - 1}</div>`;
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
    html += `<div>Attached is the Tax slip for year ${p.year - 1}</div>`;
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
          path: `static/tax/${p.dir}/${e.slip.name}.pdf`,
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

module.exports = { generateTax, sendTax };
