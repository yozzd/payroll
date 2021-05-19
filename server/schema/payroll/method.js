const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const nodemailer = require('nodemailer');
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const { getDate, getMonth } = require('date-fns');
const { xlsPass } = require('../../config');

const {
  intpre0,
  intpre0v2,
  floatpre2,
  floatpre3,
  floatpre4,
} = require('../scalar/number');
const { gDateFormat, idDateFormat, dateDiff } = require('../scalar/date');
const smtp = require('../../config/smtp');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
    bolditalics: 'static/font/Roboto-MediumItalic.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const terbilang = (x) => {
  const str = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

  if (x < 12) return str[parseInt(x, 10)];
  if (x < 20) return `${terbilang(x - 10)} Belas`;
  if (x < 100) return `${terbilang(x / 10)} Puluh ${terbilang(x % 10)}`;
  if (x < 200) return ` Seratus ${terbilang(x - 100)}`;
  if (x < 1000) return `${terbilang(x / 100)} Ratus ${terbilang(x % 100)}`;
  if (x < 2000) return ` Seribu ${terbilang(x - 1000)}`;
  if (x < 1000000) return `${terbilang(x / 1000)} Ribu ${terbilang(x % 1000)}`;
  if (x < 1000000000) return `${terbilang(x / 1000000)} Juta ${terbilang(x % 1000000)}`;
  return true;
};

const updateEmployee = async (_id, e, p) => {
  const px = await p.findOne({ _id });

  Object.assign(px.employee.id(e._id), e);
  const s = await px.save();
  return s;
};

const generateReportPayroll = async (p) => {
  try {
    const { employee } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const tbl1 = [
      [
        {
          text: 'No.', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Nama Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'No. Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Gaji Pokok', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Hired Date', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Hari Kerja', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Department', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Lembur Upah / 173', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Lembur Upah / 173', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Insentif Lembur', bold: true, alignment: 'center', colSpan: 3,
        }, '', '',
        {
          text: 'Total Lembur & Insentif', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Tunjagan Tetap', bold: true, alignment: 'center', colSpan: 13,
        }, '', '', '', '', '', '', '', '', '', '', '', '',
        {
          text: 'Total Tunjagan Tetap', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Upah (Gaji Pokok + Tj. Tetap)', bold: true, alignment: 'center', rowSpan: 2,
        },
      ],
      [
        '', '', '', '', '', '', '',
        {
          text: 'Lembur Normal', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Lembur Dinas Luar', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Jam / Hari', bold: true, alignment: 'center', colSpan: 2,
        }, '', { text: 'Jam / Hari * Insentif', bold: true, alignment: 'center' }, '',
        { text: 'Living', bold: true, alignment: 'center' }, { text: 'Perumahan', bold: true, alignment: 'center' },
        { text: 'Posisi Fix', bold: true, alignment: 'center' }, { text: 'Fungsional Fix', bold: true, alignment: 'center' },
        { text: 'Koordinator', bold: true, alignment: 'center' }, { text: 'Transport', bold: true, alignment: 'center' },
        { text: 'Komunikasi', bold: true, alignment: 'center' }, { text: 'Expertisi', bold: true, alignment: 'center' },
        { text: 'Honorarium', bold: true, alignment: 'center' }, { text: 'Posisi Variable', bold: true, alignment: 'center' },
        { text: 'Fungsional Variable', bold: true, alignment: 'center' }, { text: 'Acting / PLT', bold: true, alignment: 'center' },
        { text: 'Others', bold: true, alignment: 'center' }, '', '',
      ],
    ];

    const tbl2 = [
      [
        {
          text: 'No.', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Nama Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'No. Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Gaji Pokok', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Department', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Tunjagan Tidak Tetap', bold: true, alignment: 'center', colSpan: 9,
        }, '', '', '', '', '', '', '', '',
        {
          text: 'Total Tunjagan Tidak Tetap', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Pembetulan Pembayaran', bold: true, alignment: 'center', colSpan: 9,
        }, '', '', '', '', '', '', '', '',
        {
          text: 'Total Pembetulan Pembayaran (Retro Fill)', bold: true, alignment: 'center', rowSpan: 2,
        },
      ],
      [
        '', '', '', '', '',
        { text: 'Fungsional', bold: true, alignment: 'center' }, { text: 'Shift', bold: true, alignment: 'center' },
        { text: 'Tig Welding', bold: true, alignment: 'center' }, { text: 'Plasma Cutting', bold: true, alignment: 'center' },
        { text: 'LKS', bold: true, alignment: 'center' }, { text: 'Koperasi', bold: true, alignment: 'center' },
        { text: 'Quality System', bold: true, alignment: 'center' }, { text: 'Penghargaan Masa Kerja', bold: true, alignment: 'center' },
        { text: 'Others', bold: true, alignment: 'center' }, '',
        { text: 'Koreksi Absen', bold: true, alignment: 'center' }, { text: 'Koreksi Gaji & Hari Kerja', bold: true, alignment: 'center' },
        { text: 'Koreksi OT', bold: true, alignment: 'center' }, { text: 'Tunjangan', bold: true, alignment: 'center' },
        { text: 'Insentif', bold: true, alignment: 'center' }, { text: 'THR', bold: true, alignment: 'center' },
        { text: 'Allowance', bold: true, alignment: 'center' }, { text: 'Uang Makan Security', bold: true, alignment: 'center' },
        { text: 'Others', bold: true, alignment: 'center' }, '',
      ],
    ];

    const tbl3 = [
      [
        {
          text: 'No.', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Nama Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'No. Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Gaji Pokok', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Tambahan Lain Tidak Kena Pajak', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'THR Prorate', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Cuti (Leave)', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Pendapatan Kotor', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Absent / Day', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Pemotongan Kelebihan Bayar Gaji & Koreksi Absen', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Pemotongan Kelebihan Bayar OT', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Pemotongan Prorate Absen', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Total Pemotongan (Gaji, OT, Tunjangan)', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Pemotongan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Pemotongan Toolroom', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Pemotongan Lain', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Total Pemotongan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Dana Pinjaman', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Ketring / Canteen', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Kopkar & BMI', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Pph21 Kurang Bayar', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Jumlah Pemotongan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Penghasilan', bold: true, alignment: 'center', rowSpan: 2,
        },
      ],
      [
        '', '', '', '', '',
        { text: 'Months', bold: true, alignment: 'center' }, { text: 'Amount', bold: true, alignment: 'center' },
        { text: 'Days', bold: true, alignment: 'center' }, { text: 'Amount', bold: true, alignment: 'center' }, '',
        { text: 'Absent', bold: true, alignment: 'center' }, { text: 'Amount', bold: true, alignment: 'center' },
      ],
    ];

    const tbl4 = [
      [
        {
          text: 'No.', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Nama Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'No. Karyawan', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Gaji Pokok', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Bonus', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Uang Pisah', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Uang Pesangon', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Uang P. Masa Kerja', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        { text: 'Uang Penggantian Hak', bold: true, alignment: 'center' },
        {
          text: 'Periode Pajak', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Take Home Pay', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Total Transfer By Mandiri', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Total By Cash (For Expat & Final Payment)', bold: true, alignment: 'center', rowSpan: 2,
        },
      ],
      [
        '', '', '', '', '',
        { text: 'Lama Kerja Prorate Tahun', bold: true, alignment: 'center' }, { text: 'Amount', bold: true, alignment: 'center' },
        { text: 'Lama Kerja Prorate Tahun', bold: true, alignment: 'center' }, { text: 'Amount', bold: true, alignment: 'center' },
        { text: 'Lama Kerja Prorate Tahun', bold: true, alignment: 'center' }, { text: 'Amount', bold: true, alignment: 'center' },
        { text: 'Pesangon + P. Masa Kerja * 15%', bold: true, alignment: 'center' },
        { text: 'Bulan', bold: true, alignment: 'center' }, { text: 'Total', bold: true, alignment: 'center' },
      ],
    ];

    const tbl5 = [
      [{ text: `Batam, ${idDateFormat(new Date(), 'dd-MM-yyyy')}`, colSpan: 5 }, '', '', '', ''],
      ['Prepared By,', 'Checked By,', 'Reviewed By,', 'Knowledge By,', 'Approved By,'],
      ['', '', '', '', ''],
      ['Ayu Fatimah / Hendra SP.', 'Yutin Sudarni / Ronal P. Siahaan', 'Ignatius Daud P. / Ratnawati', 'Gusti Very Wealthy', 'Eko Hernanto'],
      [{ text: 'Personnel / HR & GA Dept.', bold: true }, { text: 'Finance Dept. / Payroll Controller', bold: true }, { text: 'IT Dept.', bold: true }, { text: 'Finance & HRGA Division', bold: true }, { text: 'Management PT. Labtech Penta International', bold: true }],
    ];

    employee.map((e, i) => {
      tbl1.push([
        { text: (i + 1), alignment: 'center' }, e.d0, { text: e.e0, alignment: 'center' }, { text: intpre0(e.g0).format(), alignment: 'right' },
        { text: !e.i0 ? null : idDateFormat(e.i0, 'dd-MM-yyyy'), alignment: 'center' }, { text: e.j0, alignment: 'center' }, e.u0,
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

      tbl2.push([
        { text: (i + 1), alignment: 'center' }, e.d0, { text: e.e0, alignment: 'center' }, { text: intpre0(e.g0).format(), alignment: 'right' },
        e.u0, { text: intpre0(e.ba0).format(), alignment: 'right' }, { text: intpre0(e.bb0).format(), alignment: 'right' }, { text: intpre0(e.bc0).format(), alignment: 'right' },
        { text: intpre0(e.bd0).format(), alignment: 'right' }, { text: intpre0(e.be0).format(), alignment: 'right' }, { text: intpre0(e.bf0).format(), alignment: 'right' },
        { text: intpre0(e.bg0).format(), alignment: 'right' }, { text: intpre0(e.bh0).format(), alignment: 'right' }, { text: intpre0(e.bi0).format(), alignment: 'right' },
        { text: intpre0(e.bj0).format(), alignment: 'right' }, { text: intpre0(e.bl0).format(), alignment: 'right' }, { text: intpre0(e.bm0).format(), alignment: 'right' },
        { text: intpre0(e.bn0).format(), alignment: 'right' }, { text: intpre0(e.bo0).format(), alignment: 'right' }, { text: intpre0(e.bp0).format(), alignment: 'right' },
        { text: intpre0(e.bq0).format(), alignment: 'right' }, { text: intpre0(e.br0).format(), alignment: 'right' }, { text: intpre0(e.bs0).format(), alignment: 'right' },
        { text: intpre0(e.bt0).format(), alignment: 'right' }, { text: intpre0(e.bu0).format(), alignment: 'right' },
      ]);

      tbl3.push([
        { text: (i + 1), alignment: 'center' }, e.d0, { text: e.e0, alignment: 'center' }, { text: intpre0(e.g0).format(), alignment: 'right' },
        { text: intpre0(e.bv0).format(), alignment: 'right' }, { text: intpre0(e.bw0).format(), alignment: 'right' }, { text: intpre0(e.bx0).format(), alignment: 'right' },
        { text: intpre0(e.by0).format(), alignment: 'right' }, { text: intpre0(e.bz0).format(), alignment: 'right' }, { text: intpre0(e.ca0).format(), alignment: 'right' },
        { text: floatpre2(e.cw0).format(), alignment: 'right' }, { text: intpre0(e.cx0).format(), alignment: 'right' }, { text: intpre0(e.dc0).format(), alignment: 'right' },
        { text: intpre0(e.dd0).format(), alignment: 'right' }, { text: intpre0(e.de0).format(), alignment: 'right' }, { text: intpre0(e.df0).format(), alignment: 'right' },
        { text: intpre0(e.dg0).format(), alignment: 'right' }, { text: intpre0(e.dh0).format(), alignment: 'right' }, { text: intpre0(e.di0).format(), alignment: 'right' },
        { text: intpre0(e.dj0).format(), alignment: 'right' }, { text: intpre0(e.dk0).format(), alignment: 'right' }, { text: intpre0(e.dl0).format(), alignment: 'right' },
        { text: intpre0(e.dm0).format(), alignment: 'right' }, { text: intpre0(e.dn0).format(), alignment: 'right' }, { text: intpre0(e.do0).format(), alignment: 'right' },
        { text: intpre0(e.dp0).format(), alignment: 'right' },
      ]);

      tbl4.push([
        { text: (i + 1), alignment: 'center' }, e.d0, { text: e.e0, alignment: 'center' }, { text: intpre0(e.g0).format(), alignment: 'right' },
        { text: intpre0(e.dr0).format(), alignment: 'right' }, { text: intpre0(e.ds0).format(), alignment: 'right' }, { text: intpre0(e.dt0).format(), alignment: 'right' },
        { text: intpre0(e.du0).format(), alignment: 'right' }, { text: intpre0(e.dv0).format(), alignment: 'right' }, { text: intpre0(e.dw0).format(), alignment: 'right' },
        { text: intpre0(e.dx0).format(), alignment: 'right' }, { text: intpre0(e.dy0).format(), alignment: 'right' }, { text: e.dz0, alignment: 'center' }, { text: e.ea0, alignment: 'center' },
        { text: intpre0(e.eb0).format(), alignment: 'right' }, { text: intpre0(e.ec0).format(), alignment: 'right' }, { text: intpre0(e.ed0).format(), alignment: 'right' },
      ]);

      return true;
    });

    tbl1.push([
      '', '', '', { text: intpre0(p.g0Sum).format(), alignment: 'right' }, '', '', '',
      { text: floatpre2(p.ab0Sum).format(), alignment: 'right' }, { text: intpre0(p.ac0Sum).format(), alignment: 'right' }, { text: floatpre2(p.ad0Sum).format(), alignment: 'right' },
      { text: intpre0(p.ae0Sum).format(), alignment: 'right' }, { text: floatpre2(p.af0Sum).format(), alignment: 'right' }, { text: intpre0(p.ag0Sum).format(), alignment: 'right' },
      { text: intpre0(p.ah0Sum).format(), alignment: 'right' }, { text: intpre0(p.ai0Sum).format(), alignment: 'right' }, { text: intpre0(p.aj0Sum).format(), alignment: 'right' },
      { text: intpre0(p.ak0Sum).format(), alignment: 'right' }, { text: intpre0(p.al0Sum).format(), alignment: 'right' }, { text: intpre0(p.am0Sum).format(), alignment: 'right' },
      { text: intpre0(p.an0Sum).format(), alignment: 'right' }, { text: intpre0(p.ao0Sum).format(), alignment: 'right' }, { text: intpre0(p.ap0Sum).format(), alignment: 'right' },
      { text: intpre0(p.aq0Sum).format(), alignment: 'right' }, { text: intpre0(p.ar0Sum).format(), alignment: 'right' }, { text: intpre0(p.as0Sum).format(), alignment: 'right' },
      { text: intpre0(p.at0Sum).format(), alignment: 'right' }, { text: intpre0(p.au0Sum).format(), alignment: 'right' }, { text: intpre0(p.av0Sum).format(), alignment: 'right' },
      { text: intpre0(p.aw0Sum).format(), alignment: 'right' }, { text: intpre0(p.ax0Sum).format(), alignment: 'right' },
    ]);

    tbl2.push([
      '', '', '', { text: intpre0(p.g0Sum).format(), alignment: 'right' }, '',
      { text: intpre0(p.ba0Sum).format(), alignment: 'right' }, { text: intpre0(p.bb0Sum).format(), alignment: 'right' }, { text: intpre0(p.bc0Sum).format(), alignment: 'right' },
      { text: intpre0(p.bd0Sum).format(), alignment: 'right' }, { text: intpre0(p.be0Sum).format(), alignment: 'right' }, { text: intpre0(p.bf0Sum).format(), alignment: 'right' },
      { text: intpre0(p.bg0Sum).format(), alignment: 'right' }, { text: intpre0(p.bh0Sum).format(), alignment: 'right' }, { text: intpre0(p.bi0Sum).format(), alignment: 'right' },
      { text: intpre0(p.bj0Sum).format(), alignment: 'right' }, { text: intpre0(p.bl0Sum).format(), alignment: 'right' }, { text: intpre0(p.bm0Sum).format(), alignment: 'right' },
      { text: intpre0(p.bn0Sum).format(), alignment: 'right' }, { text: intpre0(p.bo0Sum).format(), alignment: 'right' }, { text: intpre0(p.bp0Sum).format(), alignment: 'right' },
      { text: intpre0(p.bq0Sum).format(), alignment: 'right' }, { text: intpre0(p.br0Sum).format(), alignment: 'right' }, { text: intpre0(p.bs0Sum).format(), alignment: 'right' },
      { text: intpre0(p.bt0Sum).format(), alignment: 'right' }, { text: intpre0(p.bu0Sum).format(), alignment: 'right' },
    ]);

    tbl3.push([
      '', '', '', { text: intpre0(p.g0Sum).format(), alignment: 'right' },
      { text: intpre0(p.bv0Sum).format(), alignment: 'right' }, { text: intpre0(p.bw0Sum).format(), alignment: 'right' }, { text: intpre0(p.bx0Sum).format(), alignment: 'right' },
      { text: intpre0(p.by0Sum).format(), alignment: 'right' }, { text: intpre0(p.bz0Sum).format(), alignment: 'right' }, { text: intpre0(p.ca0Sum).format(), alignment: 'right' },
      { text: floatpre2(p.cw0Sum).format(), alignment: 'right' }, { text: intpre0(p.cx0Sum).format(), alignment: 'right' }, { text: intpre0(p.dc0Sum).format(), alignment: 'right' },
      { text: intpre0(p.dd0Sum).format(), alignment: 'right' }, { text: intpre0(p.de0Sum).format(), alignment: 'right' }, { text: intpre0(p.df0Sum).format(), alignment: 'right' },
      { text: intpre0(p.dg0Sum).format(), alignment: 'right' }, { text: intpre0(p.dh0Sum).format(), alignment: 'right' }, { text: intpre0(p.di0Sum).format(), alignment: 'right' },
      { text: intpre0(p.dj0Sum).format(), alignment: 'right' }, { text: intpre0(p.dk0Sum).format(), alignment: 'right' }, { text: intpre0(p.dl0Sum).format(), alignment: 'right' },
      { text: intpre0(p.dm0Sum).format(), alignment: 'right' }, { text: intpre0(p.dn0Sum).format(), alignment: 'right' }, { text: intpre0(p.do0Sum).format(), alignment: 'right' },
      { text: intpre0(p.dp0Sum).format(), alignment: 'right' },
    ]);

    tbl4.push([
      '', '', '', { text: intpre0(p.g0Sum).format(), alignment: 'right' },
      { text: intpre0(p.dr0Sum).format(), alignment: 'right' }, { text: intpre0(p.ds0Sum).format(), alignment: 'right' }, { text: intpre0(p.dt0Sum).format(), alignment: 'right' },
      { text: intpre0(p.du0Sum).format(), alignment: 'right' }, { text: intpre0(p.dv0Sum).format(), alignment: 'right' }, { text: intpre0(p.dw0Sum).format(), alignment: 'right' },
      { text: intpre0(p.dx0Sum).format(), alignment: 'right' }, { text: intpre0(p.dy0Sum).format(), alignment: 'right' }, '', '', { text: intpre0(p.eb0Sum).format(), alignment: 'right' },
      { text: intpre0(p.ec0Sum).format(), alignment: 'right' }, { text: intpre0(p.ed0Sum).format(), alignment: 'right' },
    ]);

    const docDefinition = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      footer: (currentPage, pageCount) => ({
        columns: [
          { text: `${currentPage.toString()} / ${pageCount}`, fontSize: 4, margin: [20, 0] },
        ],
      }),
      content: [
        { text: 'PT. Labtech Penta International', bold: true, fontSize: 6 },
        {
          text: `Periode Payroll: ${p.period}`, bold: true, fontSize: 6, margin: [0, 0, 0, 10],
        },
        {
          style: 'tbl',
          table: {
            widths: [
              15, 60, 30, 40, 35, 20, 50, 25, 35, 20,
              35, 20, 35, 35, 35, 35, 35, 35, 35, 35,
              35, 35, 35, 35, 35, 35, 35, 35, 35, 40,
            ],
            headerRows: 2,
            body: tbl1,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === employee.length + 2 ? '#eeeeee' : null),
            paddingLeft() { return 1; },
            paddingRight() { return 1; },
            paddingTop() { return 1; },
            paddingBottom() { return 1; },
          },
        },
        {
          text: 'PT. Labtech Penta International', bold: true, fontSize: 6, pageBreak: 'before',
        },
        {
          text: `Periode Payroll: ${p.period}`, bold: true, fontSize: 6, margin: [0, 0, 0, 10],
        },
        {
          style: 'tbl',
          table: {
            widths: [
              15, 60, 30, 40, 50, 35, 35, 35, 35, 35,
              35, 35, 35, 35, 35, 35, 35, 35, 35, 35,
              35, 35, 35, 35, 35,
            ],
            headerRows: 2,
            body: tbl2,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === employee.length + 2 ? '#eeeeee' : null),
            paddingLeft() { return 1; },
            paddingRight() { return 1; },
            paddingTop() { return 1; },
            paddingBottom() { return 1; },
          },
        },
        {
          text: 'PT. Labtech Penta International', bold: true, fontSize: 6, pageBreak: 'before',
        },
        {
          text: `Periode Payroll: ${p.period}`, bold: true, fontSize: 6, margin: [0, 0, 0, 10],
        },
        {
          style: 'tbl',
          table: {
            widths: [
              15, 60, 30, 40, 35, 35, 35, 35, 35, 40,
              35, 35, 35, 35, 35, 35, 35, 35, 35, 35,
              35, 35, 35, 35, 35, 40,
            ],
            headerRows: 2,
            body: tbl3,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === employee.length + 2 ? '#eeeeee' : null),
            paddingLeft() { return 1; },
            paddingRight() { return 1; },
            paddingTop() { return 1; },
            paddingBottom() { return 1; },
          },
        },
        {
          text: 'PT. Labtech Penta International', bold: true, fontSize: 6, pageBreak: 'before',
        },
        {
          text: `Periode Payroll: ${p.period}`, bold: true, fontSize: 6, margin: [0, 0, 0, 10],
        },
        {
          style: 'tbl',
          table: {
            widths: [
              15, 60, 30, 40, 35, 35, 35, 35, 35, 35,
              35, 35, 35, 35, 40, 40, 40,
            ],
            headerRows: 2,
            body: tbl4,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === employee.length + 2 ? '#eeeeee' : null),
            paddingLeft() { return 1; },
            paddingRight() { return 1; },
            paddingTop() { return 1; },
            paddingBottom() { return 1; },
          },
        },
        {
          style: 'tbl2',
          margin: [10, 40, 0, 0],
          table: {
            widths: [95, 95, 95, 95, 95],
            heights: [5, 5, 20, 5, 5],
            body: tbl5,
          },
          layout: 'noBorders',
        },
      ],
      styles: {
        tbl: {
          fontSize: 6,
        },
        tbl2: {
          fontSize: 6,
          margin: [-10, -10, -10, 0],
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

const genPayrollXLS = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const len = e.length + 5;
    const wb = {
      SheetNames: ['Sheet1', 'Sheet2', 'Sheet3', 'Sheet4'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:AD${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Gaji Pokok' },
          E3: { t: 's', v: 'Tunjangan Tetap' },
          E4: { t: 's', v: 'Tj. Tetap Living' },
          F4: { t: 's', v: 'Tj. Tetap Perumahan' },
          G4: { t: 's', v: 'Tj. Tetap Posisi Fix' },
          H4: { t: 's', v: 'Tj. Tetap Fungsional Fix' },
          I4: { t: 's', v: 'Tj. Tetap Koordinator' },
          J4: { t: 's', v: 'Tj. Tetap Transport' },
          K4: { t: 's', v: 'Tj. Tetap Komunikasi' },
          L4: { t: 's', v: 'Tj. Tetap Expertisi' },
          M4: { t: 's', v: 'Tj. Tetap Honorarium' },
          N4: { t: 's', v: 'Tj. Tetap Posisi Variable' },
          O4: { t: 's', v: 'Tj. Tetap Fungsional Variable' },
          P4: { t: 's', v: 'Tj. Tetap Acting / PLT' },
          Q4: { t: 's', v: 'Tj. Tetap Others' },
          R3: { t: 's', v: 'Total Tunjangan Tetap' },
          S3: { t: 's', v: 'Upah (Gaji Pokok + Tj. Tetap)' },
          T3: { t: 's', v: 'Tunjangan Tidak Tetap' },
          T4: { t: 's', v: 'Tj. Tidak Tetap Fungsional' },
          U4: { t: 's', v: 'Tj. Tidak Tetap Shift' },
          V4: { t: 's', v: 'Tj. Tidak Tetap Tig Welding' },
          W4: { t: 's', v: 'Tj. Tidak Tetap Operator Plasma' },
          X4: { t: 's', v: 'Tj. Tidak Tetap LKS' },
          Y4: { t: 's', v: 'Tj. Tidak Tetap Koperasi' },
          Z4: { t: 's', v: 'Tj. Tidak Tetap Quality System' },
          AA4: { t: 's', v: 'Tj. Tidak Tetap Penghargaan Masa Kerja' },
          AB4: { t: 's', v: 'Tj. Tidak Tetap Others' },
          AC3: { t: 's', v: 'Total Tunjangan Tidak Tetap' },
          AD3: { t: 's', v: 'Total Salary' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 27 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 27 } },
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
            { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
            { s: { r: 2, c: 4 }, e: { r: 2, c: 16 } },
            { s: { r: 2, c: 17 }, e: { r: 3, c: 17 } },
            { s: { r: 2, c: 18 }, e: { r: 3, c: 18 } },
            { s: { r: 2, c: 19 }, e: { r: 2, c: 27 } },
            { s: { r: 2, c: 28 }, e: { r: 3, c: 28 } },
            { s: { r: 2, c: 29 }, e: { r: 3, c: 29 } },
          ],
          '!cols': [
            { wpx: 26 }, { wpx: 72 }, { wpx: 234 }, { wpx: 83 },
            { wpx: 79 }, { wpx: 104 }, { wpx: 96 }, { wpx: 119 },
            { wpx: 104 }, { wpx: 95 }, { wpx: 105 }, { wpx: 92 },
            { wpx: 105 }, { wpx: 120 }, { wpx: 143 }, { wpx: 105 },
            { wpx: 81 }, { wpx: 110 }, { wpx: 143 }, { wpx: 131 },
            { wpx: 101 }, { wpx: 135 }, { wpx: 156 }, { wpx: 99 },
            { wpx: 120 }, { wpx: 150 }, { wpx: 196 }, { wpx: 110 },
            { wpx: 138 }, { wpx: 75 },
          ],
        },
        Sheet2: {
          '!ref': `A1:V${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Gaji Pokok' },
          E3: { t: 's', v: 'Lembur Upah / 173' },
          E4: { t: 's', v: 'Lembur Normal' },
          G3: { t: 's', v: 'Lembur Upah / 173' },
          G4: { t: 's', v: 'Lembur Dinas' },
          I3: { t: 's', v: 'Insentif Lembur' },
          I4: { t: 's', v: 'Jam / Hari' },
          K4: { t: 's', v: 'Jam / Hari * Insentif' },
          L3: { t: 's', v: 'Total Lembur & Insentif' },
          M3: { t: 's', v: 'Pembetulan Pembayaran' },
          M4: { t: 's', v: 'Koreksi Absen' },
          N4: { t: 's', v: 'Koreksi Gaji & Hari Kerja' },
          O4: { t: 's', v: 'Koreksi OT' },
          P4: { t: 's', v: 'Tunjangan' },
          Q4: { t: 's', v: 'Insentif' },
          R4: { t: 's', v: 'THR' },
          S4: { t: 's', v: 'Allowance' },
          T4: { t: 's', v: 'Uang Makan Security' },
          U4: { t: 's', v: 'Others' },
          V3: { t: 's', v: 'Total Pembetulan Pembayaran (Retro Fill)' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 21 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 21 } },
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
            { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
            { s: { r: 2, c: 4 }, e: { r: 2, c: 5 } },
            { s: { r: 3, c: 4 }, e: { r: 3, c: 5 } },
            { s: { r: 2, c: 6 }, e: { r: 2, c: 7 } },
            { s: { r: 3, c: 6 }, e: { r: 3, c: 7 } },
            { s: { r: 2, c: 8 }, e: { r: 2, c: 10 } },
            { s: { r: 3, c: 8 }, e: { r: 3, c: 9 } },
            { s: { r: 2, c: 11 }, e: { r: 3, c: 11 } },
            { s: { r: 2, c: 12 }, e: { r: 2, c: 20 } },
            { s: { r: 2, c: 21 }, e: { r: 3, c: 21 } },
          ],
          '!cols': [
            { wpx: 26 }, { wpx: 72 }, { wpx: 234 }, { wpx: 83 },
            { wpx: 47 }, { wpx: 60 }, { wpx: 35 }, { wpx: 55 },
            { wpx: 41 }, { wpx: 55 }, { wpx: 97 }, { wpx: 114 },
            { wpx: 75 }, { wpx: 122 }, { wpx: 60 }, { wpx: 60 },
            { wpx: 60 }, { wpx: 60 }, { wpx: 60 }, { wpx: 108 },
            { wpx: 60 }, { wpx: 199 },
          ],
        },
        Sheet3: {
          '!ref': `A1:W${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Gaji Pokok' },
          E3: { t: 's', v: 'Tambahan Lain Tidak Kena Pajak' },
          F3: { t: 's', v: 'THR Prorate' },
          F4: { t: 's', v: 'Months' },
          G4: { t: 's', v: 'Amount' },
          H3: { t: 's', v: 'Cuti (Leave Right)' },
          H4: { t: 's', v: 'Days' },
          I4: { t: 's', v: 'Amount' },
          J3: { t: 's', v: 'Absen / Day Basic' },
          J4: { t: 's', v: 'Absen' },
          K4: { t: 's', v: 'Amount' },
          L3: { t: 's', v: 'Pemotongan Kelebihan Bayar Gaji & Koreksi Absen' },
          M3: { t: 's', v: 'Pemotongan Kelebihan Bayar OT' },
          N3: { t: 's', v: 'Pemotongan Prorate Absen' },
          O3: { t: 's', v: 'Total Pemotongan (Gaji, OT, Tunjangan)' },
          P3: { t: 's', v: 'Pemotongan' },
          Q3: { t: 's', v: 'Pemotongan Toolroom' },
          R3: { t: 's', v: 'Pemotongan Lain' },
          S3: { t: 's', v: 'Total Semua Pemotongan' },
          T3: { t: 's', v: 'Dana Pinjaman' },
          U3: { t: 's', v: 'Kantin' },
          V3: { t: 's', v: 'Kopkar dan BMI' },
          W3: { t: 's', v: 'Pph21 Kurang Bayar' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 22 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 22 } },
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
            { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
            { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },
            { s: { r: 2, c: 5 }, e: { r: 2, c: 6 } },
            { s: { r: 2, c: 7 }, e: { r: 2, c: 8 } },
            { s: { r: 2, c: 9 }, e: { r: 2, c: 10 } },
            { s: { r: 2, c: 11 }, e: { r: 3, c: 11 } },
            { s: { r: 2, c: 12 }, e: { r: 3, c: 12 } },
            { s: { r: 2, c: 13 }, e: { r: 3, c: 13 } },
            { s: { r: 2, c: 14 }, e: { r: 3, c: 14 } },
            { s: { r: 2, c: 15 }, e: { r: 3, c: 15 } },
            { s: { r: 2, c: 16 }, e: { r: 3, c: 16 } },
            { s: { r: 2, c: 17 }, e: { r: 3, c: 17 } },
            { s: { r: 2, c: 18 }, e: { r: 3, c: 18 } },
            { s: { r: 2, c: 19 }, e: { r: 3, c: 19 } },
            { s: { r: 2, c: 20 }, e: { r: 3, c: 20 } },
            { s: { r: 2, c: 21 }, e: { r: 3, c: 21 } },
            { s: { r: 2, c: 22 }, e: { r: 3, c: 22 } },
          ],
          '!cols': [
            { wpx: 26 }, { wpx: 72 }, { wpx: 234 }, { wpx: 83 },
            { wpx: 164 }, { wpx: 42 }, { wpx: 60 }, { wpx: 32 },
            { wpx: 60 }, { wpx: 42 }, { wpx: 60 }, { wpx: 245 },
            { wpx: 162 }, { wpx: 135 }, { wpx: 191 }, { wpx: 67 },
            { wpx: 113 }, { wpx: 90 }, { wpx: 127 }, { wpx: 80 },
            { wpx: 55 }, { wpx: 82 }, { wpx: 104 },
          ],
        },
        Sheet4: {
          '!ref': `A1:P${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Hired Date' },
          E3: { t: 's', v: 'Hari Kerja' },
          F3: { t: 's', v: 'Resign / Finish Date' },
          G3: { t: 's', v: 'Jenis Kelamin' },
          H3: { t: 's', v: 'Status NPWP' },
          I3: { t: 's', v: 'No NPWP' },
          J3: { t: 's', v: 'Status Tanggungan' },
          K3: { t: 's', v: 'Bank' },
          L3: { t: 's', v: 'No Rekening' },
          M3: { t: 's', v: 'Email' },
          N3: { t: 's', v: 'Birthday' },
          O3: { t: 's', v: 'Periode Pajak' },
          P3: { t: 's', v: 'Total Bulan' },
          '!cols': [
            { wpx: 26 }, { wpx: 72 }, { wpx: 234 }, { wpx: 62 },
            { wpx: 54 }, { wpx: 101 }, { wpx: 74 }, { wpx: 72 },
            { wpx: 113 }, { wpx: 98 }, { wpx: 52 }, { wpx: 95 },
            { wpx: 205 }, { wpx: 62 }, { wpx: 73 }, { wpx: 60 },
          ],
        },
      },
    };

    let row = 4;
    for (let i = 0; i < e.length; i += 1) {
      row += 1;
      wb.Sheets.Sheet1[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet1[`B${row}`] = { t: 's', v: e[i].e0 };
      wb.Sheets.Sheet1[`C${row}`] = { t: 's', v: e[i].d0 };
      wb.Sheets.Sheet1[`D${row}`] = { t: 'n', v: e[i].g0, z: '#,##0' };
      wb.Sheets.Sheet1[`E${row}`] = { t: 'n', v: e[i].aj0, z: '#,##0' };
      wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: e[i].ak0, z: '#,##0' };
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: e[i].al0, z: '#,##0' };
      wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: e[i].am0, z: '#,##0' };
      wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: e[i].an0, z: '#,##0' };
      wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: e[i].ao0, z: '#,##0' };
      wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: e[i].ap0, z: '#,##0' };
      wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: e[i].aq0, z: '#,##0' };
      wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: e[i].ar0, z: '#,##0' };
      wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: e[i].as0, z: '#,##0' };
      wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: e[i].at0, z: '#,##0' };
      wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: e[i].au0, z: '#,##0' };
      wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: e[i].av0, z: '#,##0' };
      wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: e[i].aw0, z: '#,##0' };
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: e[i].ax0, z: '#,##0' };
      wb.Sheets.Sheet1[`T${row}`] = { t: 'n', v: e[i].ba0, z: '#,##0' };
      wb.Sheets.Sheet1[`U${row}`] = { t: 'n', v: e[i].bb0, z: '#,##0' };
      wb.Sheets.Sheet1[`V${row}`] = { t: 'n', v: e[i].bc0, z: '#,##0' };
      wb.Sheets.Sheet1[`W${row}`] = { t: 'n', v: e[i].bd0, z: '#,##0' };
      wb.Sheets.Sheet1[`X${row}`] = { t: 'n', v: e[i].be0, z: '#,##0' };
      wb.Sheets.Sheet1[`Y${row}`] = { t: 'n', v: e[i].bf0, z: '#,##0' };
      wb.Sheets.Sheet1[`Z${row}`] = { t: 'n', v: e[i].bg0, z: '#,##0' };
      wb.Sheets.Sheet1[`AA${row}`] = { t: 'n', v: e[i].bh0, z: '#,##0' };
      wb.Sheets.Sheet1[`AB${row}`] = { t: 'n', v: e[i].bi0, z: '#,##0' };
      wb.Sheets.Sheet1[`AC${row}`] = { t: 'n', v: e[i].bj0, z: '#,##0' };
      wb.Sheets.Sheet1[`AD${row}`] = { t: 'n', v: e[i].ax0 + e[i].bj0, z: '#,##0' };

      wb.Sheets.Sheet2[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet2[`B${row}`] = { t: 's', v: e[i].e0 };
      wb.Sheets.Sheet2[`C${row}`] = { t: 's', v: e[i].d0 };
      wb.Sheets.Sheet2[`D${row}`] = { t: 'n', v: e[i].g0, z: '#,##0' };
      wb.Sheets.Sheet2[`E${row}`] = { t: 'n', v: e[i].ab0, z: '0.00' };
      wb.Sheets.Sheet2[`F${row}`] = { t: 'n', v: e[i].ac0, z: '#,##0' };
      wb.Sheets.Sheet2[`G${row}`] = { t: 'n', v: e[i].ad0, z: '0.00' };
      wb.Sheets.Sheet2[`H${row}`] = { t: 'n', v: e[i].ae0, z: '#,##0' };
      wb.Sheets.Sheet2[`I${row}`] = { t: 'n', v: e[i].af0, z: '0.00' };
      wb.Sheets.Sheet2[`J${row}`] = { t: 'n', v: e[i].ag0, z: '#,##0' };
      wb.Sheets.Sheet2[`K${row}`] = { t: 'n', v: e[i].ah0, z: '#,##0' };
      wb.Sheets.Sheet2[`L${row}`] = { t: 'n', v: e[i].ai0, z: '#,##0' };
      wb.Sheets.Sheet2[`M${row}`] = { t: 'n', v: e[i].bl0, z: '#,##0' };
      wb.Sheets.Sheet2[`N${row}`] = { t: 'n', v: e[i].bm0, z: '#,##0' };
      wb.Sheets.Sheet2[`O${row}`] = { t: 'n', v: e[i].bn0, z: '#,##0' };
      wb.Sheets.Sheet2[`P${row}`] = { t: 'n', v: e[i].bo0, z: '#,##0' };
      wb.Sheets.Sheet2[`Q${row}`] = { t: 'n', v: e[i].bp0, z: '#,##0' };
      wb.Sheets.Sheet2[`R${row}`] = { t: 'n', v: e[i].bq0, z: '#,##0' };
      wb.Sheets.Sheet2[`S${row}`] = { t: 'n', v: e[i].br0, z: '#,##0' };
      wb.Sheets.Sheet2[`T${row}`] = { t: 'n', v: e[i].bs0, z: '#,##0' };
      wb.Sheets.Sheet2[`U${row}`] = { t: 'n', v: e[i].bt0, z: '#,##0' };
      wb.Sheets.Sheet2[`V${row}`] = { t: 'n', v: e[i].bu0, z: '#,##0' };

      wb.Sheets.Sheet3[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet3[`B${row}`] = { t: 's', v: e[i].e0 };
      wb.Sheets.Sheet3[`C${row}`] = { t: 's', v: e[i].d0 };
      wb.Sheets.Sheet3[`D${row}`] = { t: 'n', v: e[i].g0, z: '#,##0' };
      wb.Sheets.Sheet3[`E${row}`] = { t: 'n', v: e[i].bv0, z: '#,##0' };
      wb.Sheets.Sheet3[`F${row}`] = { t: 'n', v: e[i].bw0, z: '#,##0' };
      wb.Sheets.Sheet3[`G${row}`] = { t: 'n', v: e[i].bx0, z: '#,##0' };
      wb.Sheets.Sheet3[`H${row}`] = { t: 'n', v: e[i].by0, z: '#,##0' };
      wb.Sheets.Sheet3[`I${row}`] = { t: 'n', v: e[i].bz0, z: '#,##0' };
      wb.Sheets.Sheet3[`J${row}`] = { t: 'n', v: e[i].cw0, z: '0.00' };
      wb.Sheets.Sheet3[`K${row}`] = { t: 'n', v: e[i].cx0, z: '#,##0' };
      wb.Sheets.Sheet3[`L${row}`] = { t: 'n', v: e[i].dc0, z: '#,##0' };
      wb.Sheets.Sheet3[`M${row}`] = { t: 'n', v: e[i].dd0, z: '#,##0' };
      wb.Sheets.Sheet3[`N${row}`] = { t: 'n', v: e[i].de0, z: '#,##0' };
      wb.Sheets.Sheet3[`O${row}`] = { t: 'n', v: e[i].df0, z: '#,##0' };
      wb.Sheets.Sheet3[`P${row}`] = { t: 'n', v: e[i].de0, z: '#,##0' };
      wb.Sheets.Sheet3[`Q${row}`] = { t: 'n', v: e[i].dh0, z: '#,##0' };
      wb.Sheets.Sheet3[`R${row}`] = { t: 'n', v: e[i].di0, z: '#,##0' };
      wb.Sheets.Sheet3[`S${row}`] = { t: 'n', v: e[i].dj0, z: '#,##0' };
      wb.Sheets.Sheet3[`T${row}`] = { t: 'n', v: e[i].dk0, z: '#,##0' };
      wb.Sheets.Sheet3[`U${row}`] = { t: 'n', v: e[i].dl0, z: '#,##0' };
      wb.Sheets.Sheet3[`V${row}`] = { t: 'n', v: e[i].dm0, z: '#,##0' };
      wb.Sheets.Sheet3[`W${row}`] = { t: 'n', v: e[i].dn0, z: '#,##0' };

      wb.Sheets.Sheet4[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet4[`B${row}`] = { t: 's', v: e[i].e0 };
      wb.Sheets.Sheet4[`C${row}`] = { t: 's', v: e[i].d0 };
      wb.Sheets.Sheet4[`D${row}`] = { t: 's', v: e[i].i0 ? gDateFormat(e[i].i0, 'dd-MM-yyyy') : '' };
      wb.Sheets.Sheet4[`E${row}`] = { t: 'n', v: e[i].j0 };
      wb.Sheets.Sheet4[`F${row}`] = { t: 's', v: e[i].k0 ? gDateFormat(e[i].k0, 'dd-MM-yyyy') : '' };
      wb.Sheets.Sheet4[`G${row}`] = { t: 's', v: e[i].n0 };
      wb.Sheets.Sheet4[`H${row}`] = { t: 's', v: e[i].p0 };
      wb.Sheets.Sheet4[`I${row}`] = { t: 's', v: e[i].q0 };
      wb.Sheets.Sheet4[`J${row}`] = { t: 's', v: e[i].r0 };
      wb.Sheets.Sheet4[`K${row}`] = { t: 's', v: e[i].s0 };
      wb.Sheets.Sheet4[`L${row}`] = { t: 's', v: e[i].t0 };
      wb.Sheets.Sheet4[`M${row}`] = { t: 's', v: e[i].ew0 };
      wb.Sheets.Sheet4[`N${row}`] = { t: 's', v: e[i].o0 ? gDateFormat(e[i].o0, 'dd-MM-yyyy') : '' };
      wb.Sheets.Sheet4[`O${row}`] = { t: 's', v: e[i].dz0 };
      wb.Sheets.Sheet4[`P${row}`] = { t: 'n', v: e[i].ea0 };
    }

    row += 1;
    wb.Sheets.Sheet1[`D${row}`] = { t: 'n', v: p.g0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`E${row}`] = { t: 'n', v: p.aj0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: p.ak0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: p.al0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: p.am0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: p.an0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: p.ao0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: p.ap0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: p.aq0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: p.ar0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: p.as0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: p.at0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: p.au0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: p.av0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: p.aw0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.ax0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`T${row}`] = { t: 'n', v: p.ba0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`U${row}`] = { t: 'n', v: p.bb0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`V${row}`] = { t: 'n', v: p.bc0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`W${row}`] = { t: 'n', v: p.bd0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`X${row}`] = { t: 'n', v: p.be0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`Y${row}`] = { t: 'n', v: p.bf0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`Z${row}`] = { t: 'n', v: p.bg0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AA${row}`] = { t: 'n', v: p.bh0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AB${row}`] = { t: 'n', v: p.bi0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AC${row}`] = { t: 'n', v: p.bj0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AD${row}`] = { t: 'n', v: p.ax0Sum + p.bj0Sum, z: '#,##0' };

    wb.Sheets.Sheet2[`D${row}`] = { t: 'n', v: p.g0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`E${row}`] = { t: 'n', v: p.ab0Sum, z: '0.00' };
    wb.Sheets.Sheet2[`F${row}`] = { t: 'n', v: p.ac0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`G${row}`] = { t: 'n', v: p.ad0Sum, z: '0.00' };
    wb.Sheets.Sheet2[`H${row}`] = { t: 'n', v: p.ae0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`I${row}`] = { t: 'n', v: p.af0Sum, z: '0.00' };
    wb.Sheets.Sheet2[`J${row}`] = { t: 'n', v: p.ag0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`K${row}`] = { t: 'n', v: p.ah0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`L${row}`] = { t: 'n', v: p.ai0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`M${row}`] = { t: 'n', v: p.bl0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`N${row}`] = { t: 'n', v: p.bm0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`O${row}`] = { t: 'n', v: p.bn0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`P${row}`] = { t: 'n', v: p.bo0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`Q${row}`] = { t: 'n', v: p.bp0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`R${row}`] = { t: 'n', v: p.bq0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`S${row}`] = { t: 'n', v: p.br0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`T${row}`] = { t: 'n', v: p.bs0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`U${row}`] = { t: 'n', v: p.bt0Sum, z: '#,##0' };
    wb.Sheets.Sheet2[`V${row}`] = { t: 'n', v: p.bu0Sum, z: '#,##0' };

    wb.Sheets.Sheet3[`D${row}`] = { t: 'n', v: p.g0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`E${row}`] = { t: 'n', v: p.bv0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`F${row}`] = { t: 'n', v: p.bw0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`G${row}`] = { t: 'n', v: p.bx0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`H${row}`] = { t: 'n', v: p.by0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`I${row}`] = { t: 'n', v: p.bz0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`J${row}`] = { t: 'n', v: p.cw0Sum };
    wb.Sheets.Sheet3[`K${row}`] = { t: 'n', v: p.cx0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`L${row}`] = { t: 'n', v: p.dc0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`M${row}`] = { t: 'n', v: p.dd0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`N${row}`] = { t: 'n', v: p.de0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`O${row}`] = { t: 'n', v: p.df0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`P${row}`] = { t: 'n', v: p.de0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`Q${row}`] = { t: 'n', v: p.dh0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`R${row}`] = { t: 'n', v: p.di0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`S${row}`] = { t: 'n', v: p.dj0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`T${row}`] = { t: 'n', v: p.dk0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`U${row}`] = { t: 'n', v: p.dl0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`V${row}`] = { t: 'n', v: p.dm0Sum, z: '#,##0' };
    wb.Sheets.Sheet3[`W${row}`] = { t: 'n', v: p.dn0Sum, z: '#,##0' };

    const fn = `static/report/${p.dir}/${p.dir}_payroll.xlsx`;
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

const genAccCheck = async (p) => {
  try {
    const { employee } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const tbl1 = [
      [
        {
          text: 'No', bold: true, alignment: 'center',
        },
        {
          text: 'Nama Karyawan', bold: true, alignment: 'center',
        },
        {
          text: 'No. Karyawan', bold: true, alignment: 'center',
        },
        {
          text: 'Dana Pinjaman', bold: true, alignment: 'center',
        },
        {
          text: 'Kantin', bold: true, alignment: 'center',
        },
        {
          text: 'Kopkar & BMI', bold: true, alignment: 'center',
        },
        {
          text: 'Pemotongan', bold: true, alignment: 'center',
        },
        {
          text: 'Tambahan Lain Tidak Kena Pajak', bold: true, alignment: 'center',
        },
      ],
    ];

    employee.map((e, i) => {
      tbl1.push([
        { text: (i + 1), alignment: 'center' }, e.d0, { text: e.e0, alignment: 'center' },
        { text: intpre0(e.dk0).format(), alignment: 'right' },
        { text: intpre0(e.dl0).format(), alignment: 'right' },
        { text: intpre0(e.dm0).format(), alignment: 'right' },
        { text: intpre0(e.dg0).format(), alignment: 'right' },
        { text: intpre0(e.bv0).format(), alignment: 'right' },
      ]);

      return true;
    });

    tbl1.push([
      '', '', '',
      { text: intpre0(p.dk0sum).format(), alignment: 'right' },
      { text: intpre0(p.dl0sum).format(), alignment: 'right' },
      { text: intpre0(p.dm0sum).format(), alignment: 'right' },
      { text: intpre0(p.dg0sum).format(), alignment: 'right' },
      { text: intpre0(p.bv0sum).format(), alignment: 'right' },
    ]);

    const docDefinition = {
      content: [
        { text: 'PT. Labtech Penta International', bold: true, fontSize: 8 },
        {
          text: `Periode Payroll: ${p.period}`, bold: true, fontSize: 8, margin: [0, 0, 0, 20],
        },
        {
          style: 'tbl1',
          table: {
            widths: [
              15, 140, 40, 40, 40, 40,
              40, 40,
            ],
            body: tbl1,
          },
        },
      ],
      styles: {
        tbl1: {
          fontSize: 6,
          margin: [-10, -10, -10, 0],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/report/${p.dir}/${p.dir}_acc.pdf`));
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

const generateSlip = async (p, payPass) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/slip/${p.dir}`);

    const ctbl1 = [
      ['Basic Salary', '', '', { text: intpre0(e.l0).format(), alignment: 'right' }],
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
      ['-', e.dq0 ? e.dq0 : '', 'Approved by,', 'Received by,'],
      ['-', { text: 'If there is correction on the limit of complaint on the 15th of each month', rowSpan: 2 }, { text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true }, { text: e.d0, bold: true }],
      ['', '', e.fh0 ? e.fh0 : '', ''],
    ];

    if (e.m0) notes.push(['-', e.m0, '', '']);
    if (e.fd0) notes.push(['-', e.fd0, '', '']);

    let net = 0;
    if (e.e0 === 'X.0010') {
      net = intpre0(e.ed0).format();
    } else if (e.ex0) {
      net = intpre0(e.eb0).format();
    } else {
      net = intpre0(e.ec0).format();
    }

    const docDefinition = {
      userPassword: !payPass ? false : e.slip.pw,
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
              ['', 'NET PAYMENT', { text: net, alignment: 'right', margin: [0, 0, 5, 0] }],
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

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/slip/${p.dir}/${e.slip.name}.pdf`));
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

const genFinal = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/final/${p.dir}`);

    const vw1 = [
      [{ text: 'Name', colSpan: 5 }, '', '', '', '', ':', e.d0],
      [{ text: 'Emp No', colSpan: 5 }, '', '', '', '', ':', e.e0],
      [{ text: 'Date of Hire', colSpan: 5 }, '', '', '', '', ':', { text: gDateFormat(e.i0, 'dd MMMM yyyy') }],
      [{ text: 'Status', colSpan: 5 }, '', '', '', '', ':', e.h0],
      [{ text: 'Position', colSpan: 5 }, '', '', '', '', ':', e.y0],
      [{ text: 'Resign / Termination Date', colSpan: 5 }, '', '', '', '', ':', { text: gDateFormat(e.k0, 'dd MMMM yyyy') }],
      [{ text: 'Long Services', colSpan: 5 }, '', '', '', '', ':', dateDiff(e.i0, e.k0)],
      [{ text: 'Basic Salary Per Month', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.g0).format(), alignment: 'right' }],
      [{ text: 'Basic Salary Per Day', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.g0 / 21).format(), alignment: 'right' }],
      [{ text: 'Overtime' }, { text: '(Variable)', colSpan: 4 }, '', '', '', ':', { text: intpre0(e.g0 / 173).format(), alignment: 'right' }],
    ];

    if (e.aj0) vw1.push([{ text: 'Living Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.aj0r).format(), alignment: 'right' }]);
    if (e.ak0) vw1.push([{ text: 'Housing Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ak0r).format(), alignment: 'right' }]);
    if (e.al0) vw1.push([{ text: 'Functional Position Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.al0r).format(), alignment: 'right' }]);
    if (e.am0) vw1.push([{ text: 'Functional Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.am0r).format(), alignment: 'right' }]);
    if (e.an0) vw1.push([{ text: 'Coordinator Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.an0r).format(), alignment: 'right' }]);
    if (e.ao0) vw1.push([{ text: 'Transport Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ao0r).format(), alignment: 'right' }]);
    if (e.ap0) vw1.push([{ text: 'Communication Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ap0r).format(), alignment: 'right' }]);
    if (e.aq0) vw1.push([{ text: 'Expertise Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.aq0r).format(), alignment: 'right' }]);
    if (e.ar0) vw1.push([{ text: 'Honorarium Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ar0r).format(), alignment: 'right' }]);
    if (e.as0) vw1.push([{ text: 'Position Variable Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.as0r).format(), alignment: 'right' }]);
    if (e.at0) vw1.push([{ text: 'Functional Variable Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.at0r).format(), alignment: 'right' }]);
    if (e.au0) vw1.push([{ text: 'Acting/PLT Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.au0r).format(), alignment: 'right' }]);
    if (e.av0) vw1.push([{ text: 'Others Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.av0r).format(), alignment: 'right' }]);

    if (e.ba0) vw1.push([{ text: 'Functional Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ba0r).format(), alignment: 'right' }]);
    if (e.bb0) vw1.push([{ text: 'Shift Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bb0r).format(), alignment: 'right' }]);
    if (e.bc0) vw1.push([{ text: 'Tig Welding Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bc0r).format(), alignment: 'right' }]);
    if (e.bd0) vw1.push([{ text: 'Plasma Cutting Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bd0r).format(), alignment: 'right' }]);
    if (e.be0) vw1.push([{ text: 'LKS Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.be0r).format(), alignment: 'right' }]);
    if (e.bf0) vw1.push([{ text: 'Koperasi Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bf0r).format(), alignment: 'right' }]);
    if (e.bg0) vw1.push([{ text: 'Quality System Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bg0r).format(), alignment: 'right' }]);
    if (e.bh0) vw1.push([{ text: 'Penghargaan Masa Kerja Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bh0r).format(), alignment: 'right' }]);
    if (e.bi0) vw1.push([{ text: 'Others Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bi0r).format(), alignment: 'right' }]);

    const all1 = e.g0 + e.aj0r + e.ak0r + e.al0r + e.am0r + e.an0r + e.ao0r + e.ap0r + e.aq0r + e.ar0r + e.as0r
    + e.at0r + e.au0r + e.av0r + e.ba0r + e.bb0r + e.bc0r + e.bd0r + e.be0r + e.bf0r + e.bg0r + e.bh0r + e.bi0r;

    vw1.push([{ text: 'Salary All In', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(all1).format(), alignment: 'right' }]);

    const mt = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = getDate(e.k0);
    const m = getMonth(e.k0);
    let mm;
    if (d < 22) {
      mm = m === 0 ? 11 : m - 1;
    } else {
      mm = m;
    }
    const ms = `22 ${mt[mm]} s/d ${gDateFormat(e.k0, 'dd MMM yyyy')}`;

    let income = e.l0 + e.ac0 + e.bz0 + e.bx0 + e.bv0;
    const vw2 = [
      ['Basic of', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.l0).format(), alignment: 'right' }],
      ['Overtime', { text: ms, colSpan: 2 }, '', { text: e.ab0, alignment: 'right' }, 'Hours', ':', { text: intpre0(e.ac0).format(), alignment: 'right' }],
    ];

    if (e.ad0) vw2.push(['Dinas Luar', { text: ms, colSpan: 2 }, '', { text: e.ad0, alignment: 'right' }, 'Hours', ':', { text: intpre0(e.ae0).format(), alignment: 'right' }]); income += e.ae0;
    if (e.af0) vw2.push(['Insentif', { text: ms, colSpan: 2 }, '', { text: e.af0, alignment: 'right' }, 'Hours', ':', { text: intpre0(e.ah0).format(), alignment: 'right' }]); income += e.ah0;

    vw2.push([{ text: 'Leave Right', colSpan: 3 }, '', '', { text: e.by0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.bz0).format(), alignment: 'right' }]);

    let bw;
    if (e.bw0) {
      bw = e.bw0 === 12 ? '1 years 0 months' : `0 years ${e.bw0} months`;
    } else {
      bw = '';
    }
    vw2.push(['THR Prorate', { text: bw, colSpan: 2 }, '', `${e.bw0}/12`, '', ':', { text: intpre0(e.bx0).format(), alignment: 'right' }]);

    if (e.aj0) vw2.push(['Living Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.aj0).format(), alignment: 'right' }]); income += e.aj0;
    if (e.ak0) vw2.push(['Housing Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.ak0).format(), alignment: 'right' }]); income += e.ak0;
    if (e.al0) vw2.push(['Functional Position Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.al0).format(), alignment: 'right' }]); income += e.al0;
    if (e.am0) vw2.push(['Functional Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.am0).format(), alignment: 'right' }]); income += e.am0;
    if (e.an0) vw2.push(['Coordinator Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.an0).format(), alignment: 'right' }]); income += e.an0;
    if (e.ao0) vw2.push(['Transport Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.ao0).format(), alignment: 'right' }]); income += e.ao0;
    if (e.ap0) vw2.push(['Communication Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.ap0).format(), alignment: 'right' }]); income += e.ap0;
    if (e.aq0) vw2.push(['Expertise Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.aq0).format(), alignment: 'right' }]); income += e.aq0;
    if (e.ar0) vw2.push(['Honorarium Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.ar0).format(), alignment: 'right' }]); income += e.ar0;
    if (e.as0) vw2.push(['Position Variable Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.as0).format(), alignment: 'right' }]); income += e.as0;
    if (e.at0) vw2.push(['Functional Variable Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.at0).format(), alignment: 'right' }]); income += e.at0;
    if (e.au0) vw2.push(['Acting/PLT Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.au0).format(), alignment: 'right' }]); income += e.au0;
    if (e.av0) vw2.push(['Others Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.av0).format(), alignment: 'right' }]); income += e.av0;

    if (e.ba0) vw2.push(['Functional Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.ba0).format(), alignment: 'right' }]); income += e.ba0;
    if (e.bb0) vw2.push(['Shift Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.bb0).format(), alignment: 'right' }]); income += e.bb0;
    if (e.bc0) vw2.push(['Tig Welding Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.bc0).format(), alignment: 'right' }]); income += e.bc0;
    if (e.bd0) vw2.push(['Plasma Cutting Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.bd0).format(), alignment: 'right' }]); income += e.bd0;
    if (e.be0) vw2.push(['LKS Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.be0).format(), alignment: 'right' }]); income += e.be0;
    if (e.bf0) vw2.push(['Koperasi Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.bf0).format(), alignment: 'right' }]); income += e.bf0;
    if (e.bg0) vw2.push(['Quality System Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.bg0).format(), alignment: 'right' }]); income += e.bg0;
    if (e.bh0) vw2.push(['Penghargaan Masa Kerja Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.bh0).format(), alignment: 'right' }]); income += e.bh0;
    if (e.bi0) vw2.push(['Others Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.bi0).format(), alignment: 'right' }]); income += e.bi0;

    if (e.dt0) vw2.push([{ text: 'Uang Pisah', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.dt0).format(), alignment: 'right' }]); income += (e.dt0 / 21) * e.j0;
    vw2.push([{ text: 'Tambahan Lain Tidak Kena Pajak', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bv0).format(), alignment: 'right' }]);
    if (e.fe0) vw2.push(['Uang Pesangon', '', '', '', '', ':', { text: intpre0(e.fe0).format(), alignment: 'right' }]); income += e.fe0;
    vw2.push(['', '', '', {
      text: 'Total Income', colSpan: 2, alignment: 'right', bold: true,
    }, '', ':', { text: intpre0(income).format(), alignment: 'right', bold: true }]);

    const tax = e.cz0 ? e.cz0 : e.da0;
    const deduction = e.cx0 + e.dl0 + e.dm0 + e.dk0 + tax + e.ce0 + e.cj0 + e.cr0 + e.dh0 + e.dn0 + e.di0;
    const vw3 = [
      [{ text: 'Absensi', colSpan: 3 }, '', '', { text: floatpre4(e.cw0).format(), alignment: 'right' }, 'Days', ':', { text: intpre0(e.cx0).format(), alignment: 'right' }],
      ['Potongan Kupon', { text: e.dq0, colSpan: 2 }, '', { text: `${e.dl0 / 7000} Kupon`, alignment: 'right' }, '7000', ':', { text: intpre0(e.dl0).format(), alignment: 'right' }],
      [{ text: 'Koperasi Karyawan / Bank Muamalat Indonesia (BMI)', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.dm0).format(), alignment: 'right' }],
      [{ text: 'Dana Pinjaman', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.dk0).format(), alignment: 'right' }],
      [{ text: 'Pajak Pph21', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(tax).format(), alignment: 'right' }],
      [{ text: 'Iuran JHT Karyawan', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ce0).format(), alignment: 'right' }],
      [{ text: 'Iuran Pensiun Karyawan', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.cj0).format(), alignment: 'right' }],
      [{ text: 'Iuran Kesehatan Karyawan', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.cr0).format(), alignment: 'right' }],
      [{ text: 'Pemotongan Toolroom', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.dh0).format(), alignment: 'right' }],
      [{ text: 'Pemotongan Kurang Bayar Pph21', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.dn0).format(), alignment: 'right' }],
      [{ text: 'Pemotongan Lain', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.di0).format(), alignment: 'right' }],
      ['', '', '', {
        text: 'Total Deductions', colSpan: 2, alignment: 'right', bold: true,
      }, '', ':', { text: intpre0(deduction).format(), alignment: 'right', bold: true }],
      ['', '', '', {
        text: 'Grand Total', colSpan: 2, alignment: 'right', bold: true,
      }, '', ':', { text: intpre0(income - deduction).format(), alignment: 'right', bold: true }],
      [{ text: 'Be spelled out / Terbilang', colSpan: 7 }, '', '', '', '', '', ''],
      [{
        text: `${terbilang(intpre0v2(income - deduction).format())} Rupiah`, colSpan: 7, bold: true, italics: true,
      }, '', '', '', '', '', ''],
    ];

    const vw4 = [
      [{ text: `Batam, ${idDateFormat(e.fDate, 'dd MMMM yyyy')}`, colSpan: 5 }, '', '', '', ''],
      ['Prepared By,', 'Checked By,', 'Reviewed By,', 'Knowledge By,', 'Approved By,'],
      ['', '', '', '', ''],
      ['Ayu Fatimah', 'Ronal P. Siahaan', 'Hendra SP / Yutin Sudarni', 'Gusti Very Wealthy', 'Eko Hernanto'],
      [{ text: 'Personel', bold: true }, { text: 'Payroll Controller', bold: true }, { text: 'HR & GA Dept. / Finance Dept.', bold: true }, { text: 'Finance & HRGA Division', bold: true }, { text: 'Management PT. Labtech Penta International', bold: true }],
    ];

    const vw5 = [
      ['Name', '', '', ':', e.d0],
      ['Emp No', '', '', ':', e.e0],
      ['Date of Hire', '', '', ':', { text: gDateFormat(e.i0, 'dd MMMM yyyy') }],
      ['Status', '', '', ':', e.h0],
      ['Position', '', '', ':', e.y0],
      ['Resign / Termination Date', '', '', ':', { text: gDateFormat(e.k0, 'dd MMMM yyyy') }],
      [{ text: 'List Amount', bold: true, margin: [0, 30, 0, 0] }, '', '', '', ''],
      ['Bank Muammalat Indonesia (BMI)', ':', '', '', ''],
      ['Koperasi Perusahaan', ':', '', '', ''],
      [{ text: 'Total', bold: true, alignment: 'right' }, ':', '', '', ''],
      [{ text: `Batam, ${idDateFormat(e.fDate, 'dd MMMM yyyy')}`, margin: [0, 30, 0, 0] }, '', '', '', ''],
      ['Prepared By,', '', 'Checked By,', '', ''],
      [{ text: 'Zunaidi', margin: [0, 50, 0, 0] }, '', { text: 'David Riatmanto', margin: [0, 50, 0, 0] }, '', ''],
      ['Bendahara Koperasi', '', 'Ketua Koperasi', '', ''],
    ];

    const vw6 = [
      ['Name', '', '', ':', e.d0],
      ['Emp No', '', '', ':', e.e0],
      ['Date of Hire', '', '', ':', { text: gDateFormat(e.i0, 'dd MMMM yyyy') }],
      ['Status', '', '', ':', e.h0],
      ['Position', '', '', ':', e.y0],
      ['Resign / Termination Date', '', '', ':', { text: gDateFormat(e.k0, 'dd MMMM yyyy') }],
      [{ text: 'List Amount', bold: true, margin: [0, 30, 0, 0] }, '', '', '', ''],
      ['PT Labtech Penta International', ':', '', '', ''],
      [{ text: 'Total', bold: true, alignment: 'right' }, ':', '', '', ''],
      [{ text: `Batam, ${idDateFormat(e.fDate, 'dd MMMM yyyy')}`, margin: [0, 30, 0, 0] }, '', '', '', ''],
      ['Prepared By,', '', 'Checked By,', '', ''],
      [{ text: 'Temmy Saputri', margin: [0, 50, 0, 0] }, '', { text: 'Yutin Sudarni', margin: [0, 50, 0, 0] }, '', ''],
      ['Finance & Administration', '', 'Finance Manager', '', ''],
    ];

    const wd = [80, 40, 40, 40, 40, 10, 150];
    const docDefinition = {
      // userPassword: e.final.pw,
      content: [
        {
          style: 'tbl1',
          table: {
            widths: [177, 200, 135],
            body: [
              [{
                image: 'static/images/logo.png', width: 60, rowSpan: 2, border: [false, false, false, false],
              }, {
                text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true, fontSize: 8, border: [false, false, false, true],
              }, {
                text: 'FINAL PAYMENT', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
              }],
              ['', { text: 'Kawasan Industri Sekupang Kav. 34 Batam - Indonesia', border: [false, false, false, false] }, {
                text: e.m0, bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, false],
              }],
            ],
          },
        },
        {
          style: 'tbl2',
          table: {
            widths: wd,
            body: vw1,
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl1',
          table: {
            widths: [512],
            body: [[{ text: '', border: [false, false, false, true] }]],
          },
        },
        {
          style: 'tbl2',
          table: {
            widths: wd,
            body: vw2,
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl2',
          table: {
            widths: wd,
            body: vw3,
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl2',
          table: {
            widths: [95, 95, 95, 95, 95],
            heights: [10, 10, 40, 10, 10],
            body: vw4,
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl1',
          table: {
            widths: [170, 160],
            body: [
              [{
                image: 'static/images/logo.png', width: 60, pageBreak: 'before',
              }, {
                text: 'AMOUNT DUE TO KOPERASI FORM', bold: true, pageBreak: 'before',
              }],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl2',
          table: {
            widths: [150, 5, 95, 5, 200],
            body: vw5,
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl1',
          table: {
            widths: [170, 160],
            body: [
              [{
                image: 'static/images/logo.png', width: 60, pageBreak: 'before',
              }, {
                text: 'AMOUNT DUE TO COMPANY FORM', bold: true, pageBreak: 'before',
              }],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl2',
          table: {
            widths: [150, 5, 95, 5, 200],
            body: vw6,
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
          margin: [10, 10, 0, 10],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/final/${p.dir}/${e.final.name}.pdf`));
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

const genPDFFinalQ = async (p) => {
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
          text: 'Bank No.', bold: true, alignment: 'center',
        },
        {
          text: 'Bank Name', bold: true, alignment: 'center',
        },
        {
          text: 'Take Home Pay', bold: true, alignment: 'center',
        },
        {
          text: 'THP for Bank', bold: true, alignment: 'center',
        },
      ],
    ];

    employee.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' }, { text: e.e0, alignment: 'center' },
        e.d0, e.t0, e.s0,
        { text: intpre0(e.ed0).format(), alignment: 'right' },
        { text: intpre0(e.ed0F).format(), alignment: 'right' },
      ]);

      return true;
    });

    vw1.push(['', '', '', '', '', { text: intpre0(p.sum1).format(), alignment: 'right' }, { text: intpre0(p.sum2).format(), alignment: 'right' }]);

    const vw2 = [
      [{ text: `Batam, ${idDateFormat(new Date(), 'dd-MM-yyyy')}`, colSpan: 5 }, '', '', '', ''],
      ['Prepared By,', 'Checked By,', 'Reviewed By,', 'Knowledge By,', 'Approved By,'],
      ['', '', '', '', ''],
      ['Ayu Fatimah / Hendra SP.', 'Yutin Sudarni / Ronal P. Siahaan', 'Ignatius Daud P. / Ratnawati', 'Gusti Very Wealthy', 'Eko Hernanto'],
      [{ text: 'Personnel / HR & GA Dept.', bold: true }, { text: 'Finance Dept. / Payroll Controller', bold: true }, { text: 'IT Dept.', bold: true }, { text: 'Finance & HRGA Division', bold: true }, { text: 'Management PT. Labtech Penta International', bold: true }],
    ];

    const docDefinition = {
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
                text: 'FINAL PAYMENT', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
              [{
                text: `Final Payment - Periode Payroll ${p.period} ${p.year}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl1',
          table: {
            widths: [15, 40, 160, 70, 40, 60, 60],
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
      pdfDoc.pipe(fs.createWriteStream(`static/report/${p.dir}/${p.dir}_final.pdf`));
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

const genXLSFinalQ = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const len = e.length + 4;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:G${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `FINAL PAYMENT - PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Bank No.' },
          E3: { t: 's', v: 'Bank Name' },
          F3: { t: 's', v: 'Take Home Pay' },
          G3: { t: 's', v: 'THP for Bank' },
          '!cols': [
            { wpx: 26 }, { wpx: 72 }, { wpx: 234 }, { wpx: 95 },
            { wpx: 63 }, { wpx: 81 }, { wpx: 75 },
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
      wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: t.t0 };
      wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: t.s0 };
      wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: t.ed0, z: '#,##0' };
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: t.ed0F, z: '#,##0' };

      return true;
    });

    row += 1;
    wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: p.sum1, z: '#,##0' };
    wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: p.sum2, z: '#,##0' };

    const fn = `static/report/${p.dir}/${p.dir}_final.xlsx`;
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

const genPDFSpAllowQ = async (p) => {
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
          text: 'Department', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Tj. Tetap Fungsional', bold: true, alignment: 'center', colSpan: 3,
        }, '', '',
        {
          text: 'Tj. Tetap Fungsional Variable', bold: true, alignment: 'center', colSpan: 3,
        }, '', '',
        {
          text: 'Tj. Tetap Posisi Fix', bold: true, alignment: 'center', colSpan: 3,
        }, '', '',
        {
          text: 'Tj. Tetap Posisi Variable', bold: true, alignment: 'center', colSpan: 3,
        }, '', '',
        {
          text: 'Tj. Tetap Acting / PLT', bold: true, alignment: 'center', colSpan: 3,
        }, '', '',
        {
          text: 'Keterangan', bold: true, alignment: 'center', rowSpan: 2,
        },
      ],
      [
        '', '', '', '',
        {
          text: 'Full', bold: true, alignment: 'center',
        },
        {
          text: '%', bold: true, alignment: 'center',
        },
        {
          text: 'Actual', bold: true, alignment: 'center',
        },
        {
          text: 'Full', bold: true, alignment: 'center',
        },
        {
          text: '%', bold: true, alignment: 'center',
        },
        {
          text: 'Actual', bold: true, alignment: 'center',
        },
        {
          text: 'Full', bold: true, alignment: 'center',
        },
        {
          text: '%', bold: true, alignment: 'center',
        },
        {
          text: 'Actual', bold: true, alignment: 'center',
        },
        {
          text: 'Full', bold: true, alignment: 'center',
        },
        {
          text: '%', bold: true, alignment: 'center',
        },
        {
          text: 'Actual', bold: true, alignment: 'center',
        },
        {
          text: 'Full', bold: true, alignment: 'center',
        },
        {
          text: '%', bold: true, alignment: 'center',
        },
        {
          text: 'Actual', bold: true, alignment: 'center',
        },
        '',
      ],
    ];

    employee.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' }, { text: e.e0, alignment: 'center' },
        e.d0, e.u0,
        { text: intpre0(e.am0).format(), alignment: 'right' },
        { text: floatpre2(e.am0p).format(), alignment: 'right' },
        { text: intpre0(e.am0r).format(), alignment: 'right' },
        { text: intpre0(e.at0).format(), alignment: 'right' },
        { text: floatpre2(e.at0p).format(), alignment: 'right' },
        { text: intpre0(e.at0r).format(), alignment: 'right' },
        { text: intpre0(e.al0).format(), alignment: 'right' },
        { text: floatpre2(e.al0p).format(), alignment: 'right' },
        { text: intpre0(e.al0r).format(), alignment: 'right' },
        { text: intpre0(e.as0).format(), alignment: 'right' },
        { text: floatpre2(e.as0p).format(), alignment: 'right' },
        { text: intpre0(e.as0r).format(), alignment: 'right' },
        { text: intpre0(e.au0).format(), alignment: 'right' },
        { text: floatpre2(e.au0p).format(), alignment: 'right' },
        { text: intpre0(e.au0r).format(), alignment: 'right' },
        e.spAllowRem ? e.spAllowRem : '',
      ]);

      return true;
    });

    vw1.push([
      '', '', '', '',
      { text: intpre0(p.am0rSum).format(), alignment: 'right' },
      '',
      { text: intpre0(p.am0Sum).format(), alignment: 'right' },
      { text: intpre0(p.at0rSum).format(), alignment: 'right' },
      '',
      { text: intpre0(p.at0Sum).format(), alignment: 'right' },
      { text: intpre0(p.al0rSum).format(), alignment: 'right' },
      '',
      { text: intpre0(p.al0Sum).format(), alignment: 'right' },
      { text: intpre0(p.as0rSum).format(), alignment: 'right' },
      '',
      { text: intpre0(p.as0Sum).format(), alignment: 'right' },
      { text: intpre0(p.au0rSum).format(), alignment: 'right' },
      '',
      { text: intpre0(p.au0Sum).format(), alignment: 'right' },
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
                text: 'SPECIAL ALLOWANCE', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Special Allowance - Periode Payroll ${p.period} ${p.year}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [
              10, 25, 60, 60, 25, 25, 25,
              25, 25, 25, 25, 25, 25, 25,
              25, 25, 25, 25, 25, 60,
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
          fontSize: 4,
          margin: [-10, -10, -10, 0],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/report/${p.dir}/${p.dir}_sp_allow.pdf`));
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

const genPDFThrQ = async (p) => {
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
          text: 'Status', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Hired Date', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Hari Raya', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Long Service', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Thr Prorate', bold: true, alignment: 'center', colSpan: 2,
        }, '',
        {
          text: 'Basic Salary', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Tunjangan Tetap', bold: true, alignment: 'center', colSpan: 10,
        }, '', '', '', '', '', '', '', '', '',
        {
          text: 'Total Upah', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Thr Prorate', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Pajak Penghasilan Ber-NPWP', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Pajak Tambahan Non-NPWP', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Total Thr By Transfer', bold: true, alignment: 'center', rowSpan: 2,
        },
        {
          text: 'Total Thr By Cash', bold: true, alignment: 'center', rowSpan: 2,
        },
      ],
      [
        '', '', '', '', '', '', '',
        {
          text: 'Months', bold: true, alignment: 'center',
        },
        {
          text: 'Amount', bold: true, alignment: 'center',
        },
        '',
        {
          text: 'Living', bold: true, alignment: 'center',
        },
        {
          text: 'Perumahan', bold: true, alignment: 'center',
        },
        {
          text: 'Posisi Fix', bold: true, alignment: 'center',
        },
        {
          text: 'Fungsional Fix', bold: true, alignment: 'center',
        },
        {
          text: 'Transport', bold: true, alignment: 'center',
        },
        {
          text: 'Komunikasi', bold: true, alignment: 'center',
        },
        {
          text: 'Expertisi', bold: true, alignment: 'center',
        },
        {
          text: 'Posisi Variable', bold: true, alignment: 'center',
        },
        {
          text: 'Fungsional Variable', bold: true, alignment: 'center',
        },
        {
          text: 'Acting / PLT', bold: true, alignment: 'center',
        },
        '', '', '', '', '', '',
      ],
    ];

    employee.map((e, i) => {
      vw1.push([
        { text: (i + 1), alignment: 'center' }, { text: e.e0, alignment: 'center' },
        e.d0, e.h0,
        { text: e.i0 ? gDateFormat(e.i0, 'yyyy-MM-dd') : null },
        { text: gDateFormat(p.tglHR, 'yyyy-MM-dd') },
        { text: e.i0 ? dateDiff(e.i0, p.tglHR) : null },
        { text: e.bw0, alignment: 'center' },
        { text: intpre0(e.bx0).format(), alignment: 'right' },
        { text: intpre0(e.g0).format(), alignment: 'right' },
        { text: intpre0(e.aj0).format(), alignment: 'right' },
        { text: intpre0(e.ak0).format(), alignment: 'right' },
        { text: intpre0(e.al0).format(), alignment: 'right' },
        { text: intpre0(e.am0).format(), alignment: 'right' },
        { text: intpre0(e.ao0).format(), alignment: 'right' },
        { text: intpre0(e.ap0).format(), alignment: 'right' },
        { text: intpre0(e.aq0).format(), alignment: 'right' },
        { text: intpre0(e.as0).format(), alignment: 'right' },
        { text: intpre0(e.at0).format(), alignment: 'right' },
        { text: intpre0(e.au0).format(), alignment: 'right' },
        { text: intpre0(e.ax0).format(), alignment: 'right' },
        { text: intpre0(e.bx0).format(), alignment: 'right' },
        { text: intpre0(e.cz0).format(), alignment: 'right' },
        { text: intpre0(e.da0).format(), alignment: 'right' },
        { text: intpre0(e.trfThr).format(), alignment: 'right' },
        { text: intpre0(e.cshThr).format(), alignment: 'right' },
      ]);

      return true;
    });

    vw1.push([
      '', '', '', '', '', '', '', '',
      { text: intpre0(p.bx0Sum).format(), alignment: 'right' },
      { text: intpre0(p.g0Sum).format(), alignment: 'right' },
      { text: intpre0(p.aj0Sum).format(), alignment: 'right' },
      { text: intpre0(p.ak0Sum).format(), alignment: 'right' },
      { text: intpre0(p.al0Sum).format(), alignment: 'right' },
      { text: intpre0(p.am0Sum).format(), alignment: 'right' },
      { text: intpre0(p.ao0Sum).format(), alignment: 'right' },
      { text: intpre0(p.ap0Sum).format(), alignment: 'right' },
      { text: intpre0(p.aq0Sum).format(), alignment: 'right' },
      { text: intpre0(p.as0Sum).format(), alignment: 'right' },
      { text: intpre0(p.at0Sum).format(), alignment: 'right' },
      { text: intpre0(p.au0Sum).format(), alignment: 'right' },
      { text: intpre0(p.ax0Sum).format(), alignment: 'right' },
      { text: intpre0(p.bx0Sum).format(), alignment: 'right' },
      { text: intpre0(p.cz0Sum).format(), alignment: 'right' },
      { text: intpre0(p.da0Sum).format(), alignment: 'right' },
      { text: intpre0(p.trfThrSum).format(), alignment: 'right' },
      { text: intpre0(p.cshThrSum).format(), alignment: 'right' },
    ]);

    const docDefinition = {
      pageSize: 'A3',
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
            widths: [170, 580, 200, 135],
            body: [
              [{
                image: 'static/images/logo.png', width: 60, rowSpan: 2, border: [false, false, false, false],
              }, { text: '', border: [false, false, false, false] }, {
                text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true, fontSize: 8, border: [false, false, false, true],
              }, {
                text: 'THR LIST', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
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
                text: `Thr List - Periode Payroll ${p.period} ${p.year}`, colSpan: 2, fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [
              15, 20, 50, 30, 35, 35, 50,
              25, 35, 35, 35, 35, 35, 35,
              35, 35, 35, 35, 35, 35, 35,
              35, 35, 35, 35, 35,
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
          fontSize: 5,
          margin: [-10, -10, -10, -30],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/report/${p.dir}/${p.dir}_thr_list.pdf`));
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
const genXLSThrQ = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const len = e.length + 5;
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:AG${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `Thr List - Periode Payroll: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Status' },
          E3: { t: 's', v: 'Hired Date' },
          F3: { t: 's', v: 'Hari Raya' },
          G3: { t: 's', v: 'Long Service' },
          H3: { t: 's', v: 'Birthday' },
          I3: { t: 's', v: 'Email' },
          J3: { t: 's', v: 'Bank Account' },
          K3: { t: 's', v: 'Department' },
          L3: { t: 's', v: 'Section' },
          M3: { t: 's', v: 'Position' },
          N3: { t: 's', v: 'NPWP' },
          O3: { t: 's', v: 'Thr Prorate' },
          O4: { t: 's', v: 'Months' },
          P4: { t: 's', v: 'Amount' },
          Q3: { t: 's', v: 'Basic Salary' },
          R3: { t: 's', v: 'Tunjangan Tetap' },
          R4: { t: 's', v: 'Living' },
          S4: { t: 's', v: 'Perumahan' },
          T4: { t: 's', v: 'Posisi Fix' },
          U4: { t: 's', v: 'Fungsional Fix' },
          V4: { t: 's', v: 'Transport' },
          W4: { t: 's', v: 'Komunikasi' },
          X4: { t: 's', v: 'Expertisi' },
          Y4: { t: 's', v: 'Posisi Variable' },
          Z4: { t: 's', v: 'Fungsional Variable' },
          AA4: { t: 's', v: 'Acting / PLT' },
          AB3: { t: 's', v: 'Total Upah' },
          AC3: { t: 's', v: 'Thr Prorate' },
          AD3: { t: 's', v: 'Pajak Penghasilan Ber-NPWP' },
          AE3: { t: 's', v: 'Pajak Tambahan Non-NPWP' },
          AF3: { t: 's', v: 'Total Thr By Transfer' },
          AG3: { t: 's', v: 'Total Thr By Cash' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 32 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 32 } },
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
            { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
            { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },
            { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } },
            { s: { r: 2, c: 6 }, e: { r: 3, c: 6 } },
            { s: { r: 2, c: 7 }, e: { r: 3, c: 7 } },
            { s: { r: 2, c: 8 }, e: { r: 3, c: 8 } },
            { s: { r: 2, c: 9 }, e: { r: 3, c: 9 } },
            { s: { r: 2, c: 10 }, e: { r: 3, c: 10 } },
            { s: { r: 2, c: 11 }, e: { r: 3, c: 11 } },
            { s: { r: 2, c: 12 }, e: { r: 3, c: 12 } },
            { s: { r: 2, c: 13 }, e: { r: 3, c: 13 } },
            { s: { r: 2, c: 14 }, e: { r: 2, c: 15 } },
            { s: { r: 2, c: 16 }, e: { r: 3, c: 16 } },
            { s: { r: 2, c: 17 }, e: { r: 2, c: 26 } },
            { s: { r: 2, c: 27 }, e: { r: 3, c: 27 } },
            { s: { r: 2, c: 28 }, e: { r: 3, c: 28 } },
            { s: { r: 2, c: 29 }, e: { r: 3, c: 29 } },
            { s: { r: 2, c: 30 }, e: { r: 3, c: 30 } },
            { s: { r: 2, c: 31 }, e: { r: 3, c: 31 } },
            { s: { r: 2, c: 32 }, e: { r: 3, c: 32 } },
          ],
          '!cols': [
            { wpx: 26 }, { wpx: 72 }, { wpx: 234 }, { wpx: 58 },
            { wpx: 62 }, { wpx: 62 }, { wpx: 137 }, { wpx: 62 },
            { wpx: 205 }, { wpx: 95 }, { wpx: 188 }, { wpx: 188 },
            { wpx: 112 }, { wpx: 111 }, { wpx: 42 }, { wpx: 75 },
            { wpx: 75 }, { wpx: 60 }, { wpx: 62 }, { wpx: 55 },
            { wpx: 77 }, { wpx: 60 }, { wpx: 63 }, { wpx: 55 },
            { wpx: 77 }, { wpx: 101 }, { wpx: 63 }, { wpx: 75 },
            { wpx: 75 }, { wpx: 148 }, { wpx: 142 }, { wpx: 103 },
            { wpx: 90 },
          ],
        },
      },
    };

    let row = 4;
    for (let i = 0; i < e.length; i += 1) {
      row += 1;
      wb.Sheets.Sheet1[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet1[`B${row}`] = { t: 's', v: e[i].e0 };
      wb.Sheets.Sheet1[`C${row}`] = { t: 's', v: e[i].d0 };
      wb.Sheets.Sheet1[`D${row}`] = { t: 's', v: e[i].h0 };
      wb.Sheets.Sheet1[`E${row}`] = { t: 's', v: e[i].i0 ? gDateFormat(e[i].i0, 'yyyy-MM-dd') : '' };
      wb.Sheets.Sheet1[`F${row}`] = { t: 's', v: gDateFormat(p.tglHR, 'yyyy-MM-dd') };
      wb.Sheets.Sheet1[`G${row}`] = { t: 's', v: e[i].i0 ? dateDiff(e[i].i0, p.tglHR) : '' };
      wb.Sheets.Sheet1[`H${row}`] = { t: 's', v: e[i].o0 ? gDateFormat(e[i].o0, 'yyyy-MM-dd') : '' };
      wb.Sheets.Sheet1[`I${row}`] = { t: 's', v: e[i].ew0 };
      wb.Sheets.Sheet1[`J${row}`] = { t: 's', v: e[i].t0 };
      wb.Sheets.Sheet1[`K${row}`] = { t: 's', v: e[i].u0 };
      wb.Sheets.Sheet1[`L${row}`] = { t: 's', v: e[i].v0 };
      wb.Sheets.Sheet1[`M${row}`] = { t: 's', v: e[i].y0 };
      wb.Sheets.Sheet1[`N${row}`] = { t: 's', v: e[i].q0 };
      wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: e[i].bw0 };
      wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: e[i].bx0, z: '#,##0' };
      wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: e[i].g0, z: '#,##0' };
      wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: e[i].aj0, z: '#,##0' };
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: e[i].ak0, z: '#,##0' };
      wb.Sheets.Sheet1[`T${row}`] = { t: 'n', v: e[i].al0, z: '#,##0' };
      wb.Sheets.Sheet1[`U${row}`] = { t: 'n', v: e[i].am0, z: '#,##0' };
      wb.Sheets.Sheet1[`V${row}`] = { t: 'n', v: e[i].ao0, z: '#,##0' };
      wb.Sheets.Sheet1[`W${row}`] = { t: 'n', v: e[i].ap0, z: '#,##0' };
      wb.Sheets.Sheet1[`X${row}`] = { t: 'n', v: e[i].aq0, z: '#,##0' };
      wb.Sheets.Sheet1[`Y${row}`] = { t: 'n', v: e[i].as0, z: '#,##0' };
      wb.Sheets.Sheet1[`Z${row}`] = { t: 'n', v: e[i].at0, z: '#,##0' };
      wb.Sheets.Sheet1[`AA${row}`] = { t: 'n', v: e[i].au0, z: '#,##0' };
      wb.Sheets.Sheet1[`AB${row}`] = { t: 'n', v: e[i].ax0, z: '#,##0' };
      wb.Sheets.Sheet1[`AC${row}`] = { t: 'n', v: e[i].bx0, z: '#,##0' };
      wb.Sheets.Sheet1[`AD${row}`] = { t: 'n', v: e[i].cz0, z: '#,##0' };
      wb.Sheets.Sheet1[`AE${row}`] = { t: 'n', v: e[i].da0, z: '#,##0' };
      wb.Sheets.Sheet1[`AF${row}`] = { t: 'n', v: e[i].trfThr, z: '#,##0' };
      wb.Sheets.Sheet1[`AG${row}`] = { t: 'n', v: e[i].cshThr, z: '#,##0' };
    }

    row += 1;
    wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: p.bx0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: p.g0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: p.aj0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: p.ak0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`T${row}`] = { t: 'n', v: p.al0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`U${row}`] = { t: 'n', v: p.am0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`V${row}`] = { t: 'n', v: p.ao0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`W${row}`] = { t: 'n', v: p.ap0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`X${row}`] = { t: 'n', v: p.aq0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`Y${row}`] = { t: 'n', v: p.as0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`Z${row}`] = { t: 'n', v: p.at0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AA${row}`] = { t: 'n', v: p.au0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AB${row}`] = { t: 'n', v: p.ax0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AC${row}`] = { t: 'n', v: p.bx0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AD${row}`] = { t: 'n', v: p.cz0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AE${row}`] = { t: 'n', v: p.da0Sum, z: '#,##0' };
    wb.Sheets.Sheet1[`AF${row}`] = { t: 'n', v: p.trfThrSum, z: '#,##0' };
    wb.Sheets.Sheet1[`AG${row}`] = { t: 'n', v: p.cshThrSum, z: '#,##0' };

    const fn = `static/report/${p.dir}/${p.dir}_thr_list.xlsx`;
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

const genThrSlipQ = async (p) => {
  try {
    const [e] = p.employee;
    await fs.ensureDir(`static/thrSlip/${p.dir}`);

    const ctbl1 = [
      [{ text: 'BASIC THR CALCULATION :', colSpan: 2 }, ''],
      ['Basic Salary', { text: intpre0(e.g0).format(), alignment: 'right' }],
      [{ text: 'FIXED ALLOWANCES :', colSpan: 2 }, ''],
    ];

    if (e.aj0) ctbl1.push(['Living Allowance', { text: intpre0(e.aj0).format(), alignment: 'right' }]);
    if (e.ak0) ctbl1.push(['Housing Allowance', { text: intpre0(e.ak0).format(), alignment: 'right' }]);
    if (e.al0) ctbl1.push(['Functional Position Allowance', { text: intpre0(e.al0).format(), alignment: 'right' }]);
    if (e.am0) ctbl1.push(['Functional Allowance', { text: intpre0(e.am0).format(), alignment: 'right' }]);
    if (e.an0) ctbl1.push(['Coordinator Allowance', { text: intpre0(e.an0).format(), alignment: 'right' }]);
    if (e.ao0) ctbl1.push(['Transport Allowance', { text: intpre0(e.ao0).format(), alignment: 'right' }]);
    if (e.ap0) ctbl1.push(['Communication Allowance', { text: intpre0(e.ap0).format(), alignment: 'right' }]);
    if (e.aq0) ctbl1.push(['Expertise Allowance', { text: intpre0(e.aq0).format(), alignment: 'right' }]);
    if (e.ar0) ctbl1.push(['Honorarium Allowance', { text: intpre0(e.ar0).format(), alignment: 'right' }]);
    if (e.as0) ctbl1.push(['Position Variable Allowance', { text: intpre0(e.as0).format(), alignment: 'right' }]);
    if (e.at0) ctbl1.push(['Functional Variable Allowance', { text: intpre0(e.at0).format(), alignment: 'right' }]);
    if (e.au0) ctbl1.push(['Acting/PLT Allowance', { text: intpre0(e.au0).format(), alignment: 'right' }]);
    if (e.av0) ctbl1.push(['Others Allowance', { text: intpre0(e.av0).format(), alignment: 'right' }]);

    ctbl1.push([{ text: 'TOTAL', alignment: 'right', bold: true }, { text: intpre0(e.ax0).format(), alignment: 'right', bold: true }]);

    const ctbl2 = [
      ['', '', ''],
      [{ text: 'THR Prorate :', colSpan: 3 }, '', ''],
      ['THR', `${e.bw0}/12`, { text: intpre0(e.ax0F).format(), alignment: 'right' }],
    ];

    if (e.p0 === 'Yes') {
      ctbl2.push(['Pajak Penghasilan Ber-NPWP', '', { text: intpre0(e.cz0).format(), alignment: 'right' }]);
    } else {
      ctbl2.push(['Pajak Tambahan Non-NPWP', '', { text: intpre0(e.da0).format(), alignment: 'right' }]);
    }

    ctbl2.push([{
      text: 'THR THIS MONTH', colSpan: 2, alignment: 'right', bold: true,
    }, '', { text: intpre0(e.trfThr).format(), alignment: 'right', bold: true }]);

    const notes = [
      ['', 'Note :', '', ''],
      ['', '', 'Approved by,', 'Received by,'],
      ['-', 'This is computer generated letter, no signature is required', { text: 'PT. LABTECH PENTA INTERNATIONAL', bold: true }, { text: e.d0, bold: true }],
    ];

    let tag = '';
    if (p.typeHR === 1) {
      tag = 'SELAMAT HARI RAYA IDUL FITRI';
    } else if (p.typeHR === 2) {
      tag = 'SELAMAT HARI NATAL & TAHUN BARU';
    }

    const docDefinition = {
      userPassword: e.thr.pw,
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
                text: 'SLIP THR', bold: true, fontSize: 8, alignment: 'right', border: [false, false, false, true],
              }],
              ['', { text: 'Kawasan Industri Sekupang Kav. 34 Batam - Indonesia', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }],
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
              ['Section', e.v0, '', ''],
              ['Position', e.y0, '', ''],
              [{
                text: tag, colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 15, 0, 10],
              }, '', '', ''],
            ],
          },
          layout: 'noBorders',
        },
        {
          style: 'tbl3',
          table: {
            widths: [530],
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
            widths: [530],
            heights: [12],
            body: [['']],
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

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/thrSlip/${p.dir}/${e.thr.name}.pdf`));
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

const sendThrSlip = async (p) => {
  try {
    const [e] = p.employee;

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
    html += '<div>Terlampir slip THR<div>';
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
    html += '<div>Attached is the slip THR</div>';
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
          filename: `${e.thr.name}.pdf`,
          path: `static/thrSlip/${p.dir}/${e.thr.name}.pdf`,
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

const genXLSMaster = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const len = e.length + 5;
    const wb = {
      SheetNames: ['Master'],
      Sheets: {
        Master: {
          '!ref': `A1:EB${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'No Karyawan' },
          C3: { t: 's', v: 'Nama Karyawan' },
          D3: { t: 's', v: 'Selisih GP dari Hari Kerja Normal' },
          E3: { t: 's', v: 'Gaji Pokok' },
          F3: { t: 's', v: 'Status Karyawan' },
          G3: { t: 's', v: 'Hired Date' },
          H3: { t: 's', v: 'Hari Kerja' },
          I3: { t: 's', v: 'Resign / Finish Contract Date' },
          J3: { t: 's', v: 'Gaji Berdasarkan Hari Kerja Normal' },
          K3: { t: 's', v: 'Note' },
          L3: { t: 's', v: 'Jenis Kelamin' },
          M3: { t: 's', v: 'Birthday' },
          N3: { t: 's', v: 'NPWP' },
          N4: { t: 's', v: 'Status NPWP' },
          O4: { t: 's', v: 'No NPWP' },
          P4: { t: 's', v: 'Status Tanggungan' },
          Q3: { t: 's', v: 'Bank' },
          Q4: { t: 's', v: 'Name' },
          R4: { t: 's', v: 'No Rekening' },
          S3: { t: 's', v: 'Department' },
          T3: { t: 's', v: 'Section' },
          U3: { t: 's', v: 'Section Code' },
          V3: { t: 's', v: 'Grade' },
          W3: { t: 's', v: 'Jabatan' },
          X3: { t: 's', v: 'JPK No. (Kartu Peserta Jamsostek)' },
          Y3: { t: 's', v: 'No. BPJS Kesehatan' },
          Z3: { t: 's', v: 'Lembur Normal' },
          Z4: { t: 's', v: 'Jam' },
          AA4: { t: 's', v: 'Amount' },
          AB3: { t: 's', v: 'Lembur Dinas Luar' },
          AB4: { t: 's', v: 'Jam' },
          AC4: { t: 's', v: 'Amount' },
          AD3: { t: 's', v: 'Insentif Lembur' },
          AD4: { t: 's', v: 'Jam' },
          AE4: { t: 's', v: 'Rate' },
          AF4: { t: 's', v: 'Amount' },
          AG3: { t: 's', v: 'Total Lembur & Insentif' },
          AH3: { t: 's', v: 'Tunjangan Tetap' },
          AH4: { t: 's', v: 'Tj. Tetap Living' },
          AI4: { t: 's', v: 'Tj. Tetap Perumahan' },
          AJ4: { t: 's', v: 'Tj. Tetap Posisi Fix' },
          AK4: { t: 's', v: 'Tj. Tetap Fungsional Fix' },
          AL4: { t: 's', v: 'Tj. Tetap Koordinator' },
          AM4: { t: 's', v: 'Tj. Tetap Transport' },
          AN4: { t: 's', v: 'Tj. Tetap Komunikasi' },
          AO4: { t: 's', v: 'Tj. Tetap Expertisi' },
          AP4: { t: 's', v: 'Tj. Tetap Honorarium' },
          AQ4: { t: 's', v: 'Tj. Tetap Posisi Variable' },
          AR4: { t: 's', v: 'Tj. Tetap Fungsional Variable' },
          AS4: { t: 's', v: 'Tj. Tetap Acting / PLT' },
          AT4: { t: 's', v: 'Tj. Tetap Others' },
          AU3: { t: 's', v: 'Total Tujangan Tetap' },
          AV3: { t: 's', v: 'Upah (Gaji Pokok + Tunjangan Tetap)' },
          AW3: { t: 's', v: 'Upah Normal' },
          AX3: { t: 's', v: 'Selisih Upah' },
          AY3: { t: 's', v: 'Tunjangan Tidak Tetap' },
          AY4: { t: 's', v: 'Tj. Tidak Tetap Fungsional' },
          AZ4: { t: 's', v: 'Tj. Tidak Tetap Shift' },
          BA4: { t: 's', v: 'Tj. Tidak Tetap Tig Welding' },
          BB4: { t: 's', v: 'Tj. Tidak Tetap Operator Plasma' },
          BC4: { t: 's', v: 'Tj. Tidak Tetap LKS' },
          BD4: { t: 's', v: 'Tj. Tidak Tetap Koperasi' },
          BE4: { t: 's', v: 'Tj. Tidak Tetap Quality System' },
          BF4: { t: 's', v: 'Tj. Tidak Tetap Penghargaan Masa Kerja' },
          BG4: { t: 's', v: 'Tj. Tidak Tetap Others' },
          BH3: { t: 's', v: 'Total Tunjangan Tidak Tetap' },
          BI3: { t: 's', v: 'Total Tunjangan Tetap & Tunjangan Tidak Tetap' },
          BJ3: { t: 's', v: 'Pembetulan Pembayaran' },
          BJ4: { t: 's', v: 'Koreksi Absen' },
          BK4: { t: 's', v: 'Koreksi Gaji & Hari Kerja' },
          BL4: { t: 's', v: 'Koreksi OT' },
          BM4: { t: 's', v: 'Tunjangan' },
          BN4: { t: 's', v: 'Insentif' },
          BO4: { t: 's', v: 'THR' },
          BP4: { t: 's', v: 'Allowance' },
          BQ4: { t: 's', v: 'Uang Makan Security' },
          BR4: { t: 's', v: 'Others' },
          BS3: { t: 's', v: 'Total Pembetulan Pembayaran' },
          BT3: { t: 's', v: 'Tambahan Lain Tidak Kena Pajak' },
          BU3: { t: 's', v: 'THR Prorate' },
          BU4: { t: 's', v: 'Months' },
          BV4: { t: 's', v: 'Amount' },
          BW3: { t: 's', v: 'Cuti (Leave)' },
          BW4: { t: 's', v: 'Months' },
          BX4: { t: 's', v: 'Amount' },
          BY3: { t: 's', v: 'Pendapatan Kotor' },
          BZ3: { t: 's', v: 'Ditanggung Perusahaan' },
          BZ4: { t: 's', v: 'JKK 0.54%' },
          CA4: { t: 's', v: 'JK 0.30%' },
          CB3: { t: 's', v: 'Iuran Jaminan Jari Tua / JHT' },
          CB4: { t: 's', v: 'Perusahaan 3.70%' },
          CC4: { t: 's', v: 'Karyawan 2.00%' },
          CD3: { t: 's', v: 'Total BPJS, JKK, JK, JHT Perusahaan & Karyawan' },
          CE3: { t: 's', v: 'Total Pensiun Perusahaan & JHT Perusahaan' },
          CF3: { t: 's', v: 'Standar Upah Pensiun' },
          CG3: { t: 's', v: 'Iuran Pensiun' },
          CG4: { t: 's', v: 'Perusahaan 2.00%' },
          CH4: { t: 's', v: 'Karyawan 1.00%' },
          CI3: { t: 's', v: 'Description (BPJS Ketenagakerjaan)' },
          CJ3: { t: 's', v: 'Total Iuran Pensiun & Kesehatan Perusahaan & Karyawan' },
          CK3: { t: 's', v: 'Total BPJS, JKK, JK, JHT, Pensiun Perusahaan & Karyawan' },
          CL3: { t: 's', v: 'Total JKK, JK, Medical Perusahaan' },
          CM3: { t: 's', v: 'Upah untuk Pelaporan BPJS Kesehatan' },
          CN3: { t: 's', v: 'Standar Gaji Iuran BPJS Kesehatan' },
          CO3: { t: 's', v: 'Iuran BPJS Kesehatan' },
          CO4: { t: 's', v: 'Perusahaan 4.00%' },
          CP4: { t: 's', v: 'Karyawan 1.00%' },
          CQ3: { t: 's', v: 'Kelas Rawat' },
          CR3: { t: 's', v: 'Description Medical' },
          CS3: { t: 's', v: 'Total Medical Perusahaan & Karyawan' },
          CT3: { t: 's', v: 'Total JKK, JK, JHT, Pensiun Perusahaan' },
          CU3: { t: 's', v: 'Absent / Day Basic' },
          CU4: { t: 's', v: 'Absent' },
          CV4: { t: 's', v: 'Amount' },
          CW3: { t: 's', v: 'Total Absen Aktual & Koreksi Absen' },
          CX3: { t: 's', v: 'Pajak Penghasilan Ber-NPWP' },
          CY3: { t: 's', v: 'Pajak Tambahan Non-NPWP' },
          CZ3: { t: 's', v: 'Total Pajak NPWP & Non-NPWP' },
          DA3: { t: 's', v: 'Pemotongan Kelebihan Bayar Gaji & Koreksi Absen' },
          DB3: { t: 's', v: 'Pemotongan Kelebihan Bayar OT' },
          DC3: { t: 's', v: 'Pemotongan Prorate Absen' },
          DD3: { t: 's', v: 'Total Pemotongan (Gaji, OT, Tunjangan)' },
          DE3: { t: 's', v: 'Pemotongan' },
          DF3: { t: 's', v: 'Pemotongan Toolroom' },
          DG3: { t: 's', v: 'Pemotongan Lain' },
          DH3: { t: 's', v: 'Total Semua Pemotongan' },
          DI3: { t: 's', v: 'Dana Pinjaman' },
          DJ3: { t: 's', v: 'Kantin' },
          DK3: { t: 's', v: 'Kopkar dan BMI' },
          DL3: { t: 's', v: 'Pph21 Kurang Bayar' },
          DM3: { t: 's', v: 'Jumlah Pemotongan' },
          DN3: { t: 's', v: 'Penghasilan' },
          DO3: { t: 's', v: 'Periode Potongan Kantin' },
          DP3: { t: 's', v: 'Bonus' },
          DQ3: { t: 's', v: 'Uang Pisah' },
          DQ4: { t: 's', v: 'Lama Kerja Prorate Tahun' },
          DR4: { t: 's', v: 'Amount' },
          DS3: { t: 's', v: 'Uang Pesangon' },
          DS4: { t: 's', v: 'Lama Kerja Prorate Tahun' },
          DT4: { t: 's', v: 'Amount' },
          DU3: { t: 's', v: 'Uang P. Masa Kerja' },
          DU4: { t: 's', v: 'Lama Kerja Prorate Tahun' },
          DV4: { t: 's', v: 'Amount' },
          DW3: { t: 's', v: 'Uang Penggantian Hak' },
          DW4: { t: 's', v: 'Pesangon + P. Masa kerja *15%' },
          DX3: { t: 's', v: 'Periode Pajak' },
          DX4: { t: 's', v: 'Bulan' },
          DY4: { t: 's', v: 'Total Bulan' },
          DZ3: { t: 's', v: 'Take Home Pay' },
          EA3: { t: 's', v: 'Total Transfer By Mandiri' },
          EB3: { t: 's', v: 'Total by Cash (For Expat & Final Payment)' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 27 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 27 } },
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },
            { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
            { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },
            { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } },
            { s: { r: 2, c: 6 }, e: { r: 3, c: 6 } },
            { s: { r: 2, c: 7 }, e: { r: 3, c: 7 } },
            { s: { r: 2, c: 8 }, e: { r: 3, c: 8 } },
            { s: { r: 2, c: 9 }, e: { r: 3, c: 9 } },
            { s: { r: 2, c: 10 }, e: { r: 3, c: 10 } },
            { s: { r: 2, c: 11 }, e: { r: 3, c: 11 } },
            { s: { r: 2, c: 12 }, e: { r: 3, c: 12 } },
            { s: { r: 2, c: 13 }, e: { r: 2, c: 15 } },
            { s: { r: 2, c: 16 }, e: { r: 2, c: 17 } },
            { s: { r: 2, c: 18 }, e: { r: 3, c: 18 } },
            { s: { r: 2, c: 19 }, e: { r: 3, c: 19 } },
            { s: { r: 2, c: 20 }, e: { r: 3, c: 20 } },
            { s: { r: 2, c: 21 }, e: { r: 3, c: 21 } },
            { s: { r: 2, c: 22 }, e: { r: 3, c: 22 } },
            { s: { r: 2, c: 23 }, e: { r: 3, c: 23 } },
            { s: { r: 2, c: 24 }, e: { r: 3, c: 24 } },
            { s: { r: 2, c: 25 }, e: { r: 2, c: 26 } },
            { s: { r: 2, c: 27 }, e: { r: 2, c: 28 } },
            { s: { r: 2, c: 29 }, e: { r: 2, c: 31 } },
            { s: { r: 2, c: 32 }, e: { r: 3, c: 32 } },
            { s: { r: 2, c: 33 }, e: { r: 2, c: 45 } },
            { s: { r: 2, c: 46 }, e: { r: 3, c: 46 } },
            { s: { r: 2, c: 47 }, e: { r: 3, c: 47 } },
            { s: { r: 2, c: 48 }, e: { r: 3, c: 48 } },
            { s: { r: 2, c: 49 }, e: { r: 3, c: 49 } },
            { s: { r: 2, c: 50 }, e: { r: 2, c: 58 } },
            { s: { r: 2, c: 59 }, e: { r: 3, c: 59 } },
            { s: { r: 2, c: 60 }, e: { r: 3, c: 60 } },
            { s: { r: 2, c: 61 }, e: { r: 2, c: 69 } },
            { s: { r: 2, c: 70 }, e: { r: 3, c: 70 } },
            { s: { r: 2, c: 71 }, e: { r: 3, c: 71 } },
            { s: { r: 2, c: 72 }, e: { r: 2, c: 73 } },
            { s: { r: 2, c: 74 }, e: { r: 2, c: 75 } },
            { s: { r: 2, c: 76 }, e: { r: 3, c: 76 } },
            { s: { r: 2, c: 77 }, e: { r: 2, c: 78 } },
            { s: { r: 2, c: 79 }, e: { r: 2, c: 80 } },
            { s: { r: 2, c: 81 }, e: { r: 3, c: 81 } },
            { s: { r: 2, c: 82 }, e: { r: 3, c: 82 } },
            { s: { r: 2, c: 83 }, e: { r: 3, c: 83 } },
            { s: { r: 2, c: 84 }, e: { r: 2, c: 85 } },
            { s: { r: 2, c: 86 }, e: { r: 3, c: 86 } },
            { s: { r: 2, c: 87 }, e: { r: 3, c: 87 } },
            { s: { r: 2, c: 88 }, e: { r: 3, c: 88 } },
            { s: { r: 2, c: 89 }, e: { r: 3, c: 89 } },
            { s: { r: 2, c: 90 }, e: { r: 3, c: 90 } },
            { s: { r: 2, c: 91 }, e: { r: 3, c: 91 } },
            { s: { r: 2, c: 92 }, e: { r: 2, c: 93 } },
            { s: { r: 2, c: 94 }, e: { r: 3, c: 94 } },
            { s: { r: 2, c: 95 }, e: { r: 3, c: 95 } },
            { s: { r: 2, c: 96 }, e: { r: 3, c: 96 } },
            { s: { r: 2, c: 97 }, e: { r: 3, c: 97 } },
            { s: { r: 2, c: 98 }, e: { r: 2, c: 99 } },
            { s: { r: 2, c: 100 }, e: { r: 3, c: 100 } },
            { s: { r: 2, c: 101 }, e: { r: 3, c: 101 } },
            { s: { r: 2, c: 102 }, e: { r: 3, c: 102 } },
            { s: { r: 2, c: 103 }, e: { r: 3, c: 103 } },
            { s: { r: 2, c: 104 }, e: { r: 3, c: 104 } },
            { s: { r: 2, c: 105 }, e: { r: 3, c: 105 } },
            { s: { r: 2, c: 106 }, e: { r: 3, c: 106 } },
            { s: { r: 2, c: 107 }, e: { r: 3, c: 107 } },
            { s: { r: 2, c: 108 }, e: { r: 3, c: 108 } },
            { s: { r: 2, c: 109 }, e: { r: 3, c: 109 } },
            { s: { r: 2, c: 110 }, e: { r: 3, c: 110 } },
            { s: { r: 2, c: 111 }, e: { r: 3, c: 111 } },
            { s: { r: 2, c: 112 }, e: { r: 3, c: 112 } },
            { s: { r: 2, c: 113 }, e: { r: 3, c: 113 } },
            { s: { r: 2, c: 114 }, e: { r: 3, c: 114 } },
            { s: { r: 2, c: 115 }, e: { r: 3, c: 115 } },
            { s: { r: 2, c: 116 }, e: { r: 3, c: 116 } },
            { s: { r: 2, c: 117 }, e: { r: 3, c: 117 } },
            { s: { r: 2, c: 118 }, e: { r: 3, c: 118 } },
            { s: { r: 2, c: 119 }, e: { r: 3, c: 119 } },
            { s: { r: 2, c: 120 }, e: { r: 2, c: 121 } },
            { s: { r: 2, c: 122 }, e: { r: 2, c: 123 } },
            { s: { r: 2, c: 124 }, e: { r: 2, c: 125 } },
            { s: { r: 2, c: 127 }, e: { r: 2, c: 128 } },
            { s: { r: 2, c: 129 }, e: { r: 3, c: 129 } },
            { s: { r: 2, c: 130 }, e: { r: 3, c: 130 } },
            { s: { r: 2, c: 131 }, e: { r: 3, c: 131 } },
          ],
          '!cols': [
            { wpx: 26 }, { wpx: 72 }, { wpx: 234 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 87 }, { wpx: 64 }, { wpx: 54 },
            { wpx: 64 }, { wpx: 85 }, { wpx: 107 }, { wpx: 74 },
            { wpx: 64 }, { wpx: 30 }, { wpx: 113 }, { wpx: 30 },
            { wpx: 52 }, { wpx: 96 }, { wpx: 188 }, { wpx: 188 },
            { wpx: 38 }, { wpx: 38 }, { wpx: 92 }, { wpx: 76 },
            { wpx: 86 }, { wpx: 47 }, { wpx: 85 }, { wpx: 47 },
            { wpx: 85 }, { wpx: 47 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 42 }, { wpx: 85 }, { wpx: 47 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 100 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 47 }, { wpx: 100 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 100 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
            { wpx: 85 }, { wpx: 85 }, { wpx: 85 }, { wpx: 65 },
            { wpx: 60 }, { wpx: 85 }, { wpx: 85 }, { wpx: 85 },
          ],
        },
      },
    };

    let row = 4;
    e.map((t, i) => {
      row += 1;
      wb.Sheets.Master[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Master[`B${row}`] = { t: 's', v: t.e0 };
      wb.Sheets.Master[`C${row}`] = { t: 's', v: t.d0 };
      wb.Sheets.Master[`D${row}`] = { t: 'n', v: t.f0, z: '#,##0' };
      wb.Sheets.Master[`E${row}`] = { t: 'n', v: t.g0, z: '#,##0' };
      wb.Sheets.Master[`F${row}`] = { t: 's', v: t.h0 };
      wb.Sheets.Master[`G${row}`] = { t: 's', v: t.i0 ? gDateFormat(t.i0, 'dd-MM-yyyy') : '' };
      wb.Sheets.Master[`H${row}`] = { t: 'n', v: t.j0 };
      wb.Sheets.Master[`I${row}`] = { t: 's', v: t.k0 ? gDateFormat(t.k0, 'dd-MM-yyyy') : '' };
      wb.Sheets.Master[`J${row}`] = { t: 'n', v: t.l0, z: '#,##0' };
      wb.Sheets.Master[`K${row}`] = { t: 's', v: t.m0 };
      wb.Sheets.Master[`L${row}`] = { t: 's', v: t.n0 };
      wb.Sheets.Master[`M${row}`] = { t: 's', v: t.o0 ? gDateFormat(t.o0, 'dd-MM-yyyy') : '' };
      wb.Sheets.Master[`N${row}`] = { t: 's', v: t.p0 };
      wb.Sheets.Master[`O${row}`] = { t: 's', v: t.q0 };
      wb.Sheets.Master[`P${row}`] = { t: 's', v: t.r0 };
      wb.Sheets.Master[`Q${row}`] = { t: 's', v: t.s0 };
      wb.Sheets.Master[`R${row}`] = { t: 's', v: t.t0 };
      wb.Sheets.Master[`S${row}`] = { t: 's', v: t.u0 };
      wb.Sheets.Master[`T${row}`] = { t: 's', v: t.v0 };
      wb.Sheets.Master[`U${row}`] = { t: 's', v: t.w0 };
      wb.Sheets.Master[`V${row}`] = { t: 's', v: t.x0 };
      wb.Sheets.Master[`W${row}`] = { t: 's', v: t.y0 };
      wb.Sheets.Master[`X${row}`] = { t: 's', v: t.z0 };
      wb.Sheets.Master[`Y${row}`] = { t: 's', v: t.aa0 };
      wb.Sheets.Master[`Z${row}`] = { t: 'n', v: t.ab0, z: '0.00' };
      wb.Sheets.Master[`AA${row}`] = { t: 'n', v: t.ac0, z: '#,##0' };
      wb.Sheets.Master[`AB${row}`] = { t: 'n', v: t.ad0, z: '0.00' };
      wb.Sheets.Master[`AC${row}`] = { t: 'n', v: t.ae0, z: '#,##0' };
      wb.Sheets.Master[`AD${row}`] = { t: 'n', v: t.af0, z: '0.00' };
      wb.Sheets.Master[`AE${row}`] = { t: 'n', v: t.ag0, z: '#,##0' };
      wb.Sheets.Master[`AF${row}`] = { t: 'n', v: t.ah0, z: '#,##0' };
      wb.Sheets.Master[`AG${row}`] = { t: 'n', v: t.ai0, z: '#,##0' };
      wb.Sheets.Master[`AH${row}`] = { t: 'n', v: t.aj0, z: '#,##0' };
      wb.Sheets.Master[`AI${row}`] = { t: 'n', v: t.ak0, z: '#,##0' };
      wb.Sheets.Master[`AJ${row}`] = { t: 'n', v: t.al0, z: '#,##0' };
      wb.Sheets.Master[`AK${row}`] = { t: 'n', v: t.am0, z: '#,##0' };
      wb.Sheets.Master[`AL${row}`] = { t: 'n', v: t.an0, z: '#,##0' };
      wb.Sheets.Master[`AM${row}`] = { t: 'n', v: t.ao0, z: '#,##0' };
      wb.Sheets.Master[`AN${row}`] = { t: 'n', v: t.ap0, z: '#,##0' };
      wb.Sheets.Master[`AO${row}`] = { t: 'n', v: t.aq0, z: '#,##0' };
      wb.Sheets.Master[`AP${row}`] = { t: 'n', v: t.ar0, z: '#,##0' };
      wb.Sheets.Master[`AQ${row}`] = { t: 'n', v: t.as0, z: '#,##0' };
      wb.Sheets.Master[`AR${row}`] = { t: 'n', v: t.at0, z: '#,##0' };
      wb.Sheets.Master[`AS${row}`] = { t: 'n', v: t.au0, z: '#,##0' };
      wb.Sheets.Master[`AT${row}`] = { t: 'n', v: t.av0, z: '#,##0' };
      wb.Sheets.Master[`AU${row}`] = { t: 'n', v: t.aw0, z: '#,##0' };
      wb.Sheets.Master[`AV${row}`] = { t: 'n', v: t.ax0, z: '#,##0' };
      wb.Sheets.Master[`AW${row}`] = { t: 'n', v: t.ay0, z: '#,##0' };
      wb.Sheets.Master[`AX${row}`] = { t: 'n', v: t.az0, z: '#,##0' };
      wb.Sheets.Master[`AY${row}`] = { t: 'n', v: t.ba0, z: '#,##0' };
      wb.Sheets.Master[`AZ${row}`] = { t: 'n', v: t.bb0, z: '#,##0' };
      wb.Sheets.Master[`BA${row}`] = { t: 'n', v: t.bc0, z: '#,##0' };
      wb.Sheets.Master[`BB${row}`] = { t: 'n', v: t.bd0, z: '#,##0' };
      wb.Sheets.Master[`BC${row}`] = { t: 'n', v: t.be0, z: '#,##0' };
      wb.Sheets.Master[`BD${row}`] = { t: 'n', v: t.bf0, z: '#,##0' };
      wb.Sheets.Master[`BE${row}`] = { t: 'n', v: t.bg0, z: '#,##0' };
      wb.Sheets.Master[`BF${row}`] = { t: 'n', v: t.bh0, z: '#,##0' };
      wb.Sheets.Master[`BG${row}`] = { t: 'n', v: t.bi0, z: '#,##0' };
      wb.Sheets.Master[`BH${row}`] = { t: 'n', v: t.bj0, z: '#,##0' };
      wb.Sheets.Master[`BI${row}`] = { t: 'n', v: t.bk0, z: '#,##0' };
      wb.Sheets.Master[`BJ${row}`] = { t: 'n', v: t.bl0, z: '#,##0' };
      wb.Sheets.Master[`BK${row}`] = { t: 'n', v: t.bm0, z: '#,##0' };
      wb.Sheets.Master[`BL${row}`] = { t: 'n', v: t.bn0, z: '#,##0' };
      wb.Sheets.Master[`BM${row}`] = { t: 'n', v: t.bo0, z: '#,##0' };
      wb.Sheets.Master[`BN${row}`] = { t: 'n', v: t.bp0, z: '#,##0' };
      wb.Sheets.Master[`BO${row}`] = { t: 'n', v: t.bq0, z: '#,##0' };
      wb.Sheets.Master[`BP${row}`] = { t: 'n', v: t.br0, z: '#,##0' };
      wb.Sheets.Master[`BQ${row}`] = { t: 'n', v: t.bs0, z: '#,##0' };
      wb.Sheets.Master[`BR${row}`] = { t: 'n', v: t.bt0, z: '#,##0' };
      wb.Sheets.Master[`BS${row}`] = { t: 'n', v: t.bu0, z: '#,##0' };
      wb.Sheets.Master[`BT${row}`] = { t: 'n', v: t.bv0, z: '#,##0' };
      wb.Sheets.Master[`BU${row}`] = { t: 'n', v: t.bw0 };
      wb.Sheets.Master[`BV${row}`] = { t: 'n', v: t.bx0, z: '#,##0' };
      wb.Sheets.Master[`BW${row}`] = { t: 'n', v: t.by0, z: '0.00' };
      wb.Sheets.Master[`BX${row}`] = { t: 'n', v: t.bz0, z: '#,##0' };
      wb.Sheets.Master[`BY${row}`] = { t: 'n', v: t.ca0, z: '#,##0' };
      wb.Sheets.Master[`BZ${row}`] = { t: 'n', v: t.cb0, z: '#,##0' };
      wb.Sheets.Master[`CA${row}`] = { t: 'n', v: t.cc0, z: '#,##0' };
      wb.Sheets.Master[`CB${row}`] = { t: 'n', v: t.cd0, z: '#,##0' };
      wb.Sheets.Master[`CC${row}`] = { t: 'n', v: t.ce0, z: '#,##0' };
      wb.Sheets.Master[`CD${row}`] = { t: 'n', v: t.cf0, z: '#,##0' };
      wb.Sheets.Master[`CE${row}`] = { t: 'n', v: t.cg0, z: '#,##0' };
      wb.Sheets.Master[`CF${row}`] = { t: 'n', v: t.ch0, z: '#,##0' };
      wb.Sheets.Master[`CG${row}`] = { t: 'n', v: t.ci0, z: '#,##0' };
      wb.Sheets.Master[`CH${row}`] = { t: 'n', v: t.cj0, z: '#,##0' };
      wb.Sheets.Master[`CI${row}`] = { t: 's', v: t.ck0 };
      wb.Sheets.Master[`CJ${row}`] = { t: 'n', v: t.cl0, z: '#,##0' };
      wb.Sheets.Master[`CK${row}`] = { t: 'n', v: t.cm0, z: '#,##0' };
      wb.Sheets.Master[`CL${row}`] = { t: 'n', v: t.cn0, z: '#,##0' };
      wb.Sheets.Master[`CM${row}`] = { t: 'n', v: t.co0, z: '#,##0' };
      wb.Sheets.Master[`CN${row}`] = { t: 'n', v: t.cp0, z: '#,##0' };
      wb.Sheets.Master[`CO${row}`] = { t: 'n', v: t.cq0, z: '#,##0' };
      wb.Sheets.Master[`CP${row}`] = { t: 'n', v: t.cr0, z: '#,##0' };
      wb.Sheets.Master[`CQ${row}`] = { t: 'n', v: t.cs0 };
      wb.Sheets.Master[`CR${row}`] = { t: 's', v: t.ct0 };
      wb.Sheets.Master[`CS${row}`] = { t: 'n', v: t.cu0, z: '#,##0' };
      wb.Sheets.Master[`CT${row}`] = { t: 'n', v: t.cv0, z: '#,##0' };
      wb.Sheets.Master[`CU${row}`] = { t: 'n', v: t.cw0, z: '0.0000' };
      wb.Sheets.Master[`CV${row}`] = { t: 'n', v: t.cx0, z: '#,##0' };
      wb.Sheets.Master[`CW${row}`] = { t: 'n', v: t.cy0, z: '#,##0' };
      wb.Sheets.Master[`CX${row}`] = { t: 'n', v: t.cz0, z: '#,##0' };
      wb.Sheets.Master[`CY${row}`] = { t: 'n', v: t.da0, z: '#,##0' };
      wb.Sheets.Master[`CZ${row}`] = { t: 'n', v: t.db0, z: '#,##0' };
      wb.Sheets.Master[`DA${row}`] = { t: 'n', v: t.dc0, z: '#,##0' };
      wb.Sheets.Master[`DB${row}`] = { t: 'n', v: t.dd0, z: '#,##0' };
      wb.Sheets.Master[`DC${row}`] = { t: 'n', v: t.de0, z: '#,##0' };
      wb.Sheets.Master[`DD${row}`] = { t: 'n', v: t.df0, z: '#,##0' };
      wb.Sheets.Master[`DE${row}`] = { t: 'n', v: t.dg0, z: '#,##0' };
      wb.Sheets.Master[`DF${row}`] = { t: 'n', v: t.dh0, z: '#,##0' };
      wb.Sheets.Master[`DG${row}`] = { t: 'n', v: t.di0, z: '#,##0' };
      wb.Sheets.Master[`DH${row}`] = { t: 'n', v: t.dj0, z: '#,##0' };
      wb.Sheets.Master[`DI${row}`] = { t: 'n', v: t.dk0, z: '#,##0' };
      wb.Sheets.Master[`DJ${row}`] = { t: 'n', v: t.dl0, z: '#,##0' };
      wb.Sheets.Master[`DK${row}`] = { t: 'n', v: t.dm0, z: '#,##0' };
      wb.Sheets.Master[`DL${row}`] = { t: 'n', v: t.dn0, z: '#,##0' };
      wb.Sheets.Master[`DM${row}`] = { t: 'n', v: t.do0, z: '#,##0' };
      wb.Sheets.Master[`DN${row}`] = { t: 'n', v: t.dp0, z: '#,##0' };
      wb.Sheets.Master[`DO${row}`] = { t: 's', v: t.dq0 };
      wb.Sheets.Master[`DP${row}`] = { t: 'n', v: t.dr0, z: '#,##0' };
      wb.Sheets.Master[`DQ${row}`] = { t: 'n', v: t.ds0, z: '#,##0' };
      wb.Sheets.Master[`DR${row}`] = { t: 'n', v: t.dt0, z: '#,##0' };
      wb.Sheets.Master[`DS${row}`] = { t: 'n', v: t.du0, z: '#,##0' };
      wb.Sheets.Master[`DT${row}`] = { t: 'n', v: t.dv0, z: '#,##0' };
      wb.Sheets.Master[`DU${row}`] = { t: 'n', v: t.dw0, z: '#,##0' };
      wb.Sheets.Master[`DV${row}`] = { t: 'n', v: t.dx0, z: '#,##0' };
      wb.Sheets.Master[`DW${row}`] = { t: 'n', v: t.dy0, z: '#,##0' };
      wb.Sheets.Master[`DX${row}`] = { t: 's', v: t.dz0 };
      wb.Sheets.Master[`DY${row}`] = { t: 's', v: t.ea0 };
      wb.Sheets.Master[`DZ${row}`] = { t: 'n', v: t.eb0, z: '#,##0' };
      wb.Sheets.Master[`EA${row}`] = { t: 'n', v: t.ec0, z: '#,##0' };
      wb.Sheets.Master[`EB${row}`] = { t: 'n', v: t.ed0, z: '#,##0' };

      return true;
    });

    row += 1;
    wb.Sheets.Master[`D${row}`] = { t: 'n', v: p.f0Sum, z: '#,##0' };
    wb.Sheets.Master[`E${row}`] = { t: 'n', v: p.g0Sum, z: '#,##0' };
    wb.Sheets.Master[`J${row}`] = { t: 'n', v: p.l0Sum, z: '#,##0' };
    wb.Sheets.Master[`Z${row}`] = { t: 'n', v: p.ab0Sum, z: '0.00' };
    wb.Sheets.Master[`AA${row}`] = { t: 'n', v: p.ac0Sum, z: '#,##0' };
    wb.Sheets.Master[`AB${row}`] = { t: 'n', v: p.ad0Sum, z: '0.00' };
    wb.Sheets.Master[`AC${row}`] = { t: 'n', v: p.ae0Sum, z: '#,##0' };
    wb.Sheets.Master[`AD${row}`] = { t: 'n', v: p.af0Sum, z: '0.00' };
    wb.Sheets.Master[`AE${row}`] = { t: 'n', v: p.ag0Sum, z: '#,##0' };
    wb.Sheets.Master[`AF${row}`] = { t: 'n', v: p.ah0Sum, z: '#,##0' };
    wb.Sheets.Master[`AG${row}`] = { t: 'n', v: p.ai0Sum, z: '#,##0' };
    wb.Sheets.Master[`AH${row}`] = { t: 'n', v: p.aj0Sum, z: '#,##0' };
    wb.Sheets.Master[`AI${row}`] = { t: 'n', v: p.ak0Sum, z: '#,##0' };
    wb.Sheets.Master[`AJ${row}`] = { t: 'n', v: p.al0Sum, z: '#,##0' };
    wb.Sheets.Master[`AK${row}`] = { t: 'n', v: p.am0Sum, z: '#,##0' };
    wb.Sheets.Master[`AL${row}`] = { t: 'n', v: p.an0Sum, z: '#,##0' };
    wb.Sheets.Master[`AM${row}`] = { t: 'n', v: p.ao0Sum, z: '#,##0' };
    wb.Sheets.Master[`AN${row}`] = { t: 'n', v: p.ap0Sum, z: '#,##0' };
    wb.Sheets.Master[`AO${row}`] = { t: 'n', v: p.aq0Sum, z: '#,##0' };
    wb.Sheets.Master[`AP${row}`] = { t: 'n', v: p.ar0Sum, z: '#,##0' };
    wb.Sheets.Master[`AQ${row}`] = { t: 'n', v: p.as0Sum, z: '#,##0' };
    wb.Sheets.Master[`AR${row}`] = { t: 'n', v: p.at0Sum, z: '#,##0' };
    wb.Sheets.Master[`AS${row}`] = { t: 'n', v: p.au0Sum, z: '#,##0' };
    wb.Sheets.Master[`AT${row}`] = { t: 'n', v: p.av0Sum, z: '#,##0' };
    wb.Sheets.Master[`AU${row}`] = { t: 'n', v: p.aw0Sum, z: '#,##0' };
    wb.Sheets.Master[`AV${row}`] = { t: 'n', v: p.ax0Sum, z: '#,##0' };
    wb.Sheets.Master[`AW${row}`] = { t: 'n', v: p.ay0Sum, z: '#,##0' };
    wb.Sheets.Master[`AX${row}`] = { t: 'n', v: p.az0Sum, z: '#,##0' };
    wb.Sheets.Master[`AY${row}`] = { t: 'n', v: p.ba0Sum, z: '#,##0' };
    wb.Sheets.Master[`AZ${row}`] = { t: 'n', v: p.bb0Sum, z: '#,##0' };
    wb.Sheets.Master[`BA${row}`] = { t: 'n', v: p.bc0Sum, z: '#,##0' };
    wb.Sheets.Master[`BB${row}`] = { t: 'n', v: p.bd0Sum, z: '#,##0' };
    wb.Sheets.Master[`BC${row}`] = { t: 'n', v: p.be0Sum, z: '#,##0' };
    wb.Sheets.Master[`BD${row}`] = { t: 'n', v: p.bf0Sum, z: '#,##0' };
    wb.Sheets.Master[`BE${row}`] = { t: 'n', v: p.bg0Sum, z: '#,##0' };
    wb.Sheets.Master[`BF${row}`] = { t: 'n', v: p.bh0Sum, z: '#,##0' };
    wb.Sheets.Master[`BG${row}`] = { t: 'n', v: p.bi0Sum, z: '#,##0' };
    wb.Sheets.Master[`BH${row}`] = { t: 'n', v: p.bj0Sum, z: '#,##0' };
    wb.Sheets.Master[`BI${row}`] = { t: 'n', v: p.bk0Sum, z: '#,##0' };
    wb.Sheets.Master[`BJ${row}`] = { t: 'n', v: p.bl0Sum, z: '#,##0' };
    wb.Sheets.Master[`BK${row}`] = { t: 'n', v: p.bm0Sum, z: '#,##0' };
    wb.Sheets.Master[`BL${row}`] = { t: 'n', v: p.bn0Sum, z: '#,##0' };
    wb.Sheets.Master[`BM${row}`] = { t: 'n', v: p.bo0Sum, z: '#,##0' };
    wb.Sheets.Master[`BN${row}`] = { t: 'n', v: p.bp0Sum, z: '#,##0' };
    wb.Sheets.Master[`BO${row}`] = { t: 'n', v: p.bq0Sum, z: '#,##0' };
    wb.Sheets.Master[`BP${row}`] = { t: 'n', v: p.br0Sum, z: '#,##0' };
    wb.Sheets.Master[`BQ${row}`] = { t: 'n', v: p.bs0Sum, z: '#,##0' };
    wb.Sheets.Master[`BR${row}`] = { t: 'n', v: p.bt0Sum, z: '#,##0' };
    wb.Sheets.Master[`BS${row}`] = { t: 'n', v: p.bu0Sum, z: '#,##0' };
    wb.Sheets.Master[`BT${row}`] = { t: 'n', v: p.bv0Sum, z: '#,##0' };
    wb.Sheets.Master[`BV${row}`] = { t: 'n', v: p.bx0Sum, z: '#,##0' };
    wb.Sheets.Master[`BW${row}`] = { t: 'n', v: p.by0Sum, z: '0.00' };
    wb.Sheets.Master[`BX${row}`] = { t: 'n', v: p.bz0Sum, z: '#,##0' };
    wb.Sheets.Master[`BY${row}`] = { t: 'n', v: p.ca0Sum, z: '#,##0' };
    wb.Sheets.Master[`BZ${row}`] = { t: 'n', v: p.cb0Sum, z: '#,##0' };
    wb.Sheets.Master[`CA${row}`] = { t: 'n', v: p.cc0Sum, z: '#,##0' };
    wb.Sheets.Master[`CB${row}`] = { t: 'n', v: p.cd0Sum, z: '#,##0' };
    wb.Sheets.Master[`CC${row}`] = { t: 'n', v: p.ce0Sum, z: '#,##0' };
    wb.Sheets.Master[`CD${row}`] = { t: 'n', v: p.cf0Sum, z: '#,##0' };
    wb.Sheets.Master[`CE${row}`] = { t: 'n', v: p.cg0Sum, z: '#,##0' };
    wb.Sheets.Master[`CF${row}`] = { t: 'n', v: p.ch0Sum, z: '#,##0' };
    wb.Sheets.Master[`CG${row}`] = { t: 'n', v: p.ci0Sum, z: '#,##0' };
    wb.Sheets.Master[`CH${row}`] = { t: 'n', v: p.cj0Sum, z: '#,##0' };
    wb.Sheets.Master[`CJ${row}`] = { t: 'n', v: p.cl0Sum, z: '#,##0' };
    wb.Sheets.Master[`CK${row}`] = { t: 'n', v: p.cm0Sum, z: '#,##0' };
    wb.Sheets.Master[`CL${row}`] = { t: 'n', v: p.cn0Sum, z: '#,##0' };
    wb.Sheets.Master[`CM${row}`] = { t: 'n', v: p.co0Sum, z: '#,##0' };
    wb.Sheets.Master[`CN${row}`] = { t: 'n', v: p.cp0Sum, z: '#,##0' };
    wb.Sheets.Master[`CO${row}`] = { t: 'n', v: p.cq0Sum, z: '#,##0' };
    wb.Sheets.Master[`CP${row}`] = { t: 'n', v: p.cr0Sum, z: '#,##0' };
    wb.Sheets.Master[`CS${row}`] = { t: 'n', v: p.cu0Sum, z: '#,##0' };
    wb.Sheets.Master[`CT${row}`] = { t: 'n', v: p.cv0Sum, z: '#,##0' };
    wb.Sheets.Master[`CU${row}`] = { t: 'n', v: p.cw0Sum, z: '0.0000' };
    wb.Sheets.Master[`CV${row}`] = { t: 'n', v: p.cx0Sum, z: '#,##0' };
    wb.Sheets.Master[`CW${row}`] = { t: 'n', v: p.cy0Sum, z: '#,##0' };
    wb.Sheets.Master[`CX${row}`] = { t: 'n', v: p.cz0Sum, z: '#,##0' };
    wb.Sheets.Master[`CY${row}`] = { t: 'n', v: p.da0Sum, z: '#,##0' };
    wb.Sheets.Master[`CZ${row}`] = { t: 'n', v: p.db0Sum, z: '#,##0' };
    wb.Sheets.Master[`DA${row}`] = { t: 'n', v: p.dc0Sum, z: '#,##0' };
    wb.Sheets.Master[`DB${row}`] = { t: 'n', v: p.dd0Sum, z: '#,##0' };
    wb.Sheets.Master[`DC${row}`] = { t: 'n', v: p.de0Sum, z: '#,##0' };
    wb.Sheets.Master[`DD${row}`] = { t: 'n', v: p.df0Sum, z: '#,##0' };
    wb.Sheets.Master[`DE${row}`] = { t: 'n', v: p.dg0Sum, z: '#,##0' };
    wb.Sheets.Master[`DF${row}`] = { t: 'n', v: p.dh0Sum, z: '#,##0' };
    wb.Sheets.Master[`DG${row}`] = { t: 'n', v: p.di0Sum, z: '#,##0' };
    wb.Sheets.Master[`DH${row}`] = { t: 'n', v: p.dj0Sum, z: '#,##0' };
    wb.Sheets.Master[`DI${row}`] = { t: 'n', v: p.dk0Sum, z: '#,##0' };
    wb.Sheets.Master[`DJ${row}`] = { t: 'n', v: p.dl0Sum, z: '#,##0' };
    wb.Sheets.Master[`DK${row}`] = { t: 'n', v: p.dm0Sum, z: '#,##0' };
    wb.Sheets.Master[`DL${row}`] = { t: 'n', v: p.dn0Sum, z: '#,##0' };
    wb.Sheets.Master[`DM${row}`] = { t: 'n', v: p.do0Sum, z: '#,##0' };
    wb.Sheets.Master[`DN${row}`] = { t: 'n', v: p.dp0Sum, z: '#,##0' };
    wb.Sheets.Master[`DP${row}`] = { t: 'n', v: p.dr0Sum, z: '#,##0' };
    wb.Sheets.Master[`DQ${row}`] = { t: 'n', v: p.ds0Sum, z: '#,##0' };
    wb.Sheets.Master[`DR${row}`] = { t: 'n', v: p.dt0Sum, z: '#,##0' };
    wb.Sheets.Master[`DS${row}`] = { t: 'n', v: p.du0Sum, z: '#,##0' };
    wb.Sheets.Master[`DT${row}`] = { t: 'n', v: p.dv0Sum, z: '#,##0' };
    wb.Sheets.Master[`DU${row}`] = { t: 'n', v: p.dw0Sum, z: '#,##0' };
    wb.Sheets.Master[`DV${row}`] = { t: 'n', v: p.dx0Sum, z: '#,##0' };
    wb.Sheets.Master[`DW${row}`] = { t: 'n', v: p.dy0Sum, z: '#,##0' };
    wb.Sheets.Master[`DZ${row}`] = { t: 'n', v: p.eb0Sum, z: '#,##0' };
    wb.Sheets.Master[`EA${row}`] = { t: 'n', v: p.ec0Sum, z: '#,##0' };
    wb.Sheets.Master[`EB${row}`] = { t: 'n', v: p.ed0Sum, z: '#,##0' };

    const fn = `static/report/${p.dir}/${p.dir}_payroll_master.xlsx`;
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
  updateEmployee,
  generateReportPayroll,
  genPayrollXLS,
  genXLSMaster,
  genAccCheck,
  generateSlip,
  sendSlip,
  genFinal,
  genPDFFinalQ,
  genXLSFinalQ,
  genPDFSpAllowQ,
  genPDFThrQ,
  genXLSThrQ,
  genThrSlipQ,
  sendThrSlip,
};
