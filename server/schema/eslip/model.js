const { Schema, model } = require('mongoose');
const { nanoid } = require('nanoid');
const { format, getYear, getMonth } = require('date-fns');

const EmployeeSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  b0: String, // EmpNo
  c0: String, // EmpName
  // e0: Date, // Date
  e0: String, // Date
  // f0: Number, // Month
  // g0: Number, // Year
  h0: String, // Email
  i0: String, // BankAccount
  j0: String, // Department
  k0: String, // Section
  l0: String, // Position
  m0: String, // TaxID
  n0: String, // MaritalStatus
  o0: String, // JpkId
  p0: String, // BPJSHealthId
  q0: Number, // BasicSalary
  r0: Number, // OTHour
  s0: Number, // OT
  t0: Number, // InsentifHour
  u0: Number, // Insentif
  v0: Number, // TotInsentif
  w0: Number, // OfficialOTHour
  x0: Number, // OfficialOT
  y0: Number, // LivingFix
  z0: Number, // HousingFix
  aa0: Number, // FunctPosisiFix
  ab0: Number, // Functional
  ac0: Number, // CoordFix
  ad0: Number, // TransportFix
  ae0: Number, // CommuFix
  af0: Number, // Expertise
  ag0: Number, // HonorariumFix
  ah0: Number, // PositionVariaFix
  ai0: Number, // FuncVariaFix
  aj0: Number, // ActingFix
  ak0: Number, // OtherFix
  al0: Number, // FuncNon
  am0: Number, // ShiftNon
  an0: Number, // TigNon
  ao0: Number, // PlasmaNon
  ap0: Number, // LKSNon
  aq0: Number, // KopNon
  ar0: Number, // QualityNon
  as0: Number, // OtherNon
  at0: Number, // Leave
  au0: Number, // THR
  av0: Number, // UangPisah
  aw0: Number, // UangMasa
  ax0: Number, // UangPesangon
  ay0: Number, // UangHak
  az0: Number, // Bonus
  ba0: Number, // OtherNonTax
  bb0: Number, // AbsenHour
  bc0: Number, // Absen
  bd0: Number, // Correct
  be0: Number, // Tax
  bf0: Number, // NonTax
  bg0: Number, // JHT
  bh0: Number, // Health
  bi0: Number, // Pension
  bj0: Number, // Loan
  bk0: Number, // Kopkar
  bl0: Number, // Canteen
  bm0: Number, // Retro
  bn0: Number, // UnderTax
  bo0: Number, // TotDeduc
  bp0: Number, // Gross
  bq0: Number, // TaxReturn
  br0: Number, // TotEarning
  bs0: Number, // Net
  bt0: String, // Note1
  bu0: String, // Note2
  bv0: String, // Note3
  bw0: String, // DateSlip
  slipPath: String,
});

const ESlipSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  from: Date,
  to: Date,
  year: Number,
  month: Number,
  period: String,
  employee: [EmployeeSchema],
  done: { type: Number, default: 0 },
}, { timestamps: true });

ESlipSchema.pre('save', async function preSave(next) {
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

module.exports = model('ESlip', ESlipSchema, 'eslip');
