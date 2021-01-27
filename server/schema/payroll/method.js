const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
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

const generateReportPayroll = async (p) => {
  try {
    const { employee } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const tbl1 = [
      [
        { text: 'No.', bold: true, alignment: 'center', rowSpan: 2 },
        { text: 'Nama Karyawan', bold: true, alignment: 'center', rowSpan: 2 },
        { text: 'No. Karyawan', bold: true, alignment: 'center', rowSpan: 2 },
        { text: 'Gaji Pokok', bold: true, alignment: 'center', rowSpan: 2 },
        { text: 'Hired Date', bold: true, alignment: 'center', rowSpan: 2 },
        { text: 'Hari Kerja', bold: true, alignment: 'center', rowSpan: 2 },
        { text: 'Department', bold: true, alignment: 'center', rowSpan: 2 },
        { text: 'Lembur Upah / 173', bold: true, alignment: 'center', colSpan: 2 }, '',
        { text: 'Lembur Upah / 173', bold: true, alignment: 'center', colSpan: 2 }, '',
        { text: 'Insentif Lembur', bold: true, alignment: 'center', colSpan: 3 }, '', '',
        { text: 'Total Lembur & Insentif', bold: true, alignment: 'center', rowSpan: 2 },
        { text: 'Tunjagan Tetap', bold: true, alignment: 'center', colSpan: 13 }, '', '', '', '', '', '', '', '', '', '', '', '',
        { text: 'Total Tunjagan Tetap', bold: true, alignment: 'center', rowSpan: 2 },
        { text: 'Upah (Gaji Pokok + Tj. Tetap)', bold: true, alignment: 'center', rowSpan: 2 },
      ],
      [
        '', '', '', '', '', '', '',
        { text: 'Lembur Normal', bold: true, alignment: 'center', colSpan: 2 }, '',
        { text: 'Lembur Dinas Luar', bold: true, alignment: 'center', colSpan: 2 }, '',
        { text: 'Jam / Hari', bold: true, alignment: 'center', colSpan: 2 }, '', { text: 'Jam / Hari * Insentif', bold: true, alignment: 'center' }, '',
        { text: 'Living', bold: true, alignment: 'center' }, { text: 'Perumahan', bold: true, alignment: 'center' },
        { text: 'Posisi Fix', bold: true, alignment: 'center' }, { text: 'Fungsional Fix', bold: true, alignment: 'center' },
        { text: 'Koordinator', bold: true, alignment: 'center' }, { text: 'Transport', bold: true, alignment: 'center' },
        { text: 'Komunikasi', bold: true, alignment: 'center' }, { text: 'Expertisi', bold: true, alignment: 'center' },
        { text: 'Honorarium', bold: true, alignment: 'center' }, { text: 'Posisi Variable', bold: true, alignment: 'center' },
        { text: 'Fungsional Variable', bold: true, alignment: 'center' }, { text: 'Acting / PLT', bold: true, alignment: 'center' },
        { text: 'Others', bold: true, alignment: 'center' }, '', '',
      ],
    ];

		let g0 = 0, ab0 = 0, ac0 = 0, ad0 = 0, ae0 = 0, af0 = 0, ag0 = 0, ah0 = 0;
		let ai0 = 0, aj0 = 0, ak0 = 0, al0 = 0, am0 = 0, an0 = 0, ao0 = 0, ap0 = 0;
		let aq0 = 0, ar0 = 0, as0 = 0, at0 = 0, au0 = 0, av0 = 0, aw0 = 0, ax0 = 0;
		
    employee.map((e, i) => {
      tbl1.push([
        { text: (i + 1), alignment: 'center' }, e.d0, { text: e.e0, alignment: 'center' }, { text: intpre0(e.g0).format(), alignment: 'right' },
        { text: !e.i0 ? null : idDateFormat(e.i0, 'dd-MM-yyyy'), alignment: 'center' }, { text: e.j0 ,alignment: 'center' }, e.u0,
        { text: floatpre2(e.ab0).format(), alignment: 'right' }, { text: intpre0(e.ac0).format(), alignment: 'right' },
        { text: floatpre2(e.ad0).format(), alignment: 'right' }, { text: intpre0(e.ae0).format(), alignment: 'right' },
        { text: floatpre2(e.af0).format(), alignment: 'right' }, { text: intpre0(e.ag0).format(), alignment: 'right' }, { text: intpre0(e.ah0).format(), alignment: 'right' },
        { text: intpre0(e.ai0).format(), alignment: 'right' }, { text: intpre0(e.aj0).format(), alignment: 'right' }, { text: intpre0(e.ak0).format(), alignment: 'right' },
        { text: intpre0(e.al0).format(), alignment: 'right' }, { text: intpre0(e.am0).format(), alignment: 'right' }, { text: intpre0(e.an0).format(), alignment: 'right' },
        { text: intpre0(e.ao0).format(), alignment: 'right' }, { text: intpre0(e.ap0).format(), alignment: 'right' }, { text: intpre0(e.aq0).format(), alignment: 'right' },
        { text: intpre0(e.ar0).format(), alignment: 'right' }, { text: intpre0(e.as0).format(), alignment: 'right' }, { text: intpre0(e.at0).format(), alignment: 'right' },
        { text: intpre0(e.au0).format(), alignment: 'right' }, { text: intpre0(e.av0).format(), alignment: 'right' }, { text: intpre0(e.aw0).format(), alignment: 'right' },
        { text: intpre0(e.ax0).format(), alignment: 'right' },
      ]);

      g0 += e.g0;
      ab0 += e.ab0;
      ac0 += e.ac0;
      ad0 += e.ad0;
      ae0 += e.ae0;
      af0 += e.af0;
      ag0 += e.ag0;
      ah0 += e.ah0;
      ai0 += e.ai0;
      aj0 += e.aj0;
      ak0 += e.ak0;
      al0 += e.al0;
      am0 += e.am0;
      an0 += e.an0;
      ao0 += e.ao0;
      ap0 += e.ap0;
      aq0 += e.aq0;
      ar0 += e.ar0;
      as0 += e.as0;
      at0 += e.at0;
      au0 += e.au0;
      av0 += e.av0;
      aw0 += e.aw0;
      ax0 += e.ax0;
      
      return true;
    });

    tbl1.push([
      '', '', '', { text: intpre0(g0).format(), alignment: 'right' }, '', '', '',
      { text: floatpre2(ab0).format(), alignment: 'right' }, { text: intpre0(ac0).format(), alignment: 'right' }, { text: floatpre2(ad0).format(), alignment: 'right' },
      { text: intpre0(ae0).format(), alignment: 'right' }, { text: floatpre2(af0).format(), alignment: 'right' }, { text: intpre0(ag0).format(), alignment: 'right' },
      { text: intpre0(ah0).format(), alignment: 'right' }, { text: intpre0(ai0).format(), alignment: 'right' }, { text: intpre0(aj0).format(), alignment: 'right' },
      { text: intpre0(ak0).format(), alignment: 'right' }, { text: intpre0(al0).format(), alignment: 'right' }, { text: intpre0(am0).format(), alignment: 'right' },
      { text: intpre0(an0).format(), alignment: 'right' }, { text: intpre0(ao0).format(), alignment: 'right' }, { text: intpre0(ap0).format(), alignment: 'right' },
      { text: intpre0(aq0).format(), alignment: 'right' }, { text: intpre0(ar0).format(), alignment: 'right' }, { text: intpre0(as0).format(), alignment: 'right' },
      { text: intpre0(at0).format(), alignment: 'right' }, { text: intpre0(au0).format(), alignment: 'right' }, { text: intpre0(av0).format(), alignment: 'right' },
      { text: intpre0(aw0).format(), alignment: 'right' }, { text: intpre0(ax0).format(), alignment: 'right' },
    ]);
    
    const docDefinition = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      footer: (currentPage, pageCount) => {
        return {
          columns: [
            { text: `${currentPage.toString()} / ${pageCount}`, fontSize: 4, margin: [20, 0] },
          ],
        };
      },
      content: [
        {
          style: 'tbl',
          table: {
            widths: [
              10, 60, 25, 30, 30, 20, 50, 20, 30, 20,
              30, 20, 30, 30, 30, 30, 30, 30, 30, 30,
              30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
            ],
            headerRows: 2,
            body: tbl1,
          },
          layout: {
            fillColor: (rowIndex) => {
              return rowIndex === employee.length + 2 ? '#eeeeee' : null;
            },
          },
        },
      ],
      styles: {
        tbl: {
          fontSize: 4,
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/report/${p.dir}/${p.dir}_payroll.pdf`));
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

    const ctbl2 = [
      ['Absent (Days)', floatpre3(e.cw0).format(), { text: intpre0(e.cx0).format(), alignment: 'right' }],
      ['Income Tax NPWP', '', { text: intpre0(e.cz0).format(), alignment: 'right' }],
      ['Income Tax Non NPWP', '', { text: intpre0(e.da0).format(), alignment: 'right' }],
      ['JHT', '2%', { text: intpre0(e.ce0).format(), alignment: 'right' }],
      ['BPJS Health', '1%', { text: intpre0(e.cr0).format(), alignment: 'right' }],
      ['Pension', '1%', { text: intpre0(e.cj0).format(), alignment: 'right' }],
      ['Loan', '', { text: intpre0(e.dk0).format(), alignment: 'right' }],
      ['Kopkar', '', { text: intpre0(e.dm0).format(), alignment: 'right' }],
      ['Canteen', '', { text: intpre0(e.dl0).format(), alignment: 'right' }],
      ['Retro Deductions', '', { text: intpre0(e.dj0).format(), alignment: 'right' }],
      ['Underpayment of Taxes', '', { text: intpre0(e.dn0).format(), alignment: 'right' }],
      [{ text: 'TOTAL DEDUCTIONS', bold: true, alignment: 'right' }, '', {
        text: intpre0(e.do0).format(), bold: true, alignment: 'right', fillColor: '#EEEEEE',
      }],
      ['', '', ''],
      [{ text: 'GROSS', bold: true }, '', { text: intpre0(e.dp0).format(), bold: true, alignment: 'right' }],
      [{ text: 'Government Borne Tax Returns', colSpan: 2 }, '', { text: intpre0(e.es0).format(), bold: true, alignment: 'right' }],
    ];

    const notes = [
      ['', 'Note :', '', ''],
      ['-', e.dq0, 'Approved by,', 'Received by,'],
      ['-', { text: 'If there is correction on the limit of complaint on the 15th of each month', rowSpan: 2 }, { text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true }, { text: e.d0, bold: true }],
      ['', '', e.fc0, ''],
    ];

    if (e.m0) notes.push(['-', e.m0, '', '']);
    if (e.fd0) notes.push(['-', e.fd0, '', '']);

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
              ['', 'NET PAYMENT', { text: intpre0(e.ec0).format(), alignment: 'right', margin: [0, 0, 5, 0] }],
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

    return { sStatus: 1 };
  } catch (err) {
    if (typeof err === 'string') {
      throw new GraphQLError(err);
    } else {
      throw new GraphQLError(err.message);
    }
  }
};

const sendSlip = async (p) => {
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
      to: e.ew0,
      subject: 'Labtech Info - No Reply',
      html,
      attachments: [
        {
          filename: `${e.slip.name}.pdf`,
          path: `static/slip/${p.dir}/${e.slip.name}.pdf`,
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

module.exports = { generateReportPayroll, generateSlip, sendSlip };
