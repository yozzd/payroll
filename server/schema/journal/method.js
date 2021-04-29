const { GraphQLError } = require('graphql');
const fs = require('fs-extra');
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');
const { xlsPass } = require('../../config');

const { intpre0v2 } = require('../scalar/number');

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
          '!ref': 'A1:F64',
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
        },
      },
    };

    wb.Sheets.Sheet1.A4 = { t: 's', v: '51010' };
    wb.Sheets.Sheet1.B4 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C4 = { t: 's', v: '(Salary)' };
    wb.Sheets.Sheet1.D4 = { t: 'n', v: intpre0v2(production.salary).format() };
    wb.Sheets.Sheet1.E4 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F4 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A5 = { t: 's', v: '51010' };
    wb.Sheets.Sheet1.B5 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C5 = { t: 's', v: '(Salary - Retro)' };
    wb.Sheets.Sheet1.D5 = { t: 'n', v: intpre0v2(production.retro).format() };
    wb.Sheets.Sheet1.E5 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F5 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A6 = { t: 's', v: '51011' };
    wb.Sheets.Sheet1.B6 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C6 = { t: 's', v: '(OT)' };
    wb.Sheets.Sheet1.D6 = { t: 'n', v: intpre0v2(production.ot).format() };
    wb.Sheets.Sheet1.E6 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F6 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A7 = { t: 's', v: '51021' };
    wb.Sheets.Sheet1.B7 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C7 = { t: 's', v: '(Accident)' };
    wb.Sheets.Sheet1.D7 = { t: 'n', v: intpre0v2(production.accident).format() };
    wb.Sheets.Sheet1.E7 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F7 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A8 = { t: 's', v: '51022' };
    wb.Sheets.Sheet1.B8 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C8 = { t: 's', v: '(Death)' };
    wb.Sheets.Sheet1.D8 = { t: 'n', v: intpre0v2(production.death).format() };
    wb.Sheets.Sheet1.E8 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F8 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A9 = { t: 's', v: '51023' };
    wb.Sheets.Sheet1.B9 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C9 = { t: 's', v: '(Medical)' };
    wb.Sheets.Sheet1.D9 = { t: 'n', v: intpre0v2(production.medical).format() };
    wb.Sheets.Sheet1.E9 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F9 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A10 = { t: 's', v: '51024' };
    wb.Sheets.Sheet1.B10 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C10 = { t: 's', v: '(Pension)' };
    wb.Sheets.Sheet1.D10 = { t: 'n', v: intpre0v2(production.pension).format() };
    wb.Sheets.Sheet1.E10 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F10 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A11 = { t: 's', v: '51030' };
    wb.Sheets.Sheet1.B11 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C11 = { t: 's', v: '(Position / Functional)' };
    wb.Sheets.Sheet1.D11 = { t: 'n', v: intpre0v2(production.posfunc).format() };
    wb.Sheets.Sheet1.E11 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F11 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A12 = { t: 's', v: '51040' };
    wb.Sheets.Sheet1.B12 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C12 = { t: 's', v: '(Housing)' };
    wb.Sheets.Sheet1.D12 = { t: 'n', v: intpre0v2(production.housing).format() };
    wb.Sheets.Sheet1.E12 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F12 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A13 = { t: 's', v: '51050' };
    wb.Sheets.Sheet1.B13 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C13 = { t: 's', v: '(Transport)' };
    wb.Sheets.Sheet1.D13 = { t: 'n', v: intpre0v2(production.transport).format() };
    wb.Sheets.Sheet1.E13 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F13 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A14 = { t: 's', v: '51060' };
    wb.Sheets.Sheet1.B14 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C14 = { t: 's', v: '(Incentive)' };
    wb.Sheets.Sheet1.D14 = { t: 'n', v: intpre0v2(production.incentive).format() };
    wb.Sheets.Sheet1.E14 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F14 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A15 = { t: 's', v: '51080' };
    wb.Sheets.Sheet1.B15 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C15 = { t: 's', v: '(Meals)' };
    wb.Sheets.Sheet1.D15 = { t: 'n', v: intpre0v2(production.meals).format() };
    wb.Sheets.Sheet1.E15 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F15 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A16 = { t: 's', v: '51082' };
    wb.Sheets.Sheet1.B16 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C16 = { t: 's', v: '(Living)' };
    wb.Sheets.Sheet1.D16 = { t: 'n', v: intpre0v2(production.living).format() };
    wb.Sheets.Sheet1.E16 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F16 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A17 = { t: 's', v: '51091' };
    wb.Sheets.Sheet1.B17 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C17 = { t: 's', v: '(THR)' };
    wb.Sheets.Sheet1.D17 = { t: 'n', v: intpre0v2(production.thr).format() };
    wb.Sheets.Sheet1.E17 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F17 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A18 = { t: 's', v: '51092' };
    wb.Sheets.Sheet1.B18 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C18 = { t: 's', v: '(Termination)' };
    wb.Sheets.Sheet1.D18 = { t: 'n', v: intpre0v2(production.termination).format() };
    wb.Sheets.Sheet1.E18 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F18 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A19 = { t: 's', v: '51093' };
    wb.Sheets.Sheet1.B19 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C19 = { t: 's', v: '(Communication)' };
    wb.Sheets.Sheet1.D19 = { t: 'n', v: intpre0v2(production.communication).format() };
    wb.Sheets.Sheet1.E19 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F19 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A20 = { t: 's', v: '51099' };
    wb.Sheets.Sheet1.B20 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C20 = { t: 's', v: '(Other Allowance Taxable)' };
    wb.Sheets.Sheet1.D20 = { t: 'n', v: intpre0v2(production.other).format() };
    wb.Sheets.Sheet1.E20 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F20 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A21 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B21 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C21 = { t: 's', v: '(Tax 21 Returned)' };
    wb.Sheets.Sheet1.D21 = { t: 'n', v: intpre0v2(production.taxReturn).format() };
    wb.Sheets.Sheet1.E21 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F21 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A22 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B22 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C22 = { t: 's', v: '(Pengembalian Pajak DTP)' };
    wb.Sheets.Sheet1.D22 = { t: 'n', v: intpre0v2(production.dtp).format() };
    wb.Sheets.Sheet1.E22 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F22 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A23 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B23 = { t: 's', v: '' };
    wb.Sheets.Sheet1.C23 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D23 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E23 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F23 = { t: 'n', v: intpre0v2(totProduction).format() };

    wb.Sheets.Sheet1.A24 = { t: 's', v: '61001' };
    wb.Sheets.Sheet1.B24 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C24 = { t: 's', v: '(Salary)' };
    wb.Sheets.Sheet1.D24 = { t: 'n', v: intpre0v2(administration.salary).format() };
    wb.Sheets.Sheet1.E24 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F24 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A25 = { t: 's', v: '61001' };
    wb.Sheets.Sheet1.B25 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C25 = { t: 's', v: '(Salary - Retro)' };
    wb.Sheets.Sheet1.D25 = { t: 'n', v: intpre0v2(administration.retro).format() };
    wb.Sheets.Sheet1.E25 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F25 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A26 = { t: 's', v: '61002' };
    wb.Sheets.Sheet1.B26 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C26 = { t: 's', v: '(OT)' };
    wb.Sheets.Sheet1.D26 = { t: 'n', v: intpre0v2(administration.ot).format() };
    wb.Sheets.Sheet1.E26 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F26 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A27 = { t: 's', v: '61011' };
    wb.Sheets.Sheet1.B27 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C27 = { t: 's', v: '(Accident)' };
    wb.Sheets.Sheet1.D27 = { t: 'n', v: intpre0v2(administration.accident).format() };
    wb.Sheets.Sheet1.E27 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F27 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A28 = { t: 's', v: '61012' };
    wb.Sheets.Sheet1.B28 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C28 = { t: 's', v: '(Death)' };
    wb.Sheets.Sheet1.D28 = { t: 'n', v: intpre0v2(administration.death).format() };
    wb.Sheets.Sheet1.E28 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F28 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A29 = { t: 's', v: '61013' };
    wb.Sheets.Sheet1.B29 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C29 = { t: 's', v: '(Medical)' };
    wb.Sheets.Sheet1.D29 = { t: 'n', v: intpre0v2(administration.medical).format() };
    wb.Sheets.Sheet1.E29 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F29 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A30 = { t: 's', v: '61014' };
    wb.Sheets.Sheet1.B30 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C30 = { t: 's', v: '(Pension)' };
    wb.Sheets.Sheet1.D30 = { t: 'n', v: intpre0v2(administration.pension).format() };
    wb.Sheets.Sheet1.E30 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F30 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A31 = { t: 's', v: '61020' };
    wb.Sheets.Sheet1.B31 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C31 = { t: 's', v: '(Position / Functional)' };
    wb.Sheets.Sheet1.D31 = { t: 'n', v: intpre0v2(administration.posfunc).format() };
    wb.Sheets.Sheet1.E31 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F31 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A32 = { t: 's', v: '61030' };
    wb.Sheets.Sheet1.B32 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C32 = { t: 's', v: '(Housing)' };
    wb.Sheets.Sheet1.D32 = { t: 'n', v: intpre0v2(administration.housing).format() };
    wb.Sheets.Sheet1.E32 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F32 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A33 = { t: 's', v: '61040' };
    wb.Sheets.Sheet1.B33 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C33 = { t: 's', v: '(Transport)' };
    wb.Sheets.Sheet1.D33 = { t: 'n', v: intpre0v2(administration.transport).format() };
    wb.Sheets.Sheet1.E33 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F33 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A34 = { t: 's', v: '61050' };
    wb.Sheets.Sheet1.B34 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C34 = { t: 's', v: '(Incentive)' };
    wb.Sheets.Sheet1.D34 = { t: 'n', v: intpre0v2(administration.incentive).format() };
    wb.Sheets.Sheet1.E34 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F34 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A35 = { t: 's', v: '61051' };
    wb.Sheets.Sheet1.B35 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C35 = { t: 's', v: '(Communication)' };
    wb.Sheets.Sheet1.D35 = { t: 'n', v: intpre0v2(administration.communication).format() };
    wb.Sheets.Sheet1.E35 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F35 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A36 = { t: 's', v: '61052' };
    wb.Sheets.Sheet1.B36 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C36 = { t: 's', v: '(Living)' };
    wb.Sheets.Sheet1.D36 = { t: 'n', v: intpre0v2(administration.living).format() };
    wb.Sheets.Sheet1.E36 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F36 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A37 = { t: 's', v: '61060' };
    wb.Sheets.Sheet1.B37 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C37 = { t: 's', v: '(Meals)' };
    wb.Sheets.Sheet1.D37 = { t: 'n', v: intpre0v2(administration.meals).format() };
    wb.Sheets.Sheet1.E37 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F37 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A38 = { t: 's', v: '61070' };
    wb.Sheets.Sheet1.B38 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C38 = { t: 's', v: '(THR)' };
    wb.Sheets.Sheet1.D38 = { t: 'n', v: intpre0v2(administration.thr).format() };
    wb.Sheets.Sheet1.E38 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F38 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A39 = { t: 's', v: '61080' };
    wb.Sheets.Sheet1.B39 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C39 = { t: 's', v: '(Termination)' };
    wb.Sheets.Sheet1.D39 = { t: 'n', v: intpre0v2(administration.termination).format() };
    wb.Sheets.Sheet1.E39 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F39 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A40 = { t: 's', v: '61090' };
    wb.Sheets.Sheet1.B40 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C40 = { t: 's', v: '(Other Allowance Taxable)' };
    wb.Sheets.Sheet1.D40 = { t: 'n', v: intpre0v2(administration.other).format() };
    wb.Sheets.Sheet1.E40 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F40 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A41 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B41 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C41 = { t: 's', v: '(Tax 21 Returned)' };
    wb.Sheets.Sheet1.D41 = { t: 'n', v: intpre0v2(administration.taxReturn).format() };
    wb.Sheets.Sheet1.E41 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F41 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A42 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B42 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C42 = { t: 's', v: '(Pengembalian Pajak DTP)' };
    wb.Sheets.Sheet1.D42 = { t: 'n', v: intpre0v2(administration.dtp).format() };
    wb.Sheets.Sheet1.E42 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F42 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A43 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B43 = { t: 's', v: '' };
    wb.Sheets.Sheet1.C43 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D43 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E43 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F43 = { t: 'n', v: intpre0v2(totAdministration).format() };

    wb.Sheets.Sheet1.A44 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B44 = { t: 's', v: 'Salaries Payable (Total Trf. By Mandiri)' };
    wb.Sheets.Sheet1.C44 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D44 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E44 = { t: 'n', v: intpre0v2(totMandiri).format() };
    wb.Sheets.Sheet1.F44 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A45 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B45 = { t: 's', v: 'Salaries Payable (Total Final Pay)' };
    wb.Sheets.Sheet1.C45 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D45 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E45 = { t: 'n', v: intpre0v2(totFinalPay).format() };
    wb.Sheets.Sheet1.F45 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A46 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B46 = { t: 's', v: 'Salaries Payable (Total Final Pay Mangkir)' };
    wb.Sheets.Sheet1.C46 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D46 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E46 = { t: 'n', v: intpre0v2(totMangkirPay).format() };
    wb.Sheets.Sheet1.F46 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A47 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B47 = { t: 's', v: 'Salaries Payable (Total Final Pay Pesangon)' };
    wb.Sheets.Sheet1.C47 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D47 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E47 = { t: 'n', v: intpre0v2(totPesangonPay).format() };
    wb.Sheets.Sheet1.F47 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A48 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B48 = { t: 's', v: 'Salaries Payable (Total Expatriat Salary)' };
    wb.Sheets.Sheet1.C48 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D48 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E48 = { t: 'n', v: intpre0v2(totExpat).format() };
    wb.Sheets.Sheet1.F48 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A49 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B49 = { t: 's', v: 'Salaries Payable (Total Retro Pay)' };
    wb.Sheets.Sheet1.C49 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D49 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E49 = { t: 'n', v: intpre0v2(totRetroPay).format() };
    wb.Sheets.Sheet1.F49 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A50 = { t: 's', v: '21510' };
    wb.Sheets.Sheet1.B50 = { t: 's', v: 'Salaries Payable (Pemotongan Toolrom)' };
    wb.Sheets.Sheet1.C50 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D50 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E50 = { t: 'n', v: intpre0v2(totTool).format() };
    wb.Sheets.Sheet1.F50 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A51 = { t: 's', v: '21621' };
    wb.Sheets.Sheet1.B51 = { t: 's', v: 'Canteen' };
    wb.Sheets.Sheet1.C51 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D51 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E51 = { t: 'n', v: intpre0v2(totCanteen).format() };
    wb.Sheets.Sheet1.F51 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A52 = { t: 's', v: '21624' };
    wb.Sheets.Sheet1.B52 = { t: 's', v: 'Closing Advance (Dana Pinjaman)' };
    wb.Sheets.Sheet1.C52 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D52 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E52 = { t: 'n', v: intpre0v2(totLoan).format() };
    wb.Sheets.Sheet1.F52 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A53 = { t: 's', v: '21619' };
    wb.Sheets.Sheet1.B53 = { t: 's', v: 'Koperasi Karyawan)' };
    wb.Sheets.Sheet1.C53 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D53 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E53 = { t: 'n', v: intpre0v2(totKopkar).format() };
    wb.Sheets.Sheet1.F53 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A54 = { t: 's', v: '21612' };
    wb.Sheets.Sheet1.B54 = { t: 's', v: 'Astek Payable (BPJS Ketenagakerjaan)' };
    wb.Sheets.Sheet1.C54 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D54 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E54 = { t: 'n', v: intpre0v2(totKer).format() };
    wb.Sheets.Sheet1.F54 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A55 = { t: 's', v: '21612' };
    wb.Sheets.Sheet1.B55 = { t: 's', v: 'Astek Payable (BPJS Kesehatan)' };
    wb.Sheets.Sheet1.C55 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D55 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E55 = { t: 'n', v: intpre0v2(totKes).format() };
    wb.Sheets.Sheet1.F55 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A56 = { t: 's', v: '21310' };
    wb.Sheets.Sheet1.B56 = { t: 's', v: 'Tax Payable Pph 21' };
    wb.Sheets.Sheet1.C56 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D56 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E56 = { t: 'n', v: intpre0v2(totTax).format() };
    wb.Sheets.Sheet1.F56 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A57 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B57 = { t: 's', v: 'Pph 21 Kurang Bayar' };
    wb.Sheets.Sheet1.C57 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D57 = { t: 's', v: '' };
    wb.Sheets.Sheet1.E57 = { t: 'n', v: intpre0v2(totPphKurangBayar).format() };
    wb.Sheets.Sheet1.F57 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A58 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B58 = { t: 's', v: '' };
    wb.Sheets.Sheet1.C58 = { t: 's', v: 'TOTAL' };
    wb.Sheets.Sheet1.D58 = { t: 'n', v: intpre0v2(tot1).format() };
    wb.Sheets.Sheet1.E58 = { t: 'n', v: intpre0v2(tot2).format() };
    wb.Sheets.Sheet1.F58 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A59 = { t: 's', v: '51024' };
    wb.Sheets.Sheet1.B59 = { t: 's', v: 'Production - Labor Cost' };
    wb.Sheets.Sheet1.C59 = { t: 's', v: '(Pension)' };
    wb.Sheets.Sheet1.D59 = { t: 'n', v: intpre0v2(pensionProd).format() };
    wb.Sheets.Sheet1.E59 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F59 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A60 = { t: 's', v: '61014' };
    wb.Sheets.Sheet1.B60 = { t: 's', v: 'Administration - Payroll Exp' };
    wb.Sheets.Sheet1.C60 = { t: 's', v: '(Pension)' };
    wb.Sheets.Sheet1.D60 = { t: 'n', v: intpre0v2(pensionAdm).format() };
    wb.Sheets.Sheet1.E60 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F60 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A61 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B61 = { t: 's', v: '' };
    wb.Sheets.Sheet1.C61 = { t: 's', v: '' };
    wb.Sheets.Sheet1.D61 = { t: 'n', v: intpre0v2(totPension).format() };
    wb.Sheets.Sheet1.E61 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F61 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A62 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B62 = { t: 's', v: '' };
    wb.Sheets.Sheet1.C62 = { t: 's', v: 'Gross' };
    wb.Sheets.Sheet1.D62 = { t: 'n', v: intpre0v2(totGross).format() };
    wb.Sheets.Sheet1.E62 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F62 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A63 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B63 = { t: 's', v: '' };
    wb.Sheets.Sheet1.C63 = { t: 's', v: 'Jurnal - Pensiun' };
    wb.Sheets.Sheet1.D63 = { t: 'n', v: intpre0v2(totJurnal).format() };
    wb.Sheets.Sheet1.E63 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F63 = { t: 's', v: '' };

    wb.Sheets.Sheet1.A64 = { t: 's', v: '' };
    wb.Sheets.Sheet1.B64 = { t: 's', v: '' };
    wb.Sheets.Sheet1.C64 = { t: 's', v: 'Selisih' };
    wb.Sheets.Sheet1.D64 = { t: 'n', v: intpre0v2(totSelisih).format() };
    wb.Sheets.Sheet1.E64 = { t: 's', v: '' };
    wb.Sheets.Sheet1.F64 = { t: 's', v: '' };

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
