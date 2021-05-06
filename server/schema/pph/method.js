const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');

const { intpre0 } = require('../scalar/number');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
    bolditalics: 'static/font/Roboto-MediumItalic.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const genPDF = async (p) => {
  try {
    await fs.ensureDir(`static/pph/${p.dir}`);

    const widths = [10, 140, 80];

    const col1 = [
      [{
        text: 'Pph21 Bulanan', border: [false, false, false, false], colSpan: 3, alignment: 'center', bold: true, fontSize: 8,
      }, '', ''],
      [{
        text: '', border: [false, false, false, false], colSpan: 3,
      }, '', ''],
      [{
        text: '', border: [true, true, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Nama Karyawan', border: [false, false, false, false] }, { text: p.d0, border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Status Tanggungan', border: [false, false, false, false] }, { text: p.r0, border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: p.ea0, border: [false, false, false, false], alignment: 'right' }, { text: 'Bulanan', border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Gaji Pokok', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.l0).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '1', border: [true, false, false, false], alignment: 'center' }, { text: 'Tunjangan Tetap & Tidak Tetap', border: [false, false, false, false] }, { text: intpre0(p.bk0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '2', border: [true, false, false, false], alignment: 'center' }, { text: 'Lembur & Insentif', border: [false, false, false, false] }, { text: intpre0(p.ai0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '3', border: [true, false, false, false], alignment: 'center' }, { text: 'Jaminan Kecelakaan Kerja, 0.54%', border: [false, false, false, false] }, { text: intpre0(p.cb0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '4', border: [true, false, false, false], alignment: 'center' }, { text: 'Jaminan Kematian, 0.30%', border: [false, false, false, false] }, { text: intpre0(p.cc0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '5', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran BPJS Kesehatan, 4% dibayar perusahaan', border: [false, false, false, false] }, { text: intpre0(p.cq0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '6', border: [true, false, false, false], alignment: 'center' }, { text: 'Retro Fill', border: [false, false, false, false] }, { text: intpre0(p.bu0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '7', border: [true, false, false, false], alignment: 'center' }, { text: 'Bonus', border: [false, false, false, false] }, { text: '0', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '8', border: [true, false, false, false], alignment: 'center' }, { text: 'THR', border: [false, false, false, false] }, { text: '0', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '9', border: [true, false, false, false], alignment: 'center' }, { text: 'Cuti yang diuangkan', border: [false, false, false, false] }, { text: intpre0(p.bz0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '10', border: [true, false, false, false], alignment: 'center' }, { text: '(Other Deduction)', border: [false, false, false, false] }, { text: intpre0(p.df0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '11', border: [true, false, false, false], alignment: 'center' }, { text: '(Absent Deduction)', border: [false, false, false, false] }, { text: intpre0(p.cy0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Penghasilan Bruto', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t1a).format(), border: [false, true, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '1', border: [true, false, false, false], alignment: 'center' }, { text: 'Biaya Jabatan', border: [false, false, false, false] }, { text: intpre0(p.t2a).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '2', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran JHT, 2% dari upah dibayar karyawan', border: [false, false, false, false] }, { text: intpre0(p.ce0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '3', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran Pensiun, 1% dari upah dibayar karyawan', border: [false, false, false, false] }, { text: intpre0(p.cj0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Pengurang', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t3a).format(), border: [false, true, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Neto Sebulan', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t4a).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Penghasilan Neto Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t5a).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'PTKP', border: [false, false, false, false] }, {
        text: intpre0(p.t6a).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Penghasilan Kena Pajak Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t7a).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'PKP Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t8a).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Tarif Pph21', border: [false, false, false, false], bold: true }, {
        text: 'Tarif', border: [false, false, true, false], bold: true,
      }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 1 : 0 - 50 Juta', border: [false, false, false, false] }, { text: '5%', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 2 : 50 - 250 Juta', border: [false, false, false, false] }, { text: '15%', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 3 : 250 - 500 Juta', border: [false, false, false, false] }, { text: '25%', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 4 : lebih dari 500 Juta', border: [false, false, false, false] }, { text: '30%', border: [false, false, true, false], alignment: 'right' }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Pph21 Tahunan', border: [false, false, false, false] }, {
        text: intpre0(p.t9a).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Pph21 Bulanan', border: [false, false, false, false] }, {
        text: intpre0(p.t10a).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Memiliki NPWP', border: [false, false, false, false] }, {
        text: p.p0, border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Pph21 Bulanan', border: [false, false, false, false] }, {
        text: intpre0(p.t11a).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, true], colSpan: 3,
      }, '', ''],
    ];

    const col2 = [
      [{
        text: 'Pph21 & Pajak Atas THR Tahunan', border: [false, false, false, false], colSpan: 3, alignment: 'center', bold: true, fontSize: 8,
      }, '', ''],
      [{
        text: '', border: [false, false, false, false], colSpan: 3,
      }, '', ''],
      [{
        text: '', border: [true, true, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Nama Karyawan', border: [false, false, false, false] }, { text: p.d0, border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Status Tanggungan', border: [false, false, false, false] }, { text: p.r0, border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: p.ea0, border: [false, false, false, false], alignment: 'right' }, { text: 'Bulanan', border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Gaji Pokok', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t0b).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '1', border: [true, false, false, false], alignment: 'center' }, { text: 'Tunjangan Tetap & Tidak Tetap', border: [false, false, false, false] }, { text: intpre0(p.bk0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '2', border: [true, false, false, false], alignment: 'center' }, { text: 'Lembur & Insentif', border: [false, false, false, false] }, { text: intpre0(p.ai0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '3', border: [true, false, false, false], alignment: 'center' }, { text: 'Jaminan Kecelakaan Kerja, 0.54%', border: [false, false, false, false] }, { text: intpre0(p.cb0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '4', border: [true, false, false, false], alignment: 'center' }, { text: 'Jaminan Kematian, 0.30%', border: [false, false, false, false] }, { text: intpre0(p.cc0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '5', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran BPJS Kesehatan, 4% dibayar perusahaan', border: [false, false, false, false] }, { text: intpre0(p.cq0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '6', border: [true, false, false, false], alignment: 'center' }, { text: 'Retro Fill', border: [false, false, false, false] }, { text: intpre0(p.bu0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '7', border: [true, false, false, false], alignment: 'center' }, { text: 'Bonus', border: [false, false, false, false] }, { text: intpre0(p.dr0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '8', border: [true, false, false, false], alignment: 'center' }, { text: 'THR', border: [false, false, false, false] }, { text: intpre0(p.bx0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '9', border: [true, false, false, false], alignment: 'center' }, { text: 'Cuti yang diuangkan', border: [false, false, false, false] }, { text: intpre0(p.bz0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '10', border: [true, false, false, false], alignment: 'center' }, { text: '(Other Deduction)', border: [false, false, false, false] }, { text: intpre0(p.df0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '11', border: [true, false, false, false], alignment: 'center' }, { text: '(Absent Deduction)', border: [false, false, false, false] }, { text: intpre0(p.cy0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Penghasilan Bruto', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t1b).format(), border: [false, true, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '1', border: [true, false, false, false], alignment: 'center' }, { text: 'Biaya Jabatan', border: [false, false, false, false] }, { text: intpre0(p.t2b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '2', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran JHT, 2% dari upah dibayar karyawan', border: [false, false, false, false] }, { text: intpre0(p.ce0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '3', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran Pensiun, 1% dari upah dibayar karyawan', border: [false, false, false, false] }, { text: intpre0(p.cj0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Pengurang', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t3b).format(), border: [false, true, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Neto Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t4b).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Penghasilan Neto Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t4b).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'PTKP', border: [false, false, false, false] }, {
        text: intpre0(p.t6a).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Penghasilan Kena Pajak Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t7b).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'PKP Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t8b).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Tarif Pph21', border: [false, false, false, false], bold: true }, {
        text: 'Tarif', border: [false, false, true, false], bold: true,
      }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 1 : 0 - 50 Juta', border: [false, false, false, false] }, { text: '5%', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 2 : 50 - 250 Juta', border: [false, false, false, false] }, { text: '15%', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 3 : 250 - 500 Juta', border: [false, false, false, false] }, { text: '25%', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 4 : lebih dari 500 Juta', border: [false, false, false, false] }, { text: '30%', border: [false, false, true, false], alignment: 'right' }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Pph21 Tahunan', border: [false, false, false, false] }, {
        text: intpre0(p.t9b).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Pph21 Bulanan', border: [false, false, false, false] }, {
        text: intpre0(p.t10b).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Memiliki NPWP', border: [false, false, false, false] }, {
        text: p.p0, border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Pph21 Bulanan', border: [false, false, false, false] }, {
        text: intpre0(p.t11b).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, true], colSpan: 3,
      }, '', ''],
      [{
        text: '', border: [false, false, false, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [false, false, false, false] }, { text: 'Pph21 dan Thr Tahunan', border: [false, false, false, false] }, {
        text: intpre0(p.t9b).format(), border: [false, false, false, false], alignment: 'right',
      }],
      [{ text: '', border: [false, false, false, false] }, { text: 'Pph21 Tahunan', border: [false, false, false, false] }, {
        text: intpre0(p.t9c).format(), border: [false, false, false, false], alignment: 'right',
      }],
      [{ text: '', border: [false, false, false, false] }, { text: 'Pajak Atas Thr', border: [false, false, false, false] }, {
        text: intpre0(p.t12b).format(), border: [false, true, false, false], alignment: 'right',
      }],
    ];

    const col3 = [
      [{
        text: 'Pph21 Tahunan', border: [false, false, false, false], colSpan: 3, alignment: 'center', bold: true, fontSize: 8,
      }, '', ''],
      [{
        text: '', border: [false, false, false, false], colSpan: 3,
      }, '', ''],
      [{
        text: '', border: [true, true, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Nama Karyawan', border: [false, false, false, false] }, { text: p.d0, border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Status Tanggungan', border: [false, false, false, false] }, { text: p.r0, border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: p.ea0, border: [false, false, false, false], alignment: 'right' }, { text: 'Bulanan', border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Gaji Pokok', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t0b).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '1', border: [true, false, false, false], alignment: 'center' }, { text: 'Tunjangan Tetap & Tidak Tetap', border: [false, false, false, false] }, { text: intpre0(p.bk0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '2', border: [true, false, false, false], alignment: 'center' }, { text: 'Lembur & Insentif', border: [false, false, false, false] }, { text: intpre0(p.ai0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '3', border: [true, false, false, false], alignment: 'center' }, { text: 'Jaminan Kecelakaan Kerja, 0.54%', border: [false, false, false, false] }, { text: intpre0(p.cb0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '4', border: [true, false, false, false], alignment: 'center' }, { text: 'Jaminan Kematian, 0.30%', border: [false, false, false, false] }, { text: intpre0(p.cc0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '5', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran BPJS Kesehatan, 4% dibayar perusahaan', border: [false, false, false, false] }, { text: intpre0(p.cq0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '6', border: [true, false, false, false], alignment: 'center' }, { text: 'Retro Fill', border: [false, false, false, false] }, { text: intpre0(p.bu0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '7', border: [true, false, false, false], alignment: 'center' }, { text: 'Bonus', border: [false, false, false, false] }, { text: '0', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '8', border: [true, false, false, false], alignment: 'center' }, { text: 'THR', border: [false, false, false, false] }, { text: '0', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '9', border: [true, false, false, false], alignment: 'center' }, { text: 'Cuti yang diuangkan', border: [false, false, false, false] }, { text: '0', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '10', border: [true, false, false, false], alignment: 'center' }, { text: '(Other Deduction)', border: [false, false, false, false] }, { text: intpre0(p.df0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '11', border: [true, false, false, false], alignment: 'center' }, { text: '(Absent Deduction)', border: [false, false, false, false] }, { text: intpre0(p.cy0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Penghasilan Bruto', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t1c).format(), border: [false, true, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '1', border: [true, false, false, false], alignment: 'center' }, { text: 'Biaya Jabatan', border: [false, false, false, false] }, { text: intpre0(p.t2c).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '2', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran JHT, 2% dari upah dibayar karyawan', border: [false, false, false, false] }, { text: intpre0(p.ce0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '3', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran Pensiun, 1% dari upah dibayar karyawan', border: [false, false, false, false] }, { text: intpre0(p.cj0b).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Pengurang', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t3c).format(), border: [false, true, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Neto Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t4c).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Penghasilan Neto Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t4c).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'PTKP', border: [false, false, false, false] }, {
        text: intpre0(p.t6a).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Penghasilan Kena Pajak Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t7c).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'PKP Setahun', border: [false, false, false, false], bold: true }, {
        text: intpre0(p.t8c).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Tarif Pph21', border: [false, false, false, false], bold: true }, {
        text: 'Tarif', border: [false, false, true, false], bold: true,
      }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 1 : 0 - 50 Juta', border: [false, false, false, false] }, { text: '5%', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 2 : 50 - 250 Juta', border: [false, false, false, false] }, { text: '15%', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 3 : 250 - 500 Juta', border: [false, false, false, false] }, { text: '25%', border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Level 4 : lebih dari 500 Juta', border: [false, false, false, false] }, { text: '30%', border: [false, false, true, false], alignment: 'right' }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Pph21 Tahunan', border: [false, false, false, false] }, {
        text: intpre0(p.t9c).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Pph21 Bulanan', border: [false, false, false, false] }, {
        text: intpre0(p.t10c).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Memiliki NPWP', border: [false, false, false, false] }, {
        text: p.p0, border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, false], colSpan: 3,
      }, '', ''],
      [{ text: '', border: [true, false, false, false] }, { text: 'Pph21 Bulanan', border: [false, false, false, false] }, {
        text: intpre0(p.t11c).format(), border: [false, false, true, false], alignment: 'right',
      }],
      [{
        text: '', border: [true, false, true, true], colSpan: 3,
      }, '', ''],
    ];

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        {
          columns: [
            {
              style: 'tbl1',
              table: {
                widths,
                body: col1,
              },
            },
            {
              style: 'tbl2',
              table: {
                widths,
                body: col2,
              },
            },
            {
              style: 'tbl3',
              table: {
                widths,
                body: col3,
              },
            },
          ],
        },
      ],
      styles: {
        tbl1: {
          lineHeight: 0.8,
          fontSize: 6,
          margin: [-20, -20, 0, 0],
        },
        tbl2: {
          lineHeight: 0.8,
          fontSize: 6,
          margin: [-10, -20, 0, 0],
        },
        tbl3: {
          lineHeight: 0.8,
          fontSize: 6,
          margin: [0, -20, 0, 0],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/pph/${p.dir}/${p.pph.name}.pdf`));
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
  genPDF,
};
