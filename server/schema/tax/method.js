const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const nodemailer = require('nodemailer');
const { getMonth } = require('date-fns');
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const { xlsPass } = require('../../config');

const { intpre0 } = require('../scalar/number');
const { gDateFormat, idDateFormat } = require('../scalar/date');

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
      [`Installment ${p.year} :`, '', ''],
    ];

    const notes = [
      ['', 'Note :'],
      ['-', 'Jika nominal "Kurang Bayar" maka akan dicicil 6 kali tiap bulan'],
      ['-', 'Jika nominal "Lebih Bayar" maka akan diberikan sekaligus'],
      ['-', e.p0],
      // ['-', 'Karyawan akan menandatangani surat pernyataan yang diberikan secara hardcopy dan dikembalikan ke HRD'],
      // ['-', 'Pengembalian form surat pernyataan paling lambat hari Senin tanggal 19 April jam 12.00'],
    ];

    const start = getMonth(p.from);
    const end = getMonth(p.to);
    const ds = [e.j0, e.k0, e.l0, e.m0, e.n0, e.o0];

    for (let i = start; i <= end; i += 1) {
      ctbl1.push([
        '', months[i], { text: intpre0(Math.abs(ds[i - start])).format(), alignment: 'right' },
      ]);
    }

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
            widths: [100, 60, 60],
            body: ctbl1,
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl2',
          table: {
            widths: [2, 510],
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

const genPDF = async (p) => {
  try {
    const { employee } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

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
          text: 'Hired Date', bold: true, alignment: 'center',
        },
        {
          text: 'Position', bold: true, alignment: 'center',
        },
        {
          text: 'Department', bold: true, alignment: 'center',
        },
        {
          text: 'NPWP', bold: true, alignment: 'center',
        },
        {
          text: 'Basic Salary', bold: true, alignment: 'center',
        },
        {
          text: 'OT Amount', bold: true, alignment: 'center',
        },
        {
          text: 'Allowance', bold: true, alignment: 'center',
        },
        {
          text: 'Ins. Paid By Company', bold: true, alignment: 'center',
        },
        {
          text: 'Retro Fill', bold: true, alignment: 'center',
        },
        {
          text: 'Pesangon, Serv.', bold: true, alignment: 'center',
        },
        {
          text: 'THR, Leave', bold: true, alignment: 'center',
        },
        {
          text: 'Deduction', bold: true, alignment: 'center',
        },
        {
          text: 'Absent', bold: true, alignment: 'center',
        },
        {
          text: 'Gross', bold: true, alignment: 'center',
        },
        {
          text: 'Ins. Paid By Employee', bold: true, alignment: 'center',
        },
        {
          text: 'Pajak Penghasilan Ber NPWP', bold: true, alignment: 'center',
        },
        {
          text: 'Pajak Penghasilan Non NPWP', bold: true, alignment: 'center',
        },
        {
          text: 'Total Tax', bold: true, alignment: 'center',
        },
        {
          text: 'Pengembalian Pajak DTP', bold: true, alignment: 'center',
        },
        {
          text: 'Total All', bold: true, alignment: 'center',
        },
      ],
    ];

    employee.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' }, { text: e.e0, alignment: 'center' }, e.d0,
        { text: gDateFormat(e.i0, 'yyyy-MM-dd'), alignment: 'right' },
        e.y0, e.u0,
        e.q0 ? e.q0 : '',
        { text: intpre0(e.l0).format(), alignment: 'right' },
        { text: intpre0(e.ai0).format(), alignment: 'right' },
        { text: intpre0(e.bk0).format(), alignment: 'right' },
        { text: intpre0(e.cn0).format(), alignment: 'right' },
        { text: intpre0(e.bu0).format(), alignment: 'right' },
        { text: intpre0(e.en0).format(), alignment: 'right' },
        { text: intpre0(e.eq0).format(), alignment: 'right' },
        { text: intpre0(e.df0).format(), alignment: 'right' },
        { text: intpre0(e.cy0).format(), alignment: 'right' },
        { text: intpre0(e.gross).format(), alignment: 'right' },
        { text: intpre0(e.er0).format(), alignment: 'right' },
        { text: intpre0(e.cz0).format(), alignment: 'right' },
        { text: intpre0(e.da0).format(), alignment: 'right' },
        { text: intpre0(e.db0).format(), alignment: 'right' },
        { text: intpre0(e.es0).format(), alignment: 'right' },
        { text: intpre0(e.ttax).format(), alignment: 'right' },
      ]);

      return true;
    });

    vw1.push([
      '', '', '', '', '', '', '',
      { text: intpre0(p.sum1).format(), alignment: 'right' },
      { text: intpre0(p.sum2).format(), alignment: 'right' },
      { text: intpre0(p.sum3).format(), alignment: 'right' },
      { text: intpre0(p.sum4).format(), alignment: 'right' },
      { text: intpre0(p.sum5).format(), alignment: 'right' },
      { text: intpre0(p.sum6).format(), alignment: 'right' },
      { text: intpre0(p.sum7).format(), alignment: 'right' },
      { text: intpre0(p.sum8).format(), alignment: 'right' },
      { text: intpre0(p.sum9).format(), alignment: 'right' },
      { text: intpre0(p.sum10).format(), alignment: 'right' },
      { text: intpre0(p.sum11).format(), alignment: 'right' },
      { text: intpre0(p.sum12).format(), alignment: 'right' },
      { text: intpre0(p.sum13).format(), alignment: 'right' },
      { text: intpre0(p.sum14).format(), alignment: 'right' },
      { text: intpre0(p.sum15).format(), alignment: 'right' },
      { text: intpre0(p.sum16).format(), alignment: 'right' },
    ]);

    const vw2 = [
      [{ text: `Batam, ${idDateFormat(new Date(), 'dd-MM-yyyy')}`, colSpan: 5 }, '', '', '', ''],
      ['Prepared By,', 'Checked By,', 'Reviewed By,', 'Knowledge By,', 'Approved By,'],
      ['', '', '', '', ''],
      ['Ayu Fatimah / Hendra SP.', 'Yutin Sudarni / Ronal P. Siahaan', 'Ignatius Daud P. / Ratnawati', 'Gusti Very Wealthy', 'Eko Hernanto'],
      [{ text: 'Personnel / HR & GA Dept.', bold: true }, { text: 'Finance Dept. / Payroll Controller', bold: true }, { text: 'IT Dept.', bold: true }, { text: 'Finance & HRGA Division', bold: true }, { text: 'Management PT. Labtech Penta International', bold: true }],
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
            widths: [170, 240, 200, 135],
            body: [
              [{
                image: 'static/images/logo.png', width: 60, rowSpan: 2, border: [false, false, false, false],
              }, { text: '', border: [false, false, false, false] }, {
                text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true, fontSize: 8, border: [false, false, false, true],
              }, {
                text: 'TAX', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Tax - Periode Payroll ${p.period} ${p.year}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [
              15, 20, 50, 30, 30, 30, 30,
              35, 30, 30, 30, 30, 30, 30,
              30, 30, 35, 30, 30, 30, 30,
              30, 30,
            ],
            body: vw1,
          },
          layout: {
            paddingLeft() { return 1; },
            paddingRight() { return 1; },
            paddingTop() { return 1; },
            paddingBottom() { return 1; },
          },
        },
        {
          style: 'tbl4',
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
          margin: [-10, 20, -10, 10],
        },
        tbl3: {
          fontSize: 5,
          margin: [-10, -10, -10, 0],
        },
        tbl4: {
          fontSize: 6,
          margin: [-10, -10, -10, 0],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/report/${p.dir}/${p.dir}_tax.pdf`));
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

    const len = e.length + 4;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:W${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `TAX - PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Position' },
          F3: { t: 's', v: 'Department' },
          G3: { t: 's', v: 'NPWP' },
          H3: { t: 's', v: 'Basic Salary' },
          I3: { t: 's', v: 'OT Amount' },
          J3: { t: 's', v: 'Allowance' },
          K3: { t: 's', v: 'Ins. Paid By Company' },
          L3: { t: 's', v: 'Retro Fill' },
          M3: { t: 's', v: 'Pesangon, Serv.' },
          N3: { t: 's', v: 'THR, Leave' },
          O3: { t: 's', v: 'Deduction' },
          P3: { t: 's', v: 'Absent' },
          Q3: { t: 's', v: 'Gross' },
          R3: { t: 's', v: 'Ins. Paid By Employee' },
          S3: { t: 's', v: 'Pajak Penghasilan Ber NPWP' },
          T3: { t: 's', v: 'Pajak Penghasilan Non NPWP' },
          U3: { t: 's', v: 'Total Tax' },
          V3: { t: 's', v: 'Pengembalian Pajak DTP' },
          W3: { t: 's', v: 'Total All' },
          '!cols': [
            { wpx: 26 }, { wpx: 72 }, { wpx: 234 }, { wpx: 62 },
            { wpx: 92 }, { wpx: 188 }, { wpx: 113 }, { wpx: 75 },
            { wpx: 66 }, { wpx: 66 }, { wpx: 110 }, { wpx: 66 },
            { wpx: 84 }, { wpx: 75 }, { wpx: 66 }, { wpx: 66 },
            { wpx: 75 }, { wpx: 112 }, { wpx: 147 }, { wpx: 150 },
            { wpx: 60 }, { wpx: 126 }, { wpx: 55 },
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
      wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: gDateFormat(t.i0, 'yyyy-MM-dd') };
      wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: t.y0 };
      wb.Sheets.Sheet1[`F${row}`] = { t: 's', v: t.u0 };
      wb.Sheets.Sheet1[`G${row}`] = { t: 's', v: t.q0 };
      wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: t.l0, z: '#,##0' };
      wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: t.ai0, z: '#,##0' };
      wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: t.bk0, z: '#,##0' };
      wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: t.cn0, z: '#,##0' };
      wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: t.bu0, z: '#,##0' };
      wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: t.en0, z: '#,##0' };
      wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: t.eq0, z: '#,##0' };
      wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: t.df0, z: '#,##0' };
      wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: t.cy0, z: '#,##0' };
      wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: t.gross, z: '#,##0' };
      wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: t.er0, z: '#,##0' };
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: t.cz0, z: '#,##0' };
      wb.Sheets.Sheet1[`T${row}`] = { t: 'n', v: t.da0, z: '#,##0' };
      wb.Sheets.Sheet1[`U${row}`] = { t: 'n', v: t.db0, z: '#,##0' };
      wb.Sheets.Sheet1[`V${row}`] = { t: 'n', v: t.es0, z: '#,##0' };
      wb.Sheets.Sheet1[`W${row}`] = { t: 'n', v: t.ttax, z: '#,##0' };

      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`A${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`B${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`C${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`F${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`G${row}`] = { t: 's', v: '' };
    wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: p.sum1, z: '#,##0' };
    wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: p.sum2, z: '#,##0' };
    wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: p.sum3, z: '#,##0' };
    wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: p.sum4, z: '#,##0' };
    wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: p.sum5, z: '#,##0' };
    wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: p.sum6, z: '#,##0' };
    wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: p.sum7, z: '#,##0' };
    wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: p.sum8, z: '#,##0' };
    wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: p.sum9, z: '#,##0' };
    wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: p.sum10, z: '#,##0' };
    wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: p.sum11, z: '#,##0' };
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.sum12, z: '#,##0' };
    wb.Sheets.Sheet1[`T${row}`] = { t: 'n', v: p.sum13, z: '#,##0' };
    wb.Sheets.Sheet1[`U${row}`] = { t: 'n', v: p.sum14, z: '#,##0' };
    wb.Sheets.Sheet1[`V${row}`] = { t: 'n', v: p.sum15, z: '#,##0' };
    wb.Sheets.Sheet1[`W${row}`] = { t: 'n', v: p.sum16, z: '#,##0' };

    const fn = `static/report/${p.dir}/${p.dir}_tax.xlsx`;
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
  generateTax,
  sendTax,
  genPDF,
  genXLS,
};
