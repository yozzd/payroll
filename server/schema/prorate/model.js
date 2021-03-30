const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { format, getYear, getMonth } = require('date-fns');

const EmployeeSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  b0: String, // EmpNo
  c0: String, // EmpName
  d0: Date, // Birthday
  e0: String, // Email
  f0: String, // Department
  g0: String, // Section
  h0: String, // Status
  i0: { type: Number, default: 0 }, // Total
  j0: { type: Number, default: 0 }, // Install1
  k0: { type: Number, default: 0 }, // Install2
  l0: { type: Number, default: 0 }, // Install3
  m0: { type: Number, default: 0 }, // Install4
  n0: { type: Number, default: 0 }, // Install5
  o0: { type: Number, default: 0 }, // Install6
  p0: String, // Note
  slip: {
    name: { type: String, default: () => nanoid(6) },
    pw: String,
  },
});

const TaxSchema = new Schema({
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

TaxSchema.pre('save', async function preSave(next) {
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

module.exports = model('Tax', TaxSchema, 'tax');
