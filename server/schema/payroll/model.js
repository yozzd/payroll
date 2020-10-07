const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { format, getYear, getMonth } = require('date-fns');

const EmployeeSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  d0: String, // Nama Karyawan
  e0: String, // No. Karyawan
  f0: Number, // Selisih GP dari Hari Kerja Normal
  g0: Number, // Gaji Pokok
  h0: String, // Status Karyawan
  i0: Date, // Hired date
  j0: Number, // Hari Kerja
  k0: Date, // Resign / Finish Contract Date
  l0: Number, // Gaji Berdasarkan Hari Kerja Normal
  m0: String, // Note
  n0: String, // Jenis Kelamin
  o0: Date, // Birthday
  p0: String, // Status NPWP
  q0: String, // No. NPWP
  r0: String, // Status Tanggungan
  s0: String, // Bank
  t0: String, // No. Rekening
  u0: String, // Department
  v0: String, // Section
  w0: String, // Section Code
  x0: String, // Grade
  y0: String, // Jabatan
  z0: String, // JPK No. (Kartu Peserta Jamsostek)
  aa0: String, // No. BPJS Kesehatan
  ab0: Number, // Jam Lembur Normal
  ac0: Number, // Amount Lembur Normal
  ad0: Number, // Jam Lembur Dinas
  ae0: Number, // Amount Lembur Dinas
  af0: Number, // Jam Insentif
  ag0: Number, // Rate Insentif
  ah0: Number, // Amount Insentif
  ai0: Number, // Total Lembur & Insentif
  aj0: Number, // Tunjangan Tetap Living
  ak0: Number, // Tunjangan Tetap Perumahan
  al0: Number, // Tunjangan Tetap Posisi Fix
  am0: Number, // Tunjangan Tetap Fungsional Fix
  an0: Number, // Tunjangan Tetap Koordinator
  ao0: Number, // Tunjangan Tetap Transport
  ap0: Number, // Tunjangan Tetap Komunikasi
  aq0: Number, // Tunjangan Tetap Expertisi
  ar0: Number, // Tunjangan Tetap Honorarium
  as0: Number, // Tunjangan Tetap Posisi Variable
  at0: Number, // Tunjangan Tetap Fungsional Variable
  au0: Number, // Tunjangan Tetap Acting/PLT
  av0: Number, // Tunjangan Tetap Others
  aw0: Number, // Total Tunjangan Tetap
  ax0: Number, // Upah (Gaji Pokok + Tunjangan Tetap)
  ay0: Number, // Upah Normal
  az0: Number, // Selisih Upah
  ba0: Number, // Tunjangan Tidak Tetap Fungsional
  bb0: Number, // Tunjangan Tidak Tetap Shift
  bc0: Number, // Tunjangan Tidak Tetap Tig Welding
  bd0: Number, // Tunjangan Tidak Tetap Operator Plasma
  be0: Number, // Tunjangan Tidak Tetap LKS
  bf0: Number, // Tunjangan Tidak Tetap Koperasi
  bg0: Number, // Tunjangan Tidak Tetap Quality System
  bh0: Number, // Tunjangan Tidak Tetap Penghargaan Masa Kerja
  bi0: Number, // Tunjangan Tidak Tetap Others
  bj0: Number, // Total Tunjangan Tidak Tetap
  bk0: Number, // Total Tunjangan Tetap & Tunjangan Tidak Tetap
});

const PayrollSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  from: Date,
  to: Date,
  year: Number,
  month: Number,
  period: String,
  rate: {
    b4: Number, // TK/0
    b5: Number, // TK/1
    b6: Number, // TK/2
    b7: Number, // TK/3
    b8: Number, // K/0
    b9: Number, // K/1
    b10: Number, // K/2
    b11: Number, // K/3
    b14: Number, // Upah Minimum BPJS Kesehatan
    b15: Number, // Upah Maximum BPJS Kesehatan
    b17: Number, // Upah Minimum BPJS Ketenagakerjaan
    b18: Number, // Upah Maximum BPJS Ketenagakerjaan
    cb5: Number, // %JKK Perusahaan
    cc5: Number, // %JK Perusahaan
    cd5: Number, // %JHT Perusahaan
    ce5: Number, // %JHT Karyawan
    ci5: Number, // %Pensiun Perusahaan
    cj5: Number, // %Pensiun Karyawan
    cq5: Number, // %BPJS Kesehatan Perusahaan
    cr5: Number, // %BPJS Kesehatan Karyawan
  },
  employee: [EmployeeSchema],
}, { timestamps: true });

EmployeeSchema.pre('save', async function fn(next) {
  this.i0 = this.i0 ? format(new Date(this.i0), 'yyyy-MM-dd') : null;
  this.k0 = this.k0 ? format(new Date(this.k0), 'yyyy-MM-dd') : null;
  this.l0 = Math.round((this.g0 / 21) * this.j0, 10);
  this.o0 = this.o0 ? format(new Date(this.o0), 'yyyy-MM-dd') : null;
  this.f0 = this.g0 - this.l0;

  this.ac0 = (this.ay0 / 173) * this.ab0;
  this.ae0 = (this.ay0 / 173) * this.ad0;
  this.ah0 = this.af0 * this.ag0;
  this.ai0 = this.ac0 + this.ae0 + this.ah0;

  this.aw0 = this.aj0
    + this.ak0
    + this.al0
    + this.am0
    + this.an0
    + this.ao0
    + this.ar0
    + this.ap0
    + this.aq0
    + this.ar0
    + this.as0
    + this.at0
    + this.au0
    + this.av0;
  this.ax0 = this.g0 + this.aw0;
  this.az0 = this.ax0 - this.ay0;

  this.bj0 = this.ba0
    + this.bb0
    + this.bc0
    + this.bd0
    + this.be0
    + this.bf0
    + this.bg0
    + this.bh0
    + this.bi0;
  this.bk0 = this.aw0 + this.bj0;

  return next();
});

PayrollSchema.pre('save', async function fn(next) {
  const year = getYear(new Date(this.from));
  const month = getMonth(new Date(this.from));

  if (this.isModified('from')) {
    const count = await this.constructor.find({ month, year }).countDocuments();
    if (count === 1) {
      return next('Period has been registered, please select another period');
    }
  }

  this.from = format(new Date(this.from), 'yyyy-MM-dd');
  this.to = format(new Date(this.to), 'yyyy-MM-dd');
  this.year = year;
  this.month = month;
  this.period = `${format(new Date(this.from), 'dd MMM')} - ${format(new Date(this.to), 'dd MMM')}`;

  return next();
});

module.exports = model('Payroll', PayrollSchema, 'payroll');
