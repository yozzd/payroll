const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { format, getYear, getMonth } = require('date-fns');

const EmployeeSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  b0: { type: String, trim: true }, // EmpNo
  c0: { type: String, trim: true }, // EmpName
  d0: Date, // Birthday
  e0: { type: String, trim: true }, // Email
  f0: { type: String, trim: true }, // Department
  g0: { type: Number, default: 0 }, // Workday 1
  h0: { type: Number, default: 0 }, // Workday 2
  i0: { type: Number, default: 0 }, // Workday 3
  j0: { type: Number, default: 0 }, // Basic 1
  k0: { type: Number, default: 0 }, // Basic 2
  l0: { type: Number, default: 0 }, // Prorate Basic 1
  m0: { type: Number, default: 0 }, // Prorate Basic 2
  n0: { type: Number, default: 0 }, // Upah 1
  o0: { type: Number, default: 0 }, // Upah 2
  p0: { type: Number, default: 0 }, // Tj. Posisi Fix Lama
  q0: { type: Number, default: 0 }, // Tj. Posisi Fix Baru
  r0: { type: Number, default: 0 }, // Prorate Tj. Posisi Fix 1
  s0: { type: Number, default: 0 }, // Prorate Tj. Posisi Fix 2
  t0: { type: Number, default: 0 }, // Tj. Tetap Fungsi Fix Lama
  u0: { type: Number, default: 0 }, // Tj. Tetap Fungsi Fix Baru
  v0: { type: Number, default: 0 }, // Prorate Tj. Tetap Fungsi Fix 1
  w0: { type: Number, default: 0 }, // Prorate Tj. Tetap Fungsi Fix 2
  x0: { type: Number, default: 0 }, // Tj. Tetap Expertise Lama
  y0: { type: Number, default: 0 }, // Tj. Tetap Expertise Baru
  z0: { type: Number, default: 0 }, // Prorate Tj. Tetap Expertise 1
  aa0: { type: Number, default: 0 }, // Prorate Tj. Tetap Expertise 2
  ab0: { type: Number, default: 0 }, // Tj. Posisi Variable Lama
  ac0: { type: Number, default: 0 }, // Tj. Posisi Variable Baru
  ad0: { type: Number, default: 0 }, // Prorate Tj. Posisi Variable 1
  ae0: { type: Number, default: 0 }, // Prorate Tj. Posisi Variable 2
  af0: { type: Number, default: 0 }, // Tj. Fungsional Variable Lama
  ag0: { type: Number, default: 0 }, // Tj. Fungsional Variable Baru
  ah0: { type: Number, default: 0 }, // Prorate Tj. Fungsional Variable 1
  ai0: { type: Number, default: 0 }, // Prorate Tj. Fungsional Variable 2
  aj0: { type: Number, default: 0 }, // Tj. Acting / PLT Lama
  ak0: { type: Number, default: 0 }, // Tj. Acting / PLT Baru
  al0: { type: Number, default: 0 }, // Prorate Tj. Acting / PLT Lama
  am0: { type: Number, default: 0 }, // Prorate [DTj. Acting / PLT Baru
  an0: { type: Number, default: 0 }, // Jam OT Lama 1
  ao0: { type: Number, default: 0 }, // OT Lama 1
  ap0: { type: Number, default: 0 }, // Jam OT Baru 1
  aq0: { type: Number, default: 0 }, // OT Baru 1
  ar0: { type: Number, default: 0 }, // Prorate OT 1
  as0: { type: Number, default: 0 }, // Jam OT Lama 2
  at0: { type: Number, default: 0 }, // OT Lama 2
  au0: { type: Number, default: 0 }, // Jam OT Baru 2
  av0: { type: Number, default: 0 }, // OT Baru 2
  aw0: { type: Number, default: 0 }, // Prorate OT 2
  ax0: { type: Number, default: 0 }, // Jam OT Dinas Lama 1
  ay0: { type: Number, default: 0 }, // OT Dinas Lama 1
  az0: { type: Number, default: 0 }, // Jam OT Dinas Baru 1
  ba0: { type: Number, default: 0 }, // OT Dinas Baru 1
  bb0: { type: Number, default: 0 }, // Prorate Dinas 1
  bc0: { type: Number, default: 0 }, // Jam OT Dinas Lama 2
  bd0: { type: Number, default: 0 }, // OT Dinas Lama 2
  be0: { type: Number, default: 0 }, // Jam OT Dinas Baru 2
  bf0: { type: Number, default: 0 }, // OT Dinas Baru 2
  bg0: { type: Number, default: 0 }, // Prorate Dinas 2
  bh0: { type: Number, default: 0 }, // Absen Basic Lama 1
  bi0: { type: Number, default: 0 }, // Total Absen Basic Lama 1
  bj0: { type: Number, default: 0 }, // Absen Basic Baru 1
  bk0: { type: Number, default: 0 }, // Total Absen Basic Baru 1
  bl0: { type: Number, default: 0 }, // Prorate Absen 1
  bm0: { type: Number, default: 0 }, // Absen Basic Lama 2
  bn0: { type: Number, default: 0 }, // Total Absen Basic Lama 2
  bo0: { type: Number, default: 0 }, // Absen Basic Baru 2
  bp0: { type: Number, default: 0 }, // Total Absen Basic Baru 2
  bq0: { type: Number, default: 0 }, // Prorate Absen 2
  br0: { type: Number, default: 0 }, // Pembetulan Pembayaran
  bs0: { type: Number, default: 0 }, // Pemotongan Absensi
  slip: {
    name: { type: String, default: () => nanoid(6) },
    pw: String,
  },
});

const ProrateSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  from: Date,
  to: Date,
  year: Number,
  month: Number,
  period: String,
  dir: String,
  employee: [EmployeeSchema],
}, { timestamps: true });

EmployeeSchema.pre('save', async function fn(next) {
  const dob = format(new Date(this.d0), 'ddMMyy');
  this.slip.pw = `${this.b0.slice(-3)}${dob}`;

  return next();
});

ProrateSchema.pre('save', async function preSave(next) {
  const year = getYear(new Date(this.to));
  const month = getMonth(new Date(this.to));

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
  this.dir = format(new Date(this.to), 'yyyyMM');

  return next();
});

module.exports = model('Prorate', ProrateSchema, 'prorate');
