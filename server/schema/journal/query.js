const Payroll = require('../payroll/model.js');

const journal = async (id) => {
  const p = await Payroll.aggregate([
    { $match: { _id: id } },
    { $unwind: '$employee' },
    {
      $group: {
        _id: {
          id: '$_id',
          category: '$employee.category',
        },
        period: { $first: '$period' },
        year: { $first: '$year' },
        dir: { $first: '$dir' },
        l0: { $sum: '$employee.l0' },
        cy0: { $sum: '$employee.cy0' },
        df0: { $sum: '$employee.df0' },
        bk0: { $sum: '$employee.bk0' },
        cn0: { $sum: '$employee.cn0' },
        en0: { $sum: '$employee.en0' },
        eq0: { $sum: '$employee.eq0' },
        dn0: { $sum: '$employee.dn0' },
        bonus: { $sum: '$employee.dr0' },
        retro: { $sum: '$employee.bu0' },
        ot: { $sum: '$employee.ai0' },
        accident: { $sum: '$employee.cb0' },
        death: { $sum: '$employee.cc0' },
        medical: { $sum: '$employee.cq0' },
        pension: { $sum: '$employee.cg0' },
        posfunc: { $sum: '$employee.ef0' },
        housing: { $sum: '$employee.eg0' },
        transport: { $sum: '$employee.eh0' },
        incentive: { $sum: '$employee.ei0' },
        meals: { $sum: '$employee.ej0' },
        living: { $sum: '$employee.ek0' },
        communication: { $sum: '$employee.el0' },
        other: { $sum: '$employee.em0' },
        thr: { $sum: '$employee.bx0' },
        termination: { $sum: '$employee.eo0' },
        taxReturn: { $sum: '$employee.bv0' },
        dtp: { $sum: '$employee.es0' },
        ec0: { $sum: '$employee.ec0' },
        finalPay: { $sum: { $cond: { if: { $and: [{ $eq: ['$employee.ex0', true] }, { $ne: ['$employee.ff0', true] }] }, then: '$employee.ed0', else: 0 } } },
        ed0: { $sum: '$employee.ed0' },
        retroPay: { $sum: '$employee.di0' },
        toolroom: { $sum: '$employee.dh0' },
        canteen: { $sum: '$employee.dl0' },
        loan: { $sum: '$employee.dk0' },
        kopkar: { $sum: '$employee.dm0' },
        ker: { $sum: '$employee.cm0' },
        kes: { $sum: '$employee.cu0' },
        taxPay: { $sum: '$employee.db0' },
        pesangonPay: { $sum: { $cond: { if: { $eq: ['$employee.ff0', true] }, then: '$employee.ed0', else: 0 } } },
        mangkirPay: { $sum: { $cond: { if: { $eq: ['$employee.fg0', true] }, then: '$employee.ed0', else: 0 } } },
      },
    },
    {
      $addFields: {
        salary: { $subtract: ['$l0', { $sum: ['$cy0', '$df0'] }] },
        expat: { $subtract: ['$ed0', { $sum: ['$finalPay', '$pesangonPay', '$mangkirPay'] }] },
        gross: {
          $subtract: [
            { $sum: ['$l0', '$ot', '$bk0', '$cn0', '$retro', '$en0', '$eq0', '$bonus'] },
            { $sum: ['$cy0', '$df0'] },
          ],
        },
      },
    },
    {
      $group: {
        _id: '$_id.id',
        period: { $first: '$period' },
        year: { $first: '$year' },
        dir: { $first: '$dir' },
        cat: {
          $push: {
            category: '$_id.category',
            salary: '$salary',
            retro: '$retro',
            ot: '$ot',
            accident: '$accident',
            death: '$death',
            medical: '$medical',
            pension: '$pension',
            posfunc: '$posfunc',
            housing: '$housing',
            transport: '$transport',
            incentive: '$incentive',
            meals: '$meals',
            living: '$living',
            communication: '$communication',
            other: '$other',
            thr: '$thr',
            termination: '$termination',
            taxReturn: '$taxReturn',
            dtp: '$dtp',
            bonus: '$bonus',
          },
        },
        totMandiri: { $sum: '$ec0' },
        totFinalPay: { $sum: '$finalPay' },
        totExpat: { $sum: '$expat' },
        totRetroPay: { $sum: '$retroPay' },
        totTool: { $sum: '$toolroom' },
        totCanteen: { $sum: '$canteen' },
        totLoan: { $sum: '$loan' },
        totKopkar: { $sum: '$kopkar' },
        totKer: { $sum: '$ker' },
        totKes: { $sum: '$kes' },
        totTax: { $sum: '$taxPay' },
        totPension: { $sum: '$pension' },
        totGross: { $sum: '$gross' },
        totPesangonPay: { $sum: '$pesangonPay' },
        totMangkirPay: { $sum: '$mangkirPay' },
        totPphKurangBayar: { $sum: '$dn0' },
      },
    },
    {
      $addFields: {
        tot2: {
          $sum: [
            '$totMandiri', '$totFinalPay', '$totExpat', '$totRetroPay', '$totTool',
            '$totCanteen', '$totLoan', '$totKopkar', '$totKer', '$totKes', '$totTax',
            '$totPesangonPay', '$totMangkirPay', '$totPphKurangBayar',
          ],
        },
        production: {
          $let: {
            vars: {
              f: { $arrayElemAt: ['$cat', 0] },
              l: { $arrayElemAt: ['$cat', 1] },
            },
            in: { $cond: { if: { $eq: ['$$f.category', 1] }, then: '$$f', else: '$$l' } },
          },
        },
        administration: {
          $let: {
            vars: {
              f: { $arrayElemAt: ['$cat', 0] },
              l: { $arrayElemAt: ['$cat', 1] },
            },
            in: { $cond: { if: { $eq: ['$$f.category', 0] }, then: '$$f', else: '$$l' } },
          },
        },
      },
    },
    {
      $project: {
        period: '$period',
        year: '$year',
        dir: '$dir',
        production: '$production',
        administration: '$administration',
        totMandiri: '$totMandiri',
        totFinalPay: '$totFinalPay',
        totExpat: '$totExpat',
        totRetroPay: '$totRetroPay',
        totTool: '$totTool',
        totCanteen: '$totCanteen',
        totLoan: '$totLoan',
        totKopkar: '$totKopkar',
        totKer: '$totKer',
        totKes: '$totKes',
        totTax: '$totTax',
        totProduction: {
          $sum: [
            '$production.salary', '$production.retro', '$production.ot', '$production.accident', '$production.death', '$production.medical',
            '$production.pension', '$production.posfunc', '$production.housing', '$production.transport', '$production.incentive',
            '$production.meals', '$production.living', '$production.communication', '$production.other', '$production.thr', '$production.termination',
            '$production.taxReturn', '$production.dtp', '$production.bonus',
          ],
        },
        totAdministration: {
          $sum: [
            '$administration.salary', '$administration.retro', '$administration.ot', '$administration.accident', '$administration.death', '$administration.medical',
            '$administration.pension', '$administration.posfunc', '$administration.housing', '$administration.transport', '$administration.incentive',
            '$administration.meals', '$administration.living', '$administration.communication', '$administration.other', '$administration.thr', '$administration.termination',
            '$administration.taxReturn', '$administration.dtp', '$administration.bonus',
          ],
        },
        tot2: '$tot2',
        pensionProd: '$production.pension',
        pensionAdm: '$administration.pension',
        totPension: '$totPension',
        totGross: '$totGross',
        totPesangonPay: '$totPesangonPay',
        totMangkirPay: '$totMangkirPay',
        totPphKurangBayar: '$totPphKurangBayar',
      },
    },
    {
      $addFields: {
        tot1: { $sum: ['$totProduction', '$totAdministration'] },
      },
    },
    {
      $addFields: {
        tot3: { $subtract: [{ $round: ['$tot1', 0] }, { $round: ['$tot2', 0] }] },
        totJurnal: { $subtract: ['$tot1', '$totPension'] },
        totSelisih: { $abs: { $subtract: ['$totGross', { $subtract: ['$tot1', '$totPension'] }] } },
      },
    },
  ]);

  return p[0];
};

module.exports = {
  journal,
};
