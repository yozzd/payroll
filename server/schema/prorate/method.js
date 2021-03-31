const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const nodemailer = require('nodemailer');

const { intpre0 } = require('../scalar/number');

const smtp = require('../../config/smtp');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const generateProrate = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/prorate/${p.dir}`);

    const m1 = ['22 Des – 31 Des 2020', '01 Jan – 21 Jan 2021', '22 Jan – 21 Feb 2021'];
    const m2 = ['Januari', 'Februari'];

    const ctbl1 = [
      [{
        text: `Hari Kerja & UMK Kenaikan Rp. ${intpre0(e.m0).format()}`, colSpan: 8, bold: true, border: [false, false, false, false],
      }, '', '', '', '', '', '', ''],
      [{ text: m1[0], colSpan: 2 }, '', { text: m1[1], colSpan: 2 }, '', { text: m1[2], colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: e.g0, alignment: 'right' }, 'Days', { text: e.h0, alignment: 'right' }, 'Days', { text: e.i0, alignment: 'right' }, 'Days', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{
        text: 'Basic Salary', colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: `Basic Salary ${p.year - 1}`, colSpan: 2 }, '', { text: `Basic Salary ${p.year}`, colSpan: 2 }, '', { text: `Prorate ${m2[0]}`, colSpan: 2 }, '', { text: `Prorate ${m2[1]}`, colSpan: 2 }, ''],
      [{ text: intpre0(e.j0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.k0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.l0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.m0).format(), alignment: 'right', colSpan: 2 }, ''],
      [{
        text: 'Upah', colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: `Upah ${p.year - 1}`, colSpan: 2 }, '', { text: `Upah ${p.year}`, colSpan: 2 }, '', { text: '', colSpan: 4, border: [false, false, false, false] }, '', '', ''],
      [{ text: intpre0(e.n0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.o0).format(), alignment: 'right', colSpan: 2 }, '', { text: '', colSpan: 4, border: [false, false, false, false] }, '', '', ''],
      [{
        text: 'Tunjangan Tetap', colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{
        text: 'A. Tunjangan Tetap Posisi Fix', colSpan: 8, bold: true, border: [false, false, false, false],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Tj. Posisi Fix Lama', colSpan: 2 }, '', { text: 'Tj. Posisi Fix Baru', colSpan: 2 }, '', { text: `Prorate ${m2[0]}`, colSpan: 2 }, '', { text: `Prorate ${m2[1]}`, colSpan: 2 }, ''],
      [{ text: intpre0(e.p0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.q0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.r0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.s0).format(), alignment: 'right', colSpan: 2 }, ''],
      [{
        text: 'B. Tunjangan Tetap Fungsional Fix', colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Tj. Fungsional Fix Lama', colSpan: 2 }, '', { text: 'Tj. Fungsional Fix Baru', colSpan: 2 }, '', { text: `Prorate ${m2[0]}`, colSpan: 2 }, '', { text: `Prorate ${m2[1]}`, colSpan: 2 }, ''],
      [{ text: intpre0(e.t0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.u0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.v0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.w0).format(), alignment: 'right', colSpan: 2 }, ''],
      [{
        text: 'C. Tunjangan Tetap Expertisi', colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Tj. Expertisi Lama', colSpan: 2 }, '', { text: 'Tj. Expertisi Baru', colSpan: 2 }, '', { text: `Prorate ${m2[0]}`, colSpan: 2 }, '', { text: `Prorate ${m2[1]}`, colSpan: 2 }, ''],
      [{ text: intpre0(e.x0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.y0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.z0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.aa0).format(), alignment: 'right', colSpan: 2 }, ''],
      [{
        text: 'D. Tunjangan Tetap Posisi Variable', colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Tj. Posisi Variable Lama', colSpan: 2 }, '', { text: 'Tj. Posisi Variable Baru', colSpan: 2 }, '', { text: `Prorate ${m2[0]}`, colSpan: 2 }, '', { text: `Prorate ${m2[1]}`, colSpan: 2 }, ''],
      [{ text: intpre0(e.ab0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.ac0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.ad0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.ae0).format(), alignment: 'right', colSpan: 2 }, ''],
      [{
        text: 'E. Tunjangan Tetap Fungsional Variable', colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Tj. Fungsional Variable Lama', colSpan: 2 }, '', { text: 'Tj. Fungsional Variable Baru', colSpan: 2 }, '', { text: `Prorate ${m2[0]}`, colSpan: 2 }, '', { text: `Prorate ${m2[1]}`, colSpan: 2 }, ''],
      [{ text: intpre0(e.af0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.ag0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.ah0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.ai0).format(), alignment: 'right', colSpan: 2 }, ''],
      [{
        text: 'F. Tunjangan Tetap Acting / PLT', colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Tj. Acting / PLT Lama', colSpan: 2 }, '', { text: 'Tj. Acting / PLT Baru', colSpan: 2 }, '', { text: `Prorate ${m2[0]}`, colSpan: 2 }, '', { text: `Prorate ${m2[1]}`, colSpan: 2 }, ''],
      [{ text: intpre0(e.aj0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.ak0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.al0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.am0).format(), alignment: 'right', colSpan: 2 }, ''],
      [{
        text: `Overtime ${m2[0]}`, colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0], pageBreak: 'before',
      }, '', '', '', '', '', '', ''],
      [{ text: 'Overtime Lama', colSpan: 2 }, '', { text: 'Overtime Baru', colSpan: 2 }, '', { text: `Prorate Overtime ${m2[0]}`, colSpan: 2, rowSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: m1[1], colSpan: 2 }, '', { text: m1[1], colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: intpre0(e.an0).format(), alignment: 'right' }, { text: intpre0(e.ao0).format(), alignment: 'right' }, { text: intpre0(e.ap0).format(), alignment: 'right' }, { text: intpre0(e.aq0).format(), alignment: 'right' }, { text: intpre0(e.ar0).format(), alignment: 'right', colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{
        text: `Overtime ${m2[1]}`, colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Overtime Lama', colSpan: 2 }, '', { text: 'Overtime Baru', colSpan: 2 }, '', { text: `Prorate Overtime ${m2[1]}`, colSpan: 2, rowSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: m1[2], colSpan: 2 }, '', { text: m1[2], colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: intpre0(e.as0).format(), alignment: 'right' }, { text: intpre0(e.at0).format(), alignment: 'right' }, { text: intpre0(e.au0).format(), alignment: 'right' }, { text: intpre0(e.av0).format(), alignment: 'right' }, { text: intpre0(e.aw0).format(), alignment: 'right', colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{
        text: `Overtime Dinas Luar ${m2[0]}`, colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Overtime Lama', colSpan: 2 }, '', { text: 'Overtime Baru', colSpan: 2 }, '', { text: `Prorate Overtime Dinas Luar ${m2[0]}`, colSpan: 2, rowSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: m1[1], colSpan: 2 }, '', { text: m1[1], colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{
        text: `Overtime Dinas Luar ${m2[1]}`, colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Overtime Lama', colSpan: 2 }, '', { text: 'Overtime Baru', colSpan: 2 }, '', { text: `Prorate Overtime Dinas Luar ${m2[1]}`, colSpan: 2, rowSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: m1[2], colSpan: 2 }, '', { text: m1[2], colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: intpre0(e.bc0).format(), alignment: 'right' }, { text: intpre0(e.bd0).format(), alignment: 'right' }, { text: intpre0(e.be0).format(), alignment: 'right' }, { text: intpre0(e.bf0).format(), alignment: 'right' }, { text: intpre0(e.bg0).format(), alignment: 'right', colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{
        text: `Absensi ${m2[0]}`, colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Absensi / Day Basic  Lama', colSpan: 2 }, '', { text: 'Absensi / Day Basic Baru', colSpan: 2 }, '', { text: `Prorate Absensi ${m2[0]}`, colSpan: 2, rowSpan: 3 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: m1[1], colSpan: 2 }, '', { text: m1[1], colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      ['Absen', 'Absen / Day', 'Absen', 'Absen / Day', { text: '', colSpan: 2, border: [false, false, false, false] }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: intpre0(e.bh0).format(), alignment: 'right' }, { text: intpre0(e.bi0).format(), alignment: 'right' }, { text: intpre0(e.bj0).format(), alignment: 'right' }, { text: intpre0(e.bk0).format(), alignment: 'right' }, { text: intpre0(e.bl0).format(), alignment: 'right', colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{
        text: `Absensi ${m2[1]}`, colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Absensi / Day Basic  Lama', colSpan: 2 }, '', { text: 'Absensi / Day Basic Baru', colSpan: 2 }, '', { text: `Prorate Absensi ${m2[1]}`, colSpan: 2, rowSpan: 3 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: m1[2], colSpan: 2 }, '', { text: m1[2], colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      ['Absen', 'Absen / Day', 'Absen', 'Absen / Day', { text: '', colSpan: 2, border: [false, false, false, false] }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{ text: intpre0(e.bm0).format(), alignment: 'right' }, { text: intpre0(e.bn0).format(), alignment: 'right' }, { text: intpre0(e.bo0).format(), alignment: 'right' }, { text: intpre0(e.bp0).format(), alignment: 'right' }, { text: intpre0(e.bq0).format(), alignment: 'right', colSpan: 2 }, '', { text: '', colSpan: 2, border: [false, false, false, false] }, ''],
      [{
        text: 'Total Koreksi', colSpan: 8, bold: true, border: [false, false, false, false], margin: [0, 10, 0, 0],
      }, '', '', '', '', '', '', ''],
      [{ text: 'Pembetulan Pembayaran', colSpan: 2 }, '', { text: 'Pemotongan Absensi', colSpan: 2 }, '', { text: '', colSpan: 4, border: [false, false, false, false] }, '', '', ''],
      [{ text: intpre0(e.br0).format(), alignment: 'right', colSpan: 2 }, '', { text: intpre0(e.bs0).format(), alignment: 'right', colSpan: 2 }, '', { text: '', colSpan: 4, border: [false, false, false, false] }, '', '', ''],
    ];

    const docDefinition = {
      userPassword: e.slip.pw,
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
                text: 'PRORATE', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
              [{
                text: `Prorate Penyesuaian UMK  ${p.year - 1} - ${p.year}`, colSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [50, 50, 50, 50, 50, 50, 50, 50],
            body: ctbl1,
          },
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
          margin: [-10, 10, 0, 0],
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(`static/prorate/${p.dir}/${e.slip.name}.pdf`));
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

const sendProrate = async (p) => {
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
    html += `<div>Terlampir slip Prorate Penyesuaian UMK untuk tahun ${p.year} - ${p.year - 1}</div>`;
    html += '<div>Slip ini dilindungi kata sandi dan kata sandi dalam bentuk (format xxxddmmyy) :</div>';
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
    html += `<div>Attached is the Prorate slip for year ${p.year} - ${p.year - 1}</div>`;
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
          path: `static/prorate/${p.dir}/${e.slip.name}.pdf`,
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

module.exports = { generateProrate, sendProrate };
