const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');
const nodemailer = require('nodemailer');
const XLSX = require('xlsx');
const { getDate, getMonth } = require('date-fns');

const {
  intpre0, intpre0v2, floatpre2, floatpre2v2, floatpre3, floatpre4, floatpre4v2,
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
              10, 60, 25, 30, 30, 20, 50, 20, 30, 20,
              30, 20, 30, 30, 30, 30, 30, 30, 30, 30,
              30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
            ],
            headerRows: 2,
            body: tbl1,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === employee.length + 2 ? '#eeeeee' : null),
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
              10, 60, 25, 30, 50, 30, 30, 30, 30, 30,
              30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
              30, 30, 30, 30, 30,
            ],
            headerRows: 2,
            body: tbl2,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === employee.length + 2 ? '#eeeeee' : null),
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
              10, 60, 25, 30, 30, 30, 30, 30, 30, 30,
              30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
              30, 30, 30, 30, 30, 30,
            ],
            headerRows: 2,
            body: tbl3,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === employee.length + 2 ? '#eeeeee' : null),
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
              10, 60, 25, 30, 30, 30, 30, 30, 30, 30,
              30, 30, 30, 30, 30, 30, 30,
            ],
            headerRows: 2,
            body: tbl4,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === employee.length + 2 ? '#eeeeee' : null),
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

const genPayrollXLS = async (p) => {
  try {
    const { employee: e } = p;
    await fs.ensureDir(`static/report/${p.dir}`);

    const len = e.length + 4;
    const wb = {
      SheetNames: ['Sheet1', 'Sheet2', 'Sheet3'],
      Sheets: {
        Sheet1: {
          '!ref': `A1:AD${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'Nama Karyawan' },
          C3: { t: 's', v: 'No Karyawan' },
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
        },
        Sheet2: {
          '!ref': `A1:V${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'Nama Karyawan' },
          C3: { t: 's', v: 'No Karyawan' },
          D3: { t: 's', v: 'Gaji Pokok' },
          E3: { t: 's', v: 'Lembur Upah / 173' },
          E4: { t: 's', v: 'Lembur Normal' },
          G3: { t: 's', v: 'Lembur Upah / 173' },
          G4: { t: 's', v: 'Lembur Normal' },
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
        },
        Sheet3: {
          '!ref': `A1:W${len}`,
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `PERIODE PAYROLL: ${p.period} ${p.year}` },
          A3: { t: 's', v: 'No' },
          B3: { t: 's', v: 'Nama Karyawan' },
          C3: { t: 's', v: 'No Karyawan' },
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
        },
      },
    };

    let row = 4;
    for (let i = 0; i < e.length; i += 1) {
      row += 1;
      wb.Sheets.Sheet1[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet1[`B${row}`] = { t: 's', v: e[i].d0 };
      wb.Sheets.Sheet1[`C${row}`] = { t: 's', v: e[i].e0 };
      wb.Sheets.Sheet1[`D${row}`] = { t: 'n', v: e[i].g0 };
      wb.Sheets.Sheet1[`E${row}`] = { t: 'n', v: intpre0v2(e[i].aj0).format() };
      wb.Sheets.Sheet1[`F${row}`] = { t: 'n', v: intpre0v2(e[i].ak0).format() };
      wb.Sheets.Sheet1[`G${row}`] = { t: 'n', v: intpre0v2(e[i].al0).format() };
      wb.Sheets.Sheet1[`H${row}`] = { t: 'n', v: intpre0v2(e[i].am0).format() };
      wb.Sheets.Sheet1[`I${row}`] = { t: 'n', v: intpre0v2(e[i].an0).format() };
      wb.Sheets.Sheet1[`J${row}`] = { t: 'n', v: intpre0v2(e[i].ao0).format() };
      wb.Sheets.Sheet1[`K${row}`] = { t: 'n', v: intpre0v2(e[i].ap0).format() };
      wb.Sheets.Sheet1[`L${row}`] = { t: 'n', v: intpre0v2(e[i].aq0).format() };
      wb.Sheets.Sheet1[`M${row}`] = { t: 'n', v: intpre0v2(e[i].ar0).format() };
      wb.Sheets.Sheet1[`N${row}`] = { t: 'n', v: intpre0v2(e[i].as0).format() };
      wb.Sheets.Sheet1[`O${row}`] = { t: 'n', v: intpre0v2(e[i].at0).format() };
      wb.Sheets.Sheet1[`P${row}`] = { t: 'n', v: intpre0v2(e[i].au0).format() };
      wb.Sheets.Sheet1[`Q${row}`] = { t: 'n', v: intpre0v2(e[i].av0).format() };
      wb.Sheets.Sheet1[`R${row}`] = { t: 'n', v: intpre0v2(e[i].aw0).format() };
      wb.Sheets.Sheet1[`S${row}`] = { t: 'n', v: intpre0v2(e[i].ax0).format() };
      wb.Sheets.Sheet1[`T${row}`] = { t: 'n', v: intpre0v2(e[i].ba0).format() };
      wb.Sheets.Sheet1[`U${row}`] = { t: 'n', v: intpre0v2(e[i].bb0).format() };
      wb.Sheets.Sheet1[`V${row}`] = { t: 'n', v: intpre0v2(e[i].bc0).format() };
      wb.Sheets.Sheet1[`W${row}`] = { t: 'n', v: intpre0v2(e[i].bd0).format() };
      wb.Sheets.Sheet1[`X${row}`] = { t: 'n', v: intpre0v2(e[i].be0).format() };
      wb.Sheets.Sheet1[`Y${row}`] = { t: 'n', v: intpre0v2(e[i].bf0).format() };
      wb.Sheets.Sheet1[`Z${row}`] = { t: 'n', v: intpre0v2(e[i].bg0).format() };
      wb.Sheets.Sheet1[`AA${row}`] = { t: 'n', v: intpre0v2(e[i].bh0).format() };
      wb.Sheets.Sheet1[`AB${row}`] = { t: 'n', v: intpre0v2(e[i].bi0).format() };
      wb.Sheets.Sheet1[`AC${row}`] = { t: 'n', v: intpre0v2(e[i].bj0).format() };
      wb.Sheets.Sheet1[`AD${row}`] = { t: 'n', v: intpre0v2(e[i].ax0 + e[i].bj0).format() };

      wb.Sheets.Sheet2[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet2[`B${row}`] = { t: 's', v: e[i].d0 };
      wb.Sheets.Sheet2[`C${row}`] = { t: 's', v: e[i].e0 };
      wb.Sheets.Sheet2[`D${row}`] = { t: 'n', v: e[i].g0 };
      wb.Sheets.Sheet2[`E${row}`] = { t: 'n', v: floatpre2v2(e[i].ab0).format() };
      wb.Sheets.Sheet2[`F${row}`] = { t: 'n', v: intpre0v2(e[i].ac0).format() };
      wb.Sheets.Sheet2[`G${row}`] = { t: 'n', v: floatpre2v2(e[i].ad0).format() };
      wb.Sheets.Sheet2[`H${row}`] = { t: 'n', v: intpre0v2(e[i].ae0).format() };
      wb.Sheets.Sheet2[`I${row}`] = { t: 'n', v: floatpre2v2(e[i].af0).format() };
      wb.Sheets.Sheet2[`J${row}`] = { t: 'n', v: intpre0v2(e[i].ag0).format() };
      wb.Sheets.Sheet2[`K${row}`] = { t: 'n', v: intpre0v2(e[i].ah0).format() };
      wb.Sheets.Sheet2[`L${row}`] = { t: 'n', v: intpre0v2(e[i].ai0).format() };
      wb.Sheets.Sheet2[`M${row}`] = { t: 'n', v: intpre0v2(e[i].bl0).format() };
      wb.Sheets.Sheet2[`N${row}`] = { t: 'n', v: intpre0v2(e[i].bm0).format() };
      wb.Sheets.Sheet2[`O${row}`] = { t: 'n', v: intpre0v2(e[i].bn0).format() };
      wb.Sheets.Sheet2[`P${row}`] = { t: 'n', v: intpre0v2(e[i].bo0).format() };
      wb.Sheets.Sheet2[`Q${row}`] = { t: 'n', v: intpre0v2(e[i].bp0).format() };
      wb.Sheets.Sheet2[`R${row}`] = { t: 'n', v: intpre0v2(e[i].bq0).format() };
      wb.Sheets.Sheet2[`S${row}`] = { t: 'n', v: intpre0v2(e[i].br0).format() };
      wb.Sheets.Sheet2[`T${row}`] = { t: 'n', v: intpre0v2(e[i].bs0).format() };
      wb.Sheets.Sheet2[`U${row}`] = { t: 'n', v: intpre0v2(e[i].bt0).format() };
      wb.Sheets.Sheet2[`V${row}`] = { t: 'n', v: intpre0v2(e[i].bu0).format() };

      wb.Sheets.Sheet3[`A${row}`] = { t: 'n', v: i + 1 };
      wb.Sheets.Sheet3[`B${row}`] = { t: 's', v: e[i].d0 };
      wb.Sheets.Sheet3[`C${row}`] = { t: 's', v: e[i].e0 };
      wb.Sheets.Sheet3[`D${row}`] = { t: 'n', v: e[i].g0 };
      wb.Sheets.Sheet3[`E${row}`] = { t: 'n', v: intpre0v2(e[i].bv0).format() };
      wb.Sheets.Sheet3[`F${row}`] = { t: 'n', v: intpre0v2(e[i].bw0).format() };
      wb.Sheets.Sheet3[`G${row}`] = { t: 'n', v: intpre0v2(e[i].bx0).format() };
      wb.Sheets.Sheet3[`H${row}`] = { t: 'n', v: intpre0v2(e[i].by0).format() };
      wb.Sheets.Sheet3[`I${row}`] = { t: 'n', v: intpre0v2(e[i].bz0).format() };
      wb.Sheets.Sheet3[`J${row}`] = { t: 'n', v: floatpre4v2(e[i].cw0).format() };
      wb.Sheets.Sheet3[`K${row}`] = { t: 'n', v: intpre0v2(e[i].cx0).format() };
      wb.Sheets.Sheet3[`L${row}`] = { t: 'n', v: intpre0v2(e[i].dc0).format() };
      wb.Sheets.Sheet3[`M${row}`] = { t: 'n', v: intpre0v2(e[i].dd0).format() };
      wb.Sheets.Sheet3[`N${row}`] = { t: 'n', v: intpre0v2(e[i].de0).format() };
      wb.Sheets.Sheet3[`O${row}`] = { t: 'n', v: intpre0v2(e[i].df0).format() };
      wb.Sheets.Sheet3[`P${row}`] = { t: 'n', v: intpre0v2(e[i].de0).format() };
      wb.Sheets.Sheet3[`Q${row}`] = { t: 'n', v: intpre0v2(e[i].dh0).format() };
      wb.Sheets.Sheet3[`R${row}`] = { t: 'n', v: intpre0v2(e[i].di0).format() };
      wb.Sheets.Sheet3[`S${row}`] = { t: 'n', v: intpre0v2(e[i].dj0).format() };
      wb.Sheets.Sheet3[`T${row}`] = { t: 'n', v: intpre0v2(e[i].dk0).format() };
      wb.Sheets.Sheet3[`U${row}`] = { t: 'n', v: intpre0v2(e[i].dl0).format() };
      wb.Sheets.Sheet3[`V${row}`] = { t: 'n', v: intpre0v2(e[i].dm0).format() };
      wb.Sheets.Sheet3[`W${row}`] = { t: 'n', v: intpre0v2(e[i].dn0).format() };
    }

    XLSX.writeFile(wb, `static/report/${p.dir}/${p.dir}_payroll.xls`);
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
      ],
    ];

    employee.map((e, i) => {
      tbl1.push([
        { text: (i + 1), alignment: 'center' }, e.d0, { text: e.e0, alignment: 'center' },
        { text: intpre0(e.dk0).format(), alignment: 'right' },
        { text: intpre0(e.dl0).format(), alignment: 'right' },
        { text: intpre0(e.dm0).format(), alignment: 'right' },
      ]);

      return true;
    });

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
              15, 180, 60, 60, 60, 60,
            ],
            body: tbl1,
          },
        },
      ],
      styles: {
        tbl1: {
          fontSize: 8,
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
      ['', '', e.fh0, ''],
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
              ['', 'NET PAYMENT', { text: e.e0 === 'X.0010' ? intpre0(e.ed0).format() : intpre0(e.ec0).format(), alignment: 'right', margin: [0, 0, 5, 0] }],
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

    if (e.aj0) vw1.push([{ text: 'Living Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.aj0).format(), alignment: 'right' }]);
    if (e.ak0) vw1.push([{ text: 'Housing Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ak0).format(), alignment: 'right' }]);
    if (e.al0) vw1.push([{ text: 'Functional Position Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.al0).format(), alignment: 'right' }]);
    if (e.am0) vw1.push([{ text: 'Functional Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.am0).format(), alignment: 'right' }]);
    if (e.an0) vw1.push([{ text: 'Coordinator Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.an0).format(), alignment: 'right' }]);
    if (e.ao0) vw1.push([{ text: 'Transport Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ao0).format(), alignment: 'right' }]);
    if (e.ap0) vw1.push([{ text: 'Communication Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ap0).format(), alignment: 'right' }]);
    if (e.aq0) vw1.push([{ text: 'Expertise Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.aq0).format(), alignment: 'right' }]);
    if (e.ar0) vw1.push([{ text: 'Honorarium Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ar0).format(), alignment: 'right' }]);
    if (e.as0) vw1.push([{ text: 'Position Variable Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.as0).format(), alignment: 'right' }]);
    if (e.at0) vw1.push([{ text: 'Functional Variable Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.at0).format(), alignment: 'right' }]);
    if (e.au0) vw1.push([{ text: 'Acting/PLT Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.au0).format(), alignment: 'right' }]);
    if (e.av0) vw1.push([{ text: 'Others Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.av0).format(), alignment: 'right' }]);

    if (e.ba0) vw1.push([{ text: 'Functional Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.ba0).format(), alignment: 'right' }]);
    if (e.bb0) vw1.push([{ text: 'Shift Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bb0).format(), alignment: 'right' }]);
    if (e.bc0) vw1.push([{ text: 'Tig Welding Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bc0).format(), alignment: 'right' }]);
    if (e.bd0) vw1.push([{ text: 'Plasma Cutting Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bd0).format(), alignment: 'right' }]);
    if (e.be0) vw1.push([{ text: 'LKS Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.be0).format(), alignment: 'right' }]);
    if (e.bf0) vw1.push([{ text: 'Koperasi Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bf0).format(), alignment: 'right' }]);
    if (e.bg0) vw1.push([{ text: 'Quality System Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bg0).format(), alignment: 'right' }]);
    if (e.bh0) vw1.push([{ text: 'Penghargaan Masa Kerja Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bh0).format(), alignment: 'right' }]);
    if (e.bi0) vw1.push([{ text: 'Others Allowance', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bi0).format(), alignment: 'right' }]);

    vw1.push([{ text: 'Salary All In', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.g0 + e.bk0).format(), alignment: 'right' }]);

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
    if (e.af0) vw2.push(['Insentif', { text: ms, colSpan: 2 }, '', { text: e.ad0, alignment: 'right' }, 'Hours', ':', { text: intpre0(e.ah0).format(), alignment: 'right' }]); income += e.ah0;

    vw2.push([{ text: 'Leave Right', colSpan: 3 }, '', '', { text: e.by0, alignment: 'right' }, 'Days', ':', { text: intpre0(e.bz0).format(), alignment: 'right' }]);

    let bw;
    if (e.bw0) {
      bw = e.bw0 === 12 ? '1 years 0 months' : `0 years ${e.bw0} months`;
    } else {
      bw = '';
    }
    vw2.push(['THR Prorate', { text: bw, colSpan: 2 }, '', `${e.bw0}/12`, '', ':', { text: intpre0(e.bx0).format(), alignment: 'right' }]);

    if (e.aj0) vw2.push(['Living Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.aj0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.aj0 / 21) * e.j0;
    if (e.ak0) vw2.push(['Housing Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.ak0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.ak0 / 21) * e.j0;
    if (e.al0) vw2.push(['Functional Position Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.al0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.al0 / 21) * e.j0;
    if (e.am0) vw2.push(['Functional Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.am0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.am0 / 21) * e.j0;
    if (e.an0) vw2.push(['Coordinator Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.an0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.an0 / 21) * e.j0;
    if (e.ao0) vw2.push(['Transport Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.ao0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.ao0 / 21) * e.j0;
    if (e.ap0) vw2.push(['Communication Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.ap0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.ap0 / 21) * e.j0;
    if (e.aq0) vw2.push(['Expertise Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.aq0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.aq0 / 21) * e.j0;
    if (e.ar0) vw2.push(['Honorarium Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.ar0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.ar0 / 21) * e.j0;
    if (e.as0) vw2.push(['Position Variable Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.as0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.as0 / 21) * e.j0;
    if (e.at0) vw2.push(['Functional Variable Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.at0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.at0 / 21) * e.j0;
    if (e.au0) vw2.push(['Acting/PLT Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.au0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.au0 / 21) * e.j0;
    if (e.av0) vw2.push(['Others Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.av0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.av0 / 21) * e.j0;

    if (e.ba0) vw2.push(['Functional Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.ba0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.ba0 / 21) * e.j0;
    if (e.bb0) vw2.push(['Shift Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.bb0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.bb0 / 21) * e.j0;
    if (e.bc0) vw2.push(['Tig Welding Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.bc0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.bc0 / 21) * e.j0;
    if (e.bd0) vw2.push(['Plasma Cutting Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.bd0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.bd0 / 21) * e.j0;
    if (e.be0) vw2.push(['LKS Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.be0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.be0 / 21) * e.j0;
    if (e.bf0) vw2.push(['Koperasi Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.bf0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.bf0 / 21) * e.j0;
    if (e.bg0) vw2.push(['Quality System Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.bg0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.bg0 / 21) * e.j0;
    if (e.bh0) vw2.push(['Penghargaan Masa Kerja Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.bh0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.bh0 / 21) * e.j0;
    if (e.bi0) vw2.push(['Others Allowance', { text: ms, colSpan: 2 }, '', { text: e.j0, alignment: 'right' }, 'Days', ':', { text: intpre0((e.bi0 / 21) * e.j0).format(), alignment: 'right' }]); income += (e.bi0 / 21) * e.j0;

    if (e.dt0) vw2.push([{ text: 'Uang Pisah', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.dt0).format(), alignment: 'right' }]); income += (e.dt0 / 21) * e.j0;
    vw2.push([{ text: 'Tambahan Lain Tidak Kena Pajak', colSpan: 5 }, '', '', '', '', ':', { text: intpre0(e.bv0).format(), alignment: 'right' }]);
    if (e.fe0) vw2.push(['Uang Pesangon', '', '', '', '', ':', { text: intpre0(e.fe0).format(), alignment: 'right' }]); income += e.fe0;
    vw2.push(['', '', '', {
      text: 'Total Income', colSpan: 2, alignment: 'right', bold: true,
    }, '', ':', { text: intpre0(income).format(), alignment: 'right', bold: true }]);

    const tax = e.cz0 ? e.cz0 : e.da0;
    const deduction = e.cx0 + e.dl0 + e.dm0 + e.dk0 + tax + e.ce0 + e.cj0 + e.cr0 + e.dh0 + e.dn0;
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
      ['Ayu Fatimah / Ratnawati', 'Ronal P. Siahaan', 'Yutin Sudarni', 'Hendra Syahputra', 'Eko Hernanto'],
      ['Personel / IT DB', 'Compensation, Benefit & Company Licences', 'Finance Manager', 'HR & GA Dept Head', 'Management PT. Labtech Penta International'],
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
      ],
      styles: {
        tbl1: {
          fontSize: 8,
          margin: [-10, -10, -10, 0],
        },
        tbl2: {
          fontSize: 8,
          margin: [10, 20, 0, 20],
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

module.exports = {
  updateEmployee,
  generateReportPayroll,
  genPayrollXLS,
  genAccCheck,
  generateSlip,
  sendSlip,
  genFinal,
};
