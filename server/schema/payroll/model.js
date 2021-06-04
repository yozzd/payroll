const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { format, getYear, getMonth } = require('date-fns');

const prod = [
  'Production Division', 'Electronic', 'Mechanical Production', 'Product Development & Control',
  'R&D DAQ & Control', 'R&D Electronic', 'R&D HVAC/Electrical', 'R&D Mechanical',
  'R&D Software & Product Development', 'Information Technology', 'HVAC/Electrical',
  'Material Requirement Planning', 'Quality Assurance', 'Building Infrastructure & Service',
];

const EmployeeSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  d0: { type: String, trim: true }, // Nama Karyawan
  e0: { type: String, trim: true }, // No. Karyawan
  f0: { type: Number, default: 0 }, // Selisih GP dari Hari Kerja Normal
  g0: { type: Number, default: 0 }, // Gaji Pokok
  h0: { type: String, trim: true }, // Status Karyawan
  i0: Date, // Hired date
  j0: { type: Number, default: 0 }, // Hari Kerja
  k0: Date, // Resign / Finish Contract Date
  l0: { type: Number, default: 0 }, // Gaji Berdasarkan Hari Kerja Normal
  m0: { type: String, trim: true }, // Note
  n0: { type: String, trim: true }, // Jenis Kelamin
  o0: Date, // Birthday
  p0: { type: String, trim: true }, // Status NPWP
  q0: { type: String, trim: true }, // No. NPWP
  r0: { type: String, trim: true }, // Status Tanggungan
  s0: { type: String, trim: true }, // Bank
  t0: { type: String, trim: true }, // No. Rekening
  u0: { type: String, trim: true }, // Department
  v0: { type: String, trim: true }, // Section
  w0: { type: String, trim: true }, // Section Code
  x0: { type: String, trim: true }, // Grade
  y0: { type: String, trim: true }, // Jabatan
  z0: { type: String, trim: true }, // JPK No. (Kartu Peserta Jamsostek)
  aa0: { type: String, trim: true }, // No. BPJS Kesehatan
  ab0: { type: Number, default: 0 }, // Jam Lembur Normal
  ac0: { type: Number, default: 0 }, // Amount Lembur Normal
  ad0: { type: Number, default: 0 }, // Jam Lembur Dinas
  ae0: { type: Number, default: 0 }, // Amount Lembur Dinas
  af0: { type: Number, default: 0 }, // Jam Insentif
  ag0: { type: Number, default: 0 }, // Rate Insentif
  ah0: { type: Number, default: 0 }, // Amount Insentif
  ai0: { type: Number, default: 0 }, // Total Lembur & Insentif
  aj0: { type: Number, default: 0 }, // Tunjangan Tetap Living
  aj0r: { type: Number, default: 0 }, // Tunjangan Tetap Living
  ak0: { type: Number, default: 0 }, // Tunjangan Tetap Perumahan
  ak0r: { type: Number, default: 0 }, // Tunjangan Tetap Perumahan
  al0: { type: Number, default: 0 }, // Tunjangan Tetap Posisi Fix
  al0r: { type: Number, default: 0 }, // Tunjangan Tetap Posisi Fix
  al0f: { type: Number, default: 0 }, // Tunjangan Tetap Posisi Fix Flag
  al0p: { type: Number, default: 0 }, // Tunjangan Tetap Posisi Fix Percentage
  am0: { type: Number, default: 0 }, // Tunjangan Tetap Fungsional Fix
  am0r: { type: Number, default: 0 }, // Tunjangan Tetap Fungsional Fix
  am0f: { type: Boolean, default: false }, // Tunjangan Tetap Fungsional Fix Flag
  am0p: { type: Number, default: 0 }, // Tunjangan Tetap Fungsional Fix Percentage
  an0: { type: Number, default: 0 }, // Tunjangan Tetap Koordinator
  an0r: { type: Number, default: 0 }, // Tunjangan Tetap Koordinator
  ao0: { type: Number, default: 0 }, // Tunjangan Tetap Transport
  ao0r: { type: Number, default: 0 }, // Tunjangan Tetap Transport
  ap0: { type: Number, default: 0 }, // Tunjangan Tetap Komunikasi
  ap0r: { type: Number, default: 0 }, // Tunjangan Tetap Komunikasi
  aq0: { type: Number, default: 0 }, // Tunjangan Tetap Expertisi
  aq0r: { type: Number, default: 0 }, // Tunjangan Tetap Expertisi
  ar0: { type: Number, default: 0 }, // Tunjangan Tetap Honorarium
  ar0r: { type: Number, default: 0 }, // Tunjangan Tetap Honorarium
  as0: { type: Number, default: 0 }, // Tunjangan Tetap Posisi Variable
  as0r: { type: Number, default: 0 }, // Tunjangan Tetap Posisi Variable
  as0f: { type: Boolean, default: false }, // Tunjangan Tetap Posisi Variable Flag
  as0p: { type: Number, default: 0 }, // Tunjangan Tetap Posisi Variable Percentage
  at0: { type: Number, default: 0 }, // Tunjangan Tetap Fungsional Variable
  at0r: { type: Number, default: 0 }, // Tunjangan Tetap Fungsional Variable
  at0f: { type: Boolean, default: false }, // Tunjangan Tetap Fungsional Variable Flag
  at0p: { type: Number, default: 0 }, // Tunjangan Tetap Fungsional Variable Percentage
  au0: { type: Number, default: 0 }, // Tunjangan Tetap Acting/PLT
  au0r: { type: Number, default: 0 }, // Tunjangan Tetap Acting/PLT
  au0f: { type: Boolean, default: false }, // Tunjangan Tetap Acting/PLT Flag
  au0p: { type: Number, default: 0 }, // Tunjangan Tetap Acting/PLT Percentage
  av0: { type: Number, default: 0 }, // Tunjangan Tetap Others
  av0r: { type: Number, default: 0 }, // Tunjangan Tetap Others
  aw0: { type: Number, default: 0 }, // Total Tunjangan Tetap
  ax0: { type: Number, default: 0 }, // Upah (Gaji Pokok + Tunjangan Tetap)
  ay0: { type: Number, default: 0 }, // Upah Normal
  az0: { type: Number, default: 0 }, // Selisih Upah
  ba0: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Fungsional
  ba0r: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Fungsional
  bb0: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Shift
  bb0r: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Shift
  bc0: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Tig Welding
  bc0r: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Tig Welding
  bd0: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Operator Plasma
  bd0r: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Operator Plasma
  be0: { type: Number, default: 0 }, // Tunjangan Tidak Tetap LKS
  be0r: { type: Number, default: 0 }, // Tunjangan Tidak Tetap LKS
  bf0: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Koperasi
  bf0r: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Koperasi
  bg0: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Quality System
  bg0r: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Quality System
  bh0: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Penghargaan Masa Kerja
  bh0r: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Penghargaan Masa Kerja
  bi0: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Others
  bi0r: { type: Number, default: 0 }, // Tunjangan Tidak Tetap Others
  bj0: { type: Number, default: 0 }, // Total Tunjangan Tidak Tetap
  bk0: { type: Number, default: 0 }, // Total Tunjangan Tetap & Tunjangan Tidak Tetap
  bl0: { type: Number, default: 0 }, // Pembetulan Pembayaran Koreksi Absen
  bm0: { type: Number, default: 0 }, // Pembetulan Pembayaran Koreksi Gaji & Hari Kerja
  bn0: { type: Number, default: 0 }, // Pembetulan Pembayaran Koreksi OT
  bo0: { type: Number, default: 0 }, // Pembetulan Pembayaran Tunjangan
  bp0: { type: Number, default: 0 }, // Pembetulan Pembayaran Insentif
  bq0: { type: Number, default: 0 }, // Pembetulan Pembayaran THR
  br0: { type: Number, default: 0 }, // Pembetulan Pembayaran Allowance
  bs0: { type: Number, default: 0 }, // Pembetulan Pembayaran Uang Makan Security
  bt0: { type: Number, default: 0 }, // Pembetulan Pembayaran Others
  bu0: { type: Number, default: 0 }, // Total Pembetulan Pembayaran
  bv0: { type: Number, default: 0 }, // Tambahan Lain Tidak Kena Pajak
  bw0: { type: Number, default: 0 }, // THR Prorate Months
  bx0: { type: Number, default: 0 }, // THR Prorate Amount
  by0: { type: Number, default: 0 }, // Cuti Days
  bz0: { type: Number, default: 0 }, // Cuti Amount
  ca0: { type: Number, default: 0 }, // Pendapatan Kotor
  cb0: { type: Number, default: 0 }, // JKK Perusahaan
  cc0: { type: Number, default: 0 }, // JK Perusahaan
  cd0: { type: Number, default: 0 }, // JHT Perusahaan
  ce0: { type: Number, default: 0 }, // JHT Karyawan
  cf0: { type: Number, default: 0 }, // Total BPJS, JKK, JK, JHT Perusahaan & Karyawan
  cg0: { type: Number, default: 0 }, // Total Pensiun Perusahaan & JHT Perusahaan
  ch0: { type: Number, default: 0 }, // Standar Upah Pensiun
  ci0: { type: Number, default: 0 }, // Pensiun Perusahaan
  cj0: { type: Number, default: 0 }, // Pensiun Karyawan
  ck0: { type: String, trim: true }, // Description (BPJS Ketenagakerjaan)
  cl0: { type: Number, default: 0 }, // Total Iuran Pensiun & Kesehatan Perusahaan & Karyawan
  cm0: { type: Number, default: 0 }, // Total BPJS, JKK, JK, JHT, Pensiun Perusahaan & Karyawan
  cn0: { type: Number, default: 0 }, // Total JKK, JK, Medical Perusahaan
  co0: { type: Number, default: 0 }, // Upah untuk Pelaporan BPJS Kesehatan
  cp0: { type: Number, default: 0 }, // Standar Gaji Iuran BPJS Kesehatan
  cq0: { type: Number, default: 0 }, // BPJS Kesehatan Perusahaan
  cr0: { type: Number, default: 0 }, // BPJS Kesehatan Karyawan
  cs0: { type: Number, default: 0 }, // Kelas Rawat
  ct0: { type: String, trim: true }, // Description Medical
  cu0: { type: Number, default: 0 }, // Total Medical Perusahaan & Karyawan
  cv0: { type: Number, default: 0 }, // Total JKK, JK, JHT, Pensiun Perusahaan
  cw0: { type: Number, default: 0 }, // Absen
  cx0: { type: Number, default: 0 }, // Amount Absen
  cy0: { type: Number, default: 0 }, // Total Absen Aktual & Koreksi Absen
  cz0: { type: Number, default: 0 }, // Pajak Penghasilan Ber-NPWP
  da0: { type: Number, default: 0 }, // Pajak Tambahan Non-NPWP
  db0: { type: Number, default: 0 }, // Total Pajak NPWP & Non-NPWP
  dc0: { type: Number, default: 0 }, // Pemotongan Kelebihan Bayar Gaji
  dd0: { type: Number, default: 0 }, // Pemotongan Kelebihan Bayar OT
  de0: { type: Number, default: 0 }, // Pemotongan Prorate Absen
  df0: { type: Number, default: 0 }, // Total Pemotongan Selain Absen
  dg0: { type: Number, default: 0 }, // Pemotongan Koreksi Absen
  dh0: { type: Number, default: 0 }, // Pemotongan Toolroom
  di0: { type: Number, default: 0 }, // Pemotongan Others
  dj0: { type: Number, default: 0 }, // Total Pemotongan Lain
  dk0: { type: Number, default: 0 }, // Dana Pinjaman
  dl0: { type: Number, default: 0 }, // Kantin
  dm0: { type: Number, default: 0 }, // Kopkar & BMI
  dn0: { type: Number, default: 0 }, // Pph21 Kurang Bayar
  do0: { type: Number, default: 0 }, // Jumlah Pemotongan
  dp0: { type: Number, default: 0 }, // Penghasilan
  dq0: { type: String, trim: true }, // Periode Potongan Kantin
  dr0: { type: Number, default: 0 }, // Other Income
  ds0: { type: Number, default: 0 }, // Uang Pisah Prorate
  dt0: { type: Number, default: 0 }, // Uang Pisah Amount
  du0: { type: Number, default: 0 }, // Uang Pesangon Prorate
  dv0: { type: Number, default: 0 }, // Uang Pesangon Amount
  dw0: { type: Number, default: 0 }, // Uang P.Masa Kerja Prorate
  dx0: { type: Number, default: 0 }, // Uang P.Masa Kerja Amount
  dy0: { type: Number, default: 0 }, // Uang Penggantian Hak
  dz0: { type: String, trim: true }, // Bulan
  ea0: { type: Number, default: 0 }, // Total Bulan Periode Pajak
  eb0: { type: Number, default: 0 }, // Take Home Pay
  ec0: { type: Number, default: 0 }, // Total Transfer by Mandiri
  ed0: { type: Number, default: 0 }, // Total by Cash
  ef0: { type: Number, default: 0 }, // Positon/Fungsional
  eg0: { type: Number, default: 0 }, // Housing
  eh0: { type: Number, default: 0 }, // Transport
  ei0: { type: Number, default: 0 }, // Incentive
  ej0: { type: Number, default: 0 }, // Meals
  ek0: { type: Number, default: 0 }, // Living
  el0: { type: Number, default: 0 }, // Communication
  em0: { type: Number, default: 0 }, // Other Allowance Taxable
  en0: { type: Number, default: 0 }, // Pesangon Serv
  eo0: { type: Number, default: 0 }, // Leave, Serv, Transport
  eq0: { type: Number, default: 0 }, // Leave / THR
  er0: { type: Number, default: 0 }, // Total JHT dan Pensiun Karyawan
  es0: { type: Number, default: 0 }, // Pengembalian Pajak DTP
  et0: { type: String, trim: true }, // Religion
  ew0: { type: String, trim: true }, // Email
  ex0: { type: Boolean, default: false }, // Final Payment Flag
  ey0: { type: Boolean, default: false }, // Tidak Ikut Pensiun Flag
  ez0: { type: Boolean, default: false }, // Tidak Ikut BPJS Flag
  fa0: { type: Boolean, default: false }, // Pengembalian Pajak Flag
  fb0: { type: Boolean, default: false }, // JKK & JK Flag
  fc0: { type: Number, default: 0 }, // Manual Pajak Final Payment
  fd0: { type: Number, default: 0 }, // Manual THR
  fe0: { type: Number, default: 0 }, // Manual Termination
  ff0: { type: Boolean, default: false }, // Pesangon Flag
  fg0: { type: Boolean, default: false }, // Mangkir Flag
  fh0: { type: String, trim: true }, // Note 1
  fi0: { type: String, trim: true }, // Note 2
  fj0: { type: Boolean, default: false }, // BPJS Final Payment Dibayarkan Flag
  fk0: { type: Boolean, default: false }, // BPJS Kesehatan Dibayarkan Flag
  fl0: { type: Boolean, default: false }, // Special Allowance Flag
  category: Number, // 0 = Administration, 1 = Production
  fDate: Date, // Final Payment Date Form
  trDate: Date, // Termination Date Form
  lvReason: { type: String, trim: true }, // Leaving Reason
  spAllowRem: { type: String, trim: true }, // Special Allowance Remark
  slip: {
    name: { type: String, default: () => nanoid(6) },
    pw: String,
  },
  final: {
    name: { type: String, default: () => nanoid(6) },
    pw: String,
  },
});

const PayrollSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  from: Date,
  to: Date,
  year: { type: Number, default: 0 },
  month: { type: Number, default: 0 },
  period: String,
  dir: String,
  freeze: { type: Boolean, default: false },
  typeHR: { type: Number, default: 0 },
  tglHR: Date,
  rate: {
    b4: { type: Number, default: 0 }, // TK/0
    b5: { type: Number, default: 0 }, // TK/1
    b6: { type: Number, default: 0 }, // TK/2
    b7: { type: Number, default: 0 }, // TK/3
    b8: { type: Number, default: 0 }, // K/0
    b9: { type: Number, default: 0 }, // K/1
    b10: { type: Number, default: 0 }, // K/2
    b11: { type: Number, default: 0 }, // K/3
    b14: { type: Number, default: 0 }, // Upah Minimum BPJS Kesehatan
    b15: { type: Number, default: 0 }, // Upah Maximum BPJS Kesehatan
    b17: { type: Number, default: 0 }, // Upah Minimum BPJS Ketenagakerjaan
    b18: { type: Number, default: 0 }, // Upah Maximum BPJS Ketenagakerjaan
    cb5: { type: Number, default: 0 }, // %JKK Perusahaan
    cc5: { type: Number, default: 0 }, // %JK Perusahaan
    cd5: { type: Number, default: 0 }, // %JHT Perusahaan
    ce5: { type: Number, default: 0 }, // %JHT Karyawan
    ci5: { type: Number, default: 0 }, // %Pensiun Perusahaan
    cj5: { type: Number, default: 0 }, // %Pensiun Karyawan
    cq5: { type: Number, default: 0 }, // %BPJS Kesehatan Perusahaan
    cr5: { type: Number, default: 0 }, // %BPJS Kesehatan Karyawan
  },
  employee: [EmployeeSchema],
}, { timestamps: true });

EmployeeSchema.pre('save', async function fn(next) {
  this.i0 = this.i0 ? format(new Date(this.i0), 'yyyy-MM-dd') : null;
  this.k0 = this.k0 ? format(new Date(this.k0), 'yyyy-MM-dd') : null;
  this.l0 = (this.g0 / 21) * this.j0;
  this.o0 = this.o0 ? format(new Date(this.o0), 'yyyy-MM-dd') : null;
  this.f0 = this.g0 - this.l0;

  this.ac0 = (this.ay0 / 173) * this.ab0;
  this.ae0 = (this.ay0 / 173) * this.ad0;
  this.ah0 = this.af0 * this.ag0;
  this.ai0 = this.ac0 + this.ae0 + this.ah0;

  this.aj0 = (this.aj0r / 21) * this.j0;
  this.ak0 = (this.ak0r / 21) * this.j0;
  this.al0 = (this.al0r / 21) * this.j0;
  this.am0 = (this.am0r / 21) * this.j0;
  this.an0 = (this.an0r / 21) * this.j0;
  this.ao0 = (this.ao0r / 21) * this.j0;
  this.ap0 = (this.ap0r / 21) * this.j0;
  this.aq0 = (this.aq0r / 21) * this.j0;
  this.ar0 = (this.ar0r / 21) * this.j0;
  this.as0 = (this.as0r / 21) * this.j0;
  this.at0 = (this.at0r / 21) * this.j0;
  this.au0 = (this.au0r / 21) * this.j0;
  this.av0 = (this.av0r / 21) * this.j0;

  this.ba0 = (this.ba0r / 21) * this.j0;
  this.bb0 = (this.bb0r / 21) * this.j0;
  this.bc0 = (this.bc0r / 21) * this.j0;
  this.bd0 = (this.bd0r / 21) * this.j0;
  this.be0 = (this.be0r / 21) * this.j0;
  this.bf0 = (this.bf0r / 21) * this.j0;
  this.bg0 = (this.bg0r / 21) * this.j0;
  this.bh0 = (this.bh0r / 21) * this.j0;
  this.bi0 = (this.bi0r / 21) * this.j0;

  if (!this.fl0) {
    this.al0f = false;
    this.al0p = null;
    this.al0 = (this.al0r / 21) * this.j0;

    this.am0f = false;
    this.am0p = null;
    this.am0 = (this.am0r / 21) * this.j0;

    this.as0f = false;
    this.as0p = null;
    this.as0 = (this.as0r / 21) * this.j0;

    this.at0f = false;
    this.at0p = null;
    this.at0 = (this.at0r / 21) * this.j0;

    this.au0f = false;
    this.au0p = null;
    this.au0 = (this.au0r / 21) * this.j0;
  }

  if (this.fl0 && this.al0f && this.al0p > 0) {
    const v = this.al0;
    this.al0 = (100 / this.al0p) * v;
  }
  if (this.fl0 && this.am0f && this.am0p > 0) {
    const v = this.am0;
    this.am0 = (100 / this.am0p) * v;
  }
  if (this.fl0 && this.as0f && this.as0p > 0) {
    const v = this.as0;
    this.as0 = (100 / this.as0p) * v;
  }
  if (this.fl0 && this.at0f && this.at0p > 0) {
    const v = this.at0;
    this.at0 = (100 / this.at0p) * v;
  }
  if (this.fl0 && this.au0f && this.au0p > 0) {
    const v = this.au0;
    this.au0 = (100 / this.au0p) * v;
  }

  this.aw0 = this.aj0
    + this.ak0
    + this.al0
    + this.am0
    + this.an0
    + this.ao0
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

  this.bu0 = this.bl0
    + this.bm0
    + this.bn0
    + this.bo0
    + this.bp0
    + this.bq0
    + this.br0
    + this.bs0
    + this.bt0;

  if (this.fd0) {
    this.bx0 = this.fd0;
  } else {
    this.bx0 = (this.ay0 / 12) * this.bw0;
  }
  this.bz0 = (this.ay0 / 21) * this.by0;

  this.dt0 = this.ay0 * this.ds0;
  this.dx0 = this.ay0 * this.dw0;
  if (this.fe0) {
    this.dv0 = this.fe0;
    this.dy0 = 0;
  } else {
    this.dv0 = this.ay0 * this.du0;
    this.dy0 = (this.dv0 + this.dx0) * 0.15;
  }

  this.ca0 = this.g0
    + this.ai0
    + this.aw0
    + this.bj0
    + this.bu0
    + this.bx0
    + this.bz0
    + this.bv0
    + this.dr0
    + this.dt0
    + this.dv0
    + this.dx0
    + this.dy0
    - this.f0;

  this.cx0 = (this.g0 / 21) * this.cw0;
  this.cy0 = this.cx0;

  if (this.e0 === 'X.0003' || (this.ex0 && !this.fj0) || (this.ey0 && this.ez0) || this.ff0 || this.fg0) {
    this.cb0 = 0;
    this.cc0 = 0;
    this.cd0 = 0;
    this.ce0 = 0;
  } else {
    // if (this.fb0) {
    //   this.cb0 = this.ay0 * this.ownerDocument().rate.cb5;
    //   this.cc0 = this.ay0 * this.ownerDocument().rate.cc5;
    // } else {
    //   this.cb0 = this.ay0 * this.ownerDocument().rate.cb5 * 0.01;
    //   this.cc0 = this.ay0 * this.ownerDocument().rate.cc5 * 0.01;
    // }

    this.cb0 = this.ay0 * this.ownerDocument().rate.cb5;
    this.cc0 = this.ay0 * this.ownerDocument().rate.cc5;
    this.cd0 = this.ay0 * this.ownerDocument().rate.cd5;
    this.ce0 = this.ay0 * this.ownerDocument().rate.ce5;
  }

  this.cf0 = this.cb0 + this.cc0 + this.cd0 + this.ce0;

  if (this.ay0 >= this.ownerDocument().rate.b18) {
    this.ch0 = this.ey0 || (this.ex0 && !this.fj0) || this.ff0 || this.fg0 ? 0 : this.ownerDocument().rate.b18;
  } else if (
    this.ay0 < this.ownerDocument().rate.b18
    && this.ay0 > this.ownerDocument().rate.b17
  ) {
    this.ch0 = this.ey0 || (this.ex0 && !this.fj0) || this.ff0 || this.fg0 ? 0 : this.ay0;
  } else {
    this.ch0 = this.ey0 || (this.ex0 && !this.fj0) || this.ff0 || this.fg0 ? 0 : this.ownerDocument().rate.b17;
  }

  this.ci0 = this.ch0 * this.ownerDocument().rate.ci5;
  this.cj0 = this.ch0 * this.ownerDocument().rate.cj5;
  this.cg0 = this.ci0 + this.cd0;

  this.cm0 = this.cb0 + this.cc0 + this.cd0 + this.ce0 + this.ci0 + this.cj0;
  if (this.co0 >= this.ownerDocument().rate.b15) {
    this.cp0 = (this.ez0 && !this.fk0) || (this.ex0 && !this.fj0) || this.ff0 || this.fg0 ? 0 : this.ownerDocument().rate.b15;
  } else if (
    this.co0 < this.ownerDocument().rate.b15
    && this.co0 > this.ownerDocument().rate.b14
  ) {
    this.cp0 = (this.ez0 && !this.fk0) || (this.ex0 && !this.fj0) || this.ff0 || this.fg0 ? 0 : this.co0;
  } else if (this.co0 === this.ownerDocument().rate.b14) {
    this.cp0 = (this.ez0 && !this.fk0) || (this.ex0 && !this.fj0) || this.ff0 || this.fg0 ? 0 : this.ownerDocument().rate.b14;
  } else {
    this.cp0 = (this.ez0 && !this.fk0) || (this.ex0 && !this.fj0) || this.ff0 || this.fg0 ? 0 : 0;
  }
  this.cq0 = this.cp0 * this.ownerDocument().rate.cq5;
  this.cr0 = this.cp0 * this.ownerDocument().rate.cr5;
  if (this.co0 >= 4000000) {
    this.cs0 = 1;
  } else if (this.co0 > 0 && this.co0 < 4000000) {
    this.cs0 = 2;
  } else {
    this.cs0 = null;
  }
  this.cu0 = this.cq0 + this.cr0;
  this.cl0 = this.ci0 + this.cj0 + this.cq0 + this.cr0;
  this.cv0 = this.cb0 + this.cc0 + this.cd0 + this.ci0;

  this.df0 = this.dc0 + this.dd0 + this.de0;
  this.dj0 = this.dc0 + this.dd0 + this.de0 + this.dg0 + this.dh0 + this.di0;

  /** ********Pajak********* */
  const ptkpObject = {
    'TK/0': this.ownerDocument().rate.b4,
    'TK/1': this.ownerDocument().rate.b5,
    'TK/2': this.ownerDocument().rate.b6,
    'TK/3': this.ownerDocument().rate.b7,
    'K/0': this.ownerDocument().rate.b8,
    'K/1': this.ownerDocument().rate.b9,
    'K/2': this.ownerDocument().rate.b10,
    'K/3': this.ownerDocument().rate.b11,
  };

  const pph21t = () => {
    const bruto = this.l0
      + this.bk0
      + this.ai0
      + this.cb0
      + this.cc0
      + this.cq0
      + this.bu0
      + this.dr0
      + this.bz0
      - (this.df0 + this.cy0);
    let biayaJabatan;
    if (bruto * 0.05 >= 500000) {
      biayaJabatan = 500000;
    } else {
      biayaJabatan = Math.round(bruto * 0.05);
    }
    const pengurang = biayaJabatan + this.ce0 + this.cj0;
    const netoSebulan = bruto - pengurang;
    // const netoSetahun = Math.floor((netoSebulan * this.ea0) / 1000) * 1000;
    const netoSetahun = netoSebulan * this.ea0;
    const ptkp = ptkpObject[this.r0];
    const pSetahun = netoSetahun - ptkp;
    const pkpSetahun = pSetahun <= 0 ? 0 : Math.floor(pSetahun / 1000) * 1000;
    const pph21Tahunan = Math.min(Math.max(0, pkpSetahun), 50000000) * 0.05
      + Math.min(Math.max(0, pkpSetahun - 50000000), 200000000) * 0.15
      + Math.min(Math.max(0, pkpSetahun - 250000000), 250000000) * 0.25
      + Math.max(0, pkpSetahun - 500000000) * 0.3;
    return pph21Tahunan;
  };

  let pph21 = 0;
  if ((this.ownerDocument().typeHR === 1 && this.et0 === 'Islam') || (this.ownerDocument().typeHR === 2 && this.et0 !== 'Islam')) {
    const bruto = (this.l0 * this.ea0)
      + (this.bk0 * this.ea0)
      + (this.ai0 * this.ea0)
      + (this.cb0 * this.ea0)
      + (this.cc0 * this.ea0)
      + (this.cq0 * this.ea0)
      + (this.bu0 * this.ea0)
      + this.bx0
      + this.dr0
      + (this.bz0 * this.ea0)
      - (this.df0 + (this.cy0 * this.ea0));
    let biayaJabatan;
    if (bruto * 0.05 >= 6000000) {
      biayaJabatan = 6000000;
    } else {
      biayaJabatan = Math.round(bruto * 0.05);
    }
    const pengurang = biayaJabatan + (this.ce0 * this.ea0) + (this.cj0 * this.ea0);
    const netoSetahun = bruto - pengurang;
    const ptkp = ptkpObject[this.r0];
    const pSetahun = netoSetahun - ptkp;
    const pkpSetahun = pSetahun <= 0 ? 0 : Math.floor(pSetahun / 1000) * 1000;
    const pph21T1 = Math.min(Math.max(0, pkpSetahun), 50000000) * 0.05
      + Math.min(Math.max(0, pkpSetahun - 50000000), 200000000) * 0.15
      + Math.min(Math.max(0, pkpSetahun - 250000000), 250000000) * 0.25
      + Math.max(0, pkpSetahun - 500000000) * 0.3;
    const pph21T2 = pph21t();
    const pph21Tahunan = pph21T1 - pph21T2;
    pph21 = pph21Tahunan === 0 ? 0 : Math.round(pph21Tahunan);
  } else {
    const pph21Tahunan = pph21t();
    pph21 = pph21Tahunan === 0 ? 0 : Math.round(pph21Tahunan / this.ea0);
  }

  if (this.fc0 && this.p0 === 'Yes') {
    this.cz0 = this.fc0;
    this.da0 = 0;
  } else if (this.fc0 && this.p0 === 'No') {
    this.cz0 = 0;
    this.da0 = this.fc0;
  } else if (!this.fc0 && this.p0 === 'Yes') {
    const v = Math.floor(pph21 / 100) * 100;
    this.cz0 = v <= 200 ? 0 : v;
    this.da0 = 0;
  } else {
    this.cz0 = 0;
    this.da0 = Math.floor((pph21 * 1.2) / 100) * 100;
  }

  this.db0 = this.cz0 + this.da0;
  /** ********Pajak********* */

  this.do0 = this.cx0
    + this.cz0
    + this.da0
    + this.ce0
    + this.cr0
    + this.cj0
    + this.dk0
    + this.dm0
    + this.dl0
    + this.dj0
    + this.dn0;

  this.dp0 = this.ca0 - this.do0;
  this.eb0 = this.dp0;

  if (this.fa0 || this.p0 === 'No') {
    this.es0 = 0;
  } else {
    this.es0 = this.db0;
  }

  const byCash = ['X.0008', 'X.0010'];
  if (byCash.includes(this.e0) || this.ex0 || this.ff0 || this.fg0) {
    this.ec0 = 0;
    this.ed0 = this.eb0 + this.es0;
    // this.ed0 = this.dp0 + this.dr0 + this.dt0 + this.dx0 + this.dy0 + this.es0;
  } else {
    this.ec0 = this.dp0 + this.es0;
    this.ed0 = 0;
  }

  this.cn0 = this.cb0 + this.cc0 + this.cq0;
  this.ef0 = this.al0 + this.am0 + this.as0 + this.at0 + this.ba0;
  this.eg0 = this.ak0;
  this.eh0 = this.an0 + this.ao0;
  this.ei0 = this.aq0 + this.ar0 + this.be0 + this.bf0;
  this.ej0 = this.bc0 + this.bd0 + this.bb0;
  this.ek0 = this.aj0;
  this.el0 = this.ap0;
  this.em0 = this.au0 + this.av0 + this.bg0 + this.bh0 + this.bi0;
  this.en0 = this.dt0 + this.dx0 + this.dy0 + this.dv0;
  if (this.fe0) {
    this.eo0 = this.fe0;
  } else {
    this.eo0 = this.bz0 + this.dt0 + this.dx0 + this.dy0 + this.dv0;
  }
  this.eq0 = this.bz0 + this.bx0;
  this.er0 = this.ce0 + this.cj0;

  const dob = format(new Date(this.o0), 'ddMMyy');
  this.slip.pw = `${this.e0.slice(-3)}${dob}`;
  this.final.pw = `${this.e0.slice(-3)}${dob}`;

  this.category = prod.includes(this.u0) ? 1 : 0;

  return next();
});

PayrollSchema.pre('save', async function fn(next) {
  const year = getYear(new Date(this.to));
  const month = getMonth(new Date(this.to));

  if (this.isModified('to')) {
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
  this.dir = format(new Date(this.to), 'yyyyMM');

  return next();
});

module.exports = model('Payroll', PayrollSchema, 'payroll');
