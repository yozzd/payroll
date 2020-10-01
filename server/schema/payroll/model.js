const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { format, getYear, getMonth } = require('date-fns');

const EmployeeSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  d0: String, // Nama Karyawan
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
