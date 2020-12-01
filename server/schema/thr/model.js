const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { format, getYear, getMonth } = require('date-fns');

const EmployeeSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  b0: String, // EmpNo
  c0: String, // EmpName
  d0: Date, // Birthday
  e0: String, // Email
  f0: String, // BankAccount
  g0: String, // Department
  h0: String, // Section
  i0: String, // Position
  j0: String, // TaxID
  k0: Number, // BasicSalary
  l0: Number, // LivingFix
  m0: Number, // HousingFix
  n0: Number, // FunctPosisiFix
  o0: Number, // Functional
  p0: Number, // CoordFix
  q0: Number, // TransportFix
  r0: Number, // CommuFix
  s0: Number, // Expertise
  t0: Number, // HonorariumFix
  u0: Number, // PositionVariaFix
  v0: Number, // FuncVariaFix
  w0: Number, // ActingFix
  x0: Number, // OtherFix
  y0: Number, // Total
  z0: Number, // THRMonth
  aa0: Number, // THRAmount
  ab0: Number, // InstallTime
  ac0: Number, // Install1
  ad0: Number, // Install2
  ae0: Number, // Install3
  af0: Number, // Install4
  ag0: Number, // Install5
  ah0: Number, // Install6
  ai0: String, // DateApprov
  aj0: String, // Note1
  ak0: String, // Note2
  slip: {
    name: { type: String, default: () => nanoid(6) },
    pw: String,
  },
});

const ThrSchema = new Schema({
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
});

ThrSchema.pre('save', async function preSave(next) {
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
  this.dir = format(new Date(this.from), 'yyyyMM');

  return next();
});

module.exports = model('Thr', ThrSchema, 'thr');
