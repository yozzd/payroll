const { GraphQLError } = require('graphql');
const fs = require('fs-extra');
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const { xlsPass } = require('../../config');

const genXLS = async (p) => {
  try {
    const {
      period, year, dir, production, administration,
      totProduction, totAdministration, totMandiri,
      totFinalPay, totMangkirPay, totPesangonPay,
      totExpat, totRetroPay, totTool, totCanteen,
      totLoan, totKopkar, totKer, totKes, totTax,
      totPphKurangBayar, tot1, tot2, pensionProd,
      pensionAdm, totPension, totGross, totJurnal,
      totSelisih,
    } = p;
    await fs.ensureDir(`static/report/${dir}`);

    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:F66',
          A1: { t: 's', v: 'PT. LABTECH PENTA INTERNATIONAL' },
          A2: { t: 's', v: `JOURNAL - PERIODE PAYROLL: ${period} ${year}` },
          A3: { t: 's', v: 'Code' },
          B3: { t: 's', v: 'Category' },
          C3: { t: 's', v: 'Description' },
          D3: { t: 's', v: 'DR' },
          E3: { t: 's', v: 'CR' },
          F3: { t: 's', v: '' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
          ],
          '!cols': [
            { wpx: 38 }, { wpx: 212 }, { wpx: 133 }, { wpx: 75 },
            { wpx: 75 }, { wpx: 75 },
          ],
        },
      },
    };

    wb.Sheets.Sheet1.A4 = { t: 's', v: '51010' };
    wb.Sheets.Sheet1.B4 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C4 = { t: 's', v: '(Salary)' };
    wb.Sheets.Sheet1.D4 = { t: 'n', v: production.salary, z: '#,##0' };

    wb.Sheets.Sheet1.A5 = { t: 's', v: '51010' };
    wb.Sheets.Sheet1.B5 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C5 = { t: 's', v: '(Salary - Retro)' };
    wb.Sheets.Sheet1.D5 = { t: 'n', v: production.retro, z: '#,##0' };

    wb.Sheets.Sheet1.A6 = { t: 's', v: '51011' };
    wb.Sheets.Sheet1.B6 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C6 = { t: 's', v: '(OT)' };
    wb.Sheets.Sheet1.D6 = { t: 'n', v: production.ot, z: '#,##0' };

    wb.Sheets.Sheet1.A7 = { t: 's', v: '51021' };
    wb.Sheets.Sheet1.B7 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C7 = { t: 's', v: '(Accident)' };
    wb.Sheets.Sheet1.D7 = { t: 'n', v: production.accident, z: '#,##0' };

    wb.Sheets.Sheet1.A8 = { t: 's', v: '51022' };
    wb.Sheets.Sheet1.B8 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C8 = { t: 's', v: '(Death)' };
    wb.Sheets.Sheet1.D8 = { t: 'n', v: production.death, z: '#,##0' };

    wb.Sheets.Sheet1.A9 = { t: 's', v: '51023' };
    wb.Sheets.Sheet1.B9 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C9 = { t: 's', v: '(Medical)' };
    wb.Sheets.Sheet1.D9 = { t: 'n', v: production.medical, z: '#,##0' };

    wb.Sheets.Sheet1.A10 = { t: 's', v: '51024' };
    wb.Sheets.Sheet1.B10 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C10 = { t: 's', v: '(Pension)' };
    wb.Sheets.Sheet1.D10 = { t: 'n', v: production.pension, z: '#,##0' };

    wb.Sheets.Sheet1.A11 = { t: 's', v: '51030' };
    wb.Sheets.Sheet1.B11 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C11 = { t: 's', v: '(Position / Functional)' };
    wb.Sheets.Sheet1.D11 = { t: 'n', v: production.posfunc, z: '#,##0' };

    wb.Sheets.Sheet1.A12 = { t: 's', v: '51040' };
    wb.Sheets.Sheet1.B12 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C12 = { t: 's', v: '(Housing)' };
    wb.Sheets.Sheet1.D12 = { t: 'n', v: production.housing, z: '#,##0' };

    wb.Sheets.Sheet1.A13 = { t: 's', v: '51050' };
    wb.Sheets.Sheet1.B13 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C13 = { t: 's', v: '(Transport)' };
    wb.Sheets.Sheet1.D13 = { t: 'n', v: production.transport, z: '#,##0' };

    wb.Sheets.Sheet1.A14 = { t: 's', v: '51060' };
    wb.Sheets.Sheet1.B14 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C14 = { t: 's', v: '(Incentive)' };
    wb.Sheets.Sheet1.D14 = { t: 'n', v: production.incentive, z: '#,##0' };

    wb.Sheets.Sheet1.A15 = { t: 's', v: '51080' };
    wb.Sheets.Sheet1.B15 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C15 = { t: 's', v: '(Meals)' };
    wb.Sheets.Sheet1.D15 = { t: 'n', v: production.meals, z: '#,##0' };

    wb.Sheets.Sheet1.A16 = { t: 's', v: '51082' };
    wb.Sheets.Sheet1.B16 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C16 = { t: 's', v: '(Living)' };
    wb.Sheets.Sheet1.D16 = { t: 'n', v: production.living, z: '#,##0' };

    wb.Sheets.Sheet1.A17 = { t: 's', v: '51091' };
    wb.Sheets.Sheet1.B17 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C17 = { t: 's', v: '(THR)' };
    wb.Sheets.Sheet1.D17 = { t: 'n', v: production.thr, z: '#,##0' };

    wb.Sheets.Sheet1.A18 = { t: 's', v: '51092' };
    wb.Sheets.Sheet1.B18 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C18 = { t: 's', v: '(Termination)' };
    wb.Sheets.Sheet1.D18 = { t: 'n', v: production.termination, z: '#,##0' };

    wb.Sheets.Sheet1.A19 = { t: 's', v: '51093' };
    wb.Sheets.Sheet1.B19 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C19 = { t: 's', v: '(Communication)' };
    wb.Sheets.Sheet1.D19 = { t: 'n', v: production.communication, z: '#,##0' };

    wb.Sheets.Sheet1.A20 = { t: 's', v: '51099' };
    wb.Sheets.Sheet1.B20 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C20 = { t: 's', v: '(Other Allowance Taxable)' };
    wb.Sheets.Sheet1.D20 = { t: 'n', v: production.other, z: '#,##0' };

    wb.Sheets.Sheet1.A21 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B21 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C21 = { t: 's', v: '(Tax 21 Returned)' };
    wb.Sheets.Sheet1.D21 = { t: 'n', v: production.taxReturn, z: '#,##0' };

    wb.Sheets.Sheet1.A22 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B22 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C22 = { t: 's', v: '(Pengembalian Pajak DTP)' };
    wb.Sheets.Sheet1.D22 = { t: 'n', v: production.dtp, z: '#,##0' };

    wb.Sheets.Sheet1.A23 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B23 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C23 = { t: 's', v: '(Other Income)' };
    wb.Sheets.Sheet1.D23 = { t: 'n', v: production.bonus, z: '#,##0' };

    wb.Sheets.Sheet1.F24 = { t: 'n', v: totProduction, z: '#,##0' };

    wb.Sheets.Sheet1.A25 = { t: 's', v: '61001' };
    wb.Sheets.Sheet1.B25 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C25 = { t: 's', v: '(Salary)' };
    wb.Sheets.Sheet1.D25 = { t: 'n', v: administration.salary, z: '#,##0' };

    wb.Sheets.Sheet1.A26 = { t: 's', v: '61001' };
    wb.Sheets.Sheet1.B26 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C26 = { t: 's', v: '(Salary - Retro)' };
    wb.Sheets.Sheet1.D26 = { t: 'n', v: administration.retro, z: '#,##0' };

    wb.Sheets.Sheet1.A27 = { t: 's', v: '61002' };
    wb.Sheets.Sheet1.B27 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C27 = { t: 's', v: '(OT)' };
    wb.Sheets.Sheet1.D27 = { t: 'n', v: administration.ot, z: '#,##0' };

    wb.Sheets.Sheet1.A28 = { t: 's', v: '61011' };
    wb.Sheets.Sheet1.B28 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C28 = { t: 's', v: '(Accident)' };
    wb.Sheets.Sheet1.D28 = { t: 'n', v: administration.accident, z: '#,##0' };

    wb.Sheets.Sheet1.A29 = { t: 's', v: '61012' };
    wb.Sheets.Sheet1.B29 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C29 = { t: 's', v: '(Death)' };
    wb.Sheets.Sheet1.D29 = { t: 'n', v: administration.death, z: '#,##0' };

    wb.Sheets.Sheet1.A30 = { t: 's', v: '61013' };
    wb.Sheets.Sheet1.B30 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C30 = { t: 's', v: '(Medical)' };
    wb.Sheets.Sheet1.D30 = { t: 'n', v: administration.medical, z: '#,##0' };

    wb.Sheets.Sheet1.A31 = { t: 's', v: '61014' };
    wb.Sheets.Sheet1.B31 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C31 = { t: 's', v: '(Pension)' };
    wb.Sheets.Sheet1.D31 = { t: 'n', v: administration.pension, z: '#,##0' };

    wb.Sheets.Sheet1.A32 = { t: 's', v: '61020' };
    wb.Sheets.Sheet1.B32 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C32 = { t: 's', v: '(Position / Functional)' };
    wb.Sheets.Sheet1.D32 = { t: 'n', v: administration.posfunc, z: '#,##0' };

    wb.Sheets.Sheet1.A33 = { t: 's', v: '61030' };
    wb.Sheets.Sheet1.B33 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C33 = { t: 's', v: '(Housing)' };
    wb.Sheets.Sheet1.D33 = { t: 'n', v: administration.housing, z: '#,##0' };

    wb.Sheets.Sheet1.A34 = { t: 's', v: '61040' };
    wb.Sheets.Sheet1.B34 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C34 = { t: 's', v: '(Transport)' };
    wb.Sheets.Sheet1.D34 = { t: 'n', v: administration.transport, z: '#,##0' };

    wb.Sheets.Sheet1.A35 = { t: 's', v: '61050' };
    wb.Sheets.Sheet1.B35 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C35 = { t: 's', v: '(Incentive)' };
    wb.Sheets.Sheet1.D35 = { t: 'n', v: administration.incentive, z: '#,##0' };

    wb.Sheets.Sheet1.A36 = { t: 's', v: '61051' };
    wb.Sheets.Sheet1.B36 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C36 = { t: 's', v: '(Communication)' };
    wb.Sheets.Sheet1.D36 = { t: 'n', v: administration.communication, z: '#,##0' };

    wb.Sheets.Sheet1.A37 = { t: 's', v: '61052' };
    wb.Sheets.Sheet1.B37 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C37 = { t: 's', v: '(Living)' };
    wb.Sheets.Sheet1.D37 = { t: 'n', v: administration.living, z: '#,##0' };

    wb.Sheets.Sheet1.A38 = { t: 's', v: '61060' };
    wb.Sheets.Sheet1.B38 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C38 = { t: 's', v: '(Meals)' };
    wb.Sheets.Sheet1.D38 = { t: 'n', v: administration.meals, z: '#,##0' };

    wb.Sheets.Sheet1.A39 = { t: 's', v: '61070' };
    wb.Sheets.Sheet1.B39 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C39 = { t: 's', v: '(THR)' };
    wb.Sheets.Sheet1.D39 = { t: 'n', v: administration.thr, z: '#,##0' };

    wb.Sheets.Sheet1.A40 = { t: 's', v: '61080' };
    wb.Sheets.Sheet1.B40 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C40 = { t: 's', v: '(Termination)' };
    wb.Sheets.Sheet1.D40 = { t: 'n', v: administration.termination, z: '#,##0' };

    wb.Sheets.Sheet1.A41 = { t: 's', v: '61090' };
    wb.Sheets.Sheet1.B41 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C41 = { t: 's', v: '(Other Allowance Taxable)' };
    wb.Sheets.Sheet1.D41 = { t: 'n', v: administration.other, z: '#,##0' };

    wb.Sheets.Sheet1.A42 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B42 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C42 = { t: 's', v: '(Tax 21 Returned)' };
    wb.Sheets.Sheet1.D42 = { t: 'n', v: administration.taxReturn, z: '#,##0' };
    wb.Sheets.Sheet1.E42 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F42 = { t: 's', v: '' };

    wb.Sheets.Sheet1.B43 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C43 = { t: 's', v: '(Pengembalian Pajak DTP)' };
    wb.Sheets.Sheet1.D43 = { t: 'n', v: administration.dtp, z: '#,##0' };

    wb.Sheets.Sheet1.B44 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C44 = { t: 's', v: '(Other Income)' };
    wb.Sheets.Sheet1.D44 = { t: 'n', v: administration.bonus, z: '#,##0' };

    wb.Sheets.Sheet1.F45 = { t: 'n', v: totAdministration, z: '#,##0' };

    wb.Sheets.Sheet1.A46 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B46 = { t: 's', v: 'Salaries Payable (Total Trf. By Mandiri)' };
    wb.Sheets.Sheet1.E46 = { t: 'n', v: totMandiri, z: '#,##0' };

    wb.Sheets.Sheet1.A47 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B47 = { t: 's', v: 'Salaries Payable (Total Final Pay)' };
    wb.Sheets.Sheet1.E47 = { t: 'n', v: totFinalPay, z: '#,##0' };

    wb.Sheets.Sheet1.A48 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B48 = { t: 's', v: 'Salaries Payable (Total Final Pay Mangkir)' };
    wb.Sheets.Sheet1.E48 = { t: 'n', v: totMangkirPay, z: '#,##0' };

    wb.Sheets.Sheet1.A49 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B49 = { t: 's', v: 'Salaries Payable (Total Final Pay Pesangon)' };
    wb.Sheets.Sheet1.E49 = { t: 'n', v: totPesangonPay, z: '#,##0' };

    wb.Sheets.Sheet1.A50 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B50 = { t: 's', v: 'Salaries Payable (Total Expatriat Salary)' };
    wb.Sheets.Sheet1.E50 = { t: 'n', v: totExpat, z: '#,##0' };

    wb.Sheets.Sheet1.A51 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B51 = { t: 's', v: 'Salaries Payable (Total Retro Pay)' };
    wb.Sheets.Sheet1.E51 = { t: 'n', v: totRetroPay, z: '#,##0' };

    wb.Sheets.Sheet1.A52 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B52 = { t: 's', v: 'Salaries Payable (Pemotongan Toolrom)' };
    wb.Sheets.Sheet1.E52 = { t: 'n', v: totTool, z: '#,##0' };

    wb.Sheets.Sheet1.A53 = { t: 's', v: '21621' };
    wb.Sheets.Sheet1.B53 = { t: 's', v: 'Canteen' };
    wb.Sheets.Sheet1.E53 = { t: 'n', v: totCanteen, z: '#,##0' };

    wb.Sheets.Sheet1.A54 = { t: 's', v: '21624' };
    wb.Sheets.Sheet1.B54 = { t: 's', v: 'Closing Advance (Dana Pinjaman)' };
    wb.Sheets.Sheet1.E54 = { t: 'n', v: totLoan, z: '#,##0' };

    wb.Sheets.Sheet1.A55 = { t: 's', v: '21619' };
    wb.Sheets.Sheet1.B55 = { t: 's', v: 'Koperasi Karyawan)' };
    wb.Sheets.Sheet1.E55 = { t: 'n', v: totKopkar, z: '#,##0' };

    wb.Sheets.Sheet1.A56 = { t: 's', v: '21612' };
    wb.Sheets.Sheet1.B56 = { t: 's', v: 'Astek Payable (BPJS Ketenagakerjaan)' };
    wb.Sheets.Sheet1.E56 = { t: 'n', v: totKer, z: '#,##0' };

    wb.Sheets.Sheet1.A57 = { t: 's', v: '21612' };
    wb.Sheets.Sheet1.B57 = { t: 's', v: 'Astek Payable (BPJS Kesehatan)' };
    wb.Sheets.Sheet1.E57 = { t: 'n', v: totKes, z: '#,##0' };

    wb.Sheets.Sheet1.A58 = { t: 's', v: '21310' };
    wb.Sheets.Sheet1.B58 = { t: 's', v: 'Tax Payable Pph 21' };
    wb.Sheets.Sheet1.E58 = { t: 'n', v: totTax, z: '#,##0' };

    wb.Sheets.Sheet1.A59 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B59 = { t: 's', v: 'Pph 21 Kurang Bayar' };
    wb.Sheets.Sheet1.E59 = { t: 'n', v: totPphKurangBayar, z: '#,##0' };

    wb.Sheets.Sheet1.C60 = { t: 's', v: 'TOTAL' };
    wb.Sheets.Sheet1.D60 = { t: 'n', v: tot1, z: '#,##0' };
    wb.Sheets.Sheet1.E60 = { t: 'n', v: tot2, z: '#,##0' };

    wb.Sheets.Sheet1.A61 = { t: 's', v: '51024' };
    wb.Sheets.Sheet1.B61 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C61 = { t: 's', v: '(Pension)' };
    wb.Sheets.Sheet1.D61 = { t: 'n', v: pensionProd, z: '#,##0' };

    wb.Sheets.Sheet1.A62 = { t: 's', v: '61014' };
    wb.Sheets.Sheet1.B62 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C62 = { t: 's', v: '(Pension)' };
    wb.Sheets.Sheet1.D62 = { t: 'n', v: pensionAdm, z: '#,##0' };

    wb.Sheets.Sheet1.D63 = { t: 'n', v: totPension, z: '#,##0' };

    wb.Sheets.Sheet1.C64 = { t: 's', v: 'Gross' };
    wb.Sheets.Sheet1.D64 = { t: 'n', v: totGross, z: '#,##0' };

    wb.Sheets.Sheet1.C65 = { t: 's', v: 'Jurnal - Pensiun' };
    wb.Sheets.Sheet1.D65 = { t: 'n', v: totJurnal, z: '#,##0' };

    wb.Sheets.Sheet1.C66 = { t: 's', v: 'Selisih' };
    wb.Sheets.Sheet1.D66 = { t: 'n', v: totSelisih, z: '#,##0' };

    const fn = `static/report/${dir}/${dir}_journal.xlsx`;
    const content = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', bookSST: false });
    fs.writeFileSync(fn, content);

    return XlsxPopulate.fromFileAsync(fn)
      .then((workbook) => workbook.toFileAsync(fn, { password: xlsPass })
        .then(() => ({ sStatus: 1 })));
  } catch (err) {
    if (typeof err === 'string') {
      throw new GraphQLError(err);
    } else {
      throw new GraphQLError(err.message);
    }
  }
};

module.exports = {
  genXLS,
};
