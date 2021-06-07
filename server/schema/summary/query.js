const Payroll = require('../payroll/model');

const sumBasic = async (id) => {
  const p = await Payroll.aggregate([
    { $match: { year: id } },
    { $unwind: '$employee' },
    {
      $group: {
        _id: {
          e0: '$employee.e0',
        },
        d0: { $first: '$employee.d0' },
        e0: { $first: '$employee.e0' },
        i0: { $last: '$employee.i0' },
        u0: { $last: '$employee.u0' },
        y0: { $last: '$employee.y0' },
        jan: { $sum: { $cond: { if: { $eq: ['$month', 0] }, then: '$employee.l0', else: 0 } } },
        feb: { $sum: { $cond: { if: { $eq: ['$month', 1] }, then: '$employee.l0', else: 0 } } },
        mar: { $sum: { $cond: { if: { $eq: ['$month', 2] }, then: '$employee.l0', else: 0 } } },
        apr: { $sum: { $cond: { if: { $eq: ['$month', 3] }, then: '$employee.l0', else: 0 } } },
        mei: { $sum: { $cond: { if: { $eq: ['$month', 4] }, then: '$employee.l0', else: 0 } } },
        jun: { $sum: { $cond: { if: { $eq: ['$month', 5] }, then: '$employee.l0', else: 0 } } },
        jul: { $sum: { $cond: { if: { $eq: ['$month', 6] }, then: '$employee.l0', else: 0 } } },
        agu: { $sum: { $cond: { if: { $eq: ['$month', 7] }, then: '$employee.l0', else: 0 } } },
        sep: { $sum: { $cond: { if: { $eq: ['$month', 8] }, then: '$employee.l0', else: 0 } } },
        okt: { $sum: { $cond: { if: { $eq: ['$month', 9] }, then: '$employee.l0', else: 0 } } },
        nov: { $sum: { $cond: { if: { $eq: ['$month', 10] }, then: '$employee.l0', else: 0 } } },
        des: { $sum: { $cond: { if: { $eq: ['$month', 11] }, then: '$employee.l0', else: 0 } } },
      },
    },
    { $sort: { '_id.e0': 1 } },
    {
      $group: {
        _id: 'summary',
        employee: {
          $push: {
            _id: '$e0',
            d0: '$d0',
            e0: '$e0',
            i0: '$i0',
            u0: '$u0',
            y0: '$y0',
            jan: '$jan',
            feb: '$feb',
            mar: '$mar',
            apr: '$apr',
            mei: '$mei',
            jun: '$jun',
            jul: '$jul',
            agu: '$agu',
            sep: '$sep',
            okt: '$okt',
            nov: '$nov',
            des: '$des',
            tBasic: { $sum: ['$jan', '$feb', '$mar', '$apr', '$mei', '$jun', '$jul', '$agu', '$sep', '$okt', '$nov', '$des'] },
          },
        },
        totJan: { $sum: '$jan' },
        totFeb: { $sum: '$feb' },
        totMar: { $sum: '$mar' },
        totApr: { $sum: '$apr' },
        totMei: { $sum: '$mei' },
        totJun: { $sum: '$jun' },
        totJul: { $sum: '$jul' },
        totAgu: { $sum: '$agu' },
        totSep: { $sum: '$sep' },
        totOkt: { $sum: '$okt' },
        totNov: { $sum: '$nov' },
        totDes: { $sum: '$des' },
      },
    },
    {
      $addFields: {
        sBasic: { $sum: ['$totJan', '$totFeb', '$totMar', '$totApr', '$totMei', '$totJun', '$totJul', '$totAgu', '$totSep', '$totOkt', '$totNov', '$totDes'] },
      },
    },
  ]);

  return p[0];
};

const sumOT = async (id) => {
  const p = await Payroll.aggregate([
    { $match: { year: id } },
    { $unwind: '$employee' },
    {
      $group: {
        _id: {
          e0: '$employee.e0',
        },
        d0: { $first: '$employee.d0' },
        e0: { $first: '$employee.e0' },
        i0: { $last: '$employee.i0' },
        u0: { $last: '$employee.u0' },
        y0: { $last: '$employee.y0' },
        jan: { $sum: { $cond: { if: { $eq: ['$month', 0] }, then: '$employee.ai0', else: 0 } } },
        feb: { $sum: { $cond: { if: { $eq: ['$month', 1] }, then: '$employee.ai0', else: 0 } } },
        mar: { $sum: { $cond: { if: { $eq: ['$month', 2] }, then: '$employee.ai0', else: 0 } } },
        apr: { $sum: { $cond: { if: { $eq: ['$month', 3] }, then: '$employee.ai0', else: 0 } } },
        mei: { $sum: { $cond: { if: { $eq: ['$month', 4] }, then: '$employee.ai0', else: 0 } } },
        jun: { $sum: { $cond: { if: { $eq: ['$month', 5] }, then: '$employee.ai0', else: 0 } } },
        jul: { $sum: { $cond: { if: { $eq: ['$month', 6] }, then: '$employee.ai0', else: 0 } } },
        agu: { $sum: { $cond: { if: { $eq: ['$month', 7] }, then: '$employee.ai0', else: 0 } } },
        sep: { $sum: { $cond: { if: { $eq: ['$month', 8] }, then: '$employee.ai0', else: 0 } } },
        okt: { $sum: { $cond: { if: { $eq: ['$month', 9] }, then: '$employee.ai0', else: 0 } } },
        nov: { $sum: { $cond: { if: { $eq: ['$month', 10] }, then: '$employee.ai0', else: 0 } } },
        des: { $sum: { $cond: { if: { $eq: ['$month', 11] }, then: '$employee.ai0', else: 0 } } },
      },
    },
    { $sort: { '_id.e0': 1 } },
    {
      $group: {
        _id: 'summary',
        employee: {
          $push: {
            _id: '$e0',
            d0: '$d0',
            e0: '$e0',
            i0: '$i0',
            u0: '$u0',
            y0: '$y0',
            jan: '$jan',
            feb: '$feb',
            mar: '$mar',
            apr: '$apr',
            mei: '$mei',
            jun: '$jun',
            jul: '$jul',
            agu: '$agu',
            sep: '$sep',
            okt: '$okt',
            nov: '$nov',
            des: '$des',
            tOT: { $sum: ['$jan', '$feb', '$mar', '$apr', '$mei', '$jun', '$jul', '$agu', '$sep', '$okt', '$nov', '$des'] },
          },
        },
        totJan: { $sum: '$jan' },
        totFeb: { $sum: '$feb' },
        totMar: { $sum: '$mar' },
        totApr: { $sum: '$apr' },
        totMei: { $sum: '$mei' },
        totJun: { $sum: '$jun' },
        totJul: { $sum: '$jul' },
        totAgu: { $sum: '$agu' },
        totSep: { $sum: '$sep' },
        totOkt: { $sum: '$okt' },
        totNov: { $sum: '$nov' },
        totDes: { $sum: '$des' },
      },
    },
    {
      $addFields: {
        sOT: { $sum: ['$totJan', '$totFeb', '$totMar', '$totApr', '$totMei', '$totJun', '$totJul', '$totAgu', '$totSep', '$totOkt', '$totNov', '$totDes'] },
      },
    },
  ]);

  return p[0];
};

const sumAllow = async (id) => {
  const p = await Payroll.aggregate([
    { $match: { year: id } },
    { $unwind: '$employee' },
    {
      $group: {
        _id: {
          e0: '$employee.e0',
        },
        d0: { $first: '$employee.d0' },
        e0: { $first: '$employee.e0' },
        i0: { $last: '$employee.i0' },
        u0: { $last: '$employee.u0' },
        y0: { $last: '$employee.y0' },
        jan: { $sum: { $cond: { if: { $eq: ['$month', 0] }, then: '$employee.bk0', else: 0 } } },
        feb: { $sum: { $cond: { if: { $eq: ['$month', 1] }, then: '$employee.bk0', else: 0 } } },
        mar: { $sum: { $cond: { if: { $eq: ['$month', 2] }, then: '$employee.bk0', else: 0 } } },
        apr: { $sum: { $cond: { if: { $eq: ['$month', 3] }, then: '$employee.bk0', else: 0 } } },
        mei: { $sum: { $cond: { if: { $eq: ['$month', 4] }, then: '$employee.bk0', else: 0 } } },
        jun: { $sum: { $cond: { if: { $eq: ['$month', 5] }, then: '$employee.bk0', else: 0 } } },
        jul: { $sum: { $cond: { if: { $eq: ['$month', 6] }, then: '$employee.bk0', else: 0 } } },
        agu: { $sum: { $cond: { if: { $eq: ['$month', 7] }, then: '$employee.bk0', else: 0 } } },
        sep: { $sum: { $cond: { if: { $eq: ['$month', 8] }, then: '$employee.bk0', else: 0 } } },
        okt: { $sum: { $cond: { if: { $eq: ['$month', 9] }, then: '$employee.bk0', else: 0 } } },
        nov: { $sum: { $cond: { if: { $eq: ['$month', 10] }, then: '$employee.bk0', else: 0 } } },
        des: { $sum: { $cond: { if: { $eq: ['$month', 11] }, then: '$employee.bk0', else: 0 } } },
      },
    },
    { $sort: { '_id.e0': 1 } },
    {
      $group: {
        _id: 'summary',
        employee: {
          $push: {
            _id: '$e0',
            d0: '$d0',
            e0: '$e0',
            i0: '$i0',
            u0: '$u0',
            y0: '$y0',
            jan: '$jan',
            feb: '$feb',
            mar: '$mar',
            apr: '$apr',
            mei: '$mei',
            jun: '$jun',
            jul: '$jul',
            agu: '$agu',
            sep: '$sep',
            okt: '$okt',
            nov: '$nov',
            des: '$des',
            tAllow: { $sum: ['$jan', '$feb', '$mar', '$apr', '$mei', '$jun', '$jul', '$agu', '$sep', '$okt', '$nov', '$des'] },
          },
        },
        totJan: { $sum: '$jan' },
        totFeb: { $sum: '$feb' },
        totMar: { $sum: '$mar' },
        totApr: { $sum: '$apr' },
        totMei: { $sum: '$mei' },
        totJun: { $sum: '$jun' },
        totJul: { $sum: '$jul' },
        totAgu: { $sum: '$agu' },
        totSep: { $sum: '$sep' },
        totOkt: { $sum: '$okt' },
        totNov: { $sum: '$nov' },
        totDes: { $sum: '$des' },
      },
    },
    {
      $addFields: {
        sAllow: { $sum: ['$totJan', '$totFeb', '$totMar', '$totApr', '$totMei', '$totJun', '$totJul', '$totAgu', '$totSep', '$totOkt', '$totNov', '$totDes'] },
      },
    },
  ]);

  return p[0];
};
module.exports = {
  sumBasic,
  sumOT,
  sumAllow,
};
