const { GraphQLError } = require('graphql');
const fs = require('fs-extra');
const XLSX = require('xlsx');

const ESlip = require('../eslip/model');

// const parseDate = ({
//   D, y, m, d,
// }) => {
//   if (D > 0) return new Date(`${y}-${m}-${d}`);
//   return null;
// };

const processImportESlip = async ({ file, from, to }) => {
  const { filename, createReadStream } = await file;
  const stream = createReadStream();

  const tmp = `/tmp/${filename}`;
  return new Promise((resolve, reject) => stream
    .on('error', async (error) => {
      if (stream.truncated) await fs.unlinkSync(tmp);
      reject(error);
    })
    .pipe(fs.createWriteStream(tmp))
    .on('finish', async () => {
      const wb = XLSX.readFile(tmp);
      const ws = wb.Sheets[wb.SheetNames];
      const ft = XLSX.utils.sheet_to_json(ws);

      try {
        const eslip = new ESlip({
          from,
          to,
        });

        for (let i = 2; i < ft.length; i += 1) {
          eslip.employee.push({
            b0: ft[i].__EMPTY_1 || '', // EmpNo
            c0: ft[i].__EMPTY_2 || '', // EmpName
            e0: ft[i].__EMPTY_4 || '', // Date
            // f0: ft[i].__EMPTY_5 || '', // Month
            // g0: ft[i].__EMPTY_6 || 0, // Year
            h0: ft[i].__EMPTY_7 || '', // Email
            i0: ft[i].__EMPTY_8 || '', // BankAccount
            j0: ft[i].__EMPTY_9 || '', // Department
            k0: ft[i].__EMPTY_10 || '', // Section
            l0: ft[i].__EMPTY_11 || '', // Position
            m0: ft[i].__EMPTY_12 || '', // TaxID
            n0: ft[i].__EMPTY_13 || '', // MaritalStatus
            o0: ft[i].__EMPTY_14 || '', // JpkId
            p0: ft[i].__EMPTY_15 || '', // BPJSHealthId
            q0: ft[i].__EMPTY_16 || 0, // BasicSalary
            r0: ft[i].__EMPTY_17 || 0, // OTHour
            s0: ft[i].__EMPTY_18 || 0, // OT
            t0: ft[i].__EMPTY_19 || 0, // InsentifHour
            u0: ft[i].__EMPTY_20 || 0, // Insentif
            v0: ft[i].__EMPTY_21 || 0, // TotInsentif
            w0: ft[i].__EMPTY_22 || 0, // OfficialOTHour
            x0: ft[i].__EMPTY_23 || 0, // OfficialOT
            y0: ft[i].__EMPTY_24 || 0, // LivingFix
            z0: ft[i].__EMPTY_25 || 0, // HousingFix
            aa0: ft[i].__EMPTY_26 || 0, // FunctPosisiFix
            ab0: ft[i].__EMPTY_27 || 0, // Functional
            ac0: ft[i].__EMPTY_28 || 0, // CoordFix
            ad0: ft[i].__EMPTY_29 || 0, // TransportFix
            ae0: ft[i].__EMPTY_30 || 0, // CommuFix
            af0: ft[i].__EMPTY_31 || 0, // Expertise
            ag0: ft[i].__EMPTY_32 || 0, // HonorariumFix
            ah0: ft[i].__EMPTY_33 || 0, // PositionVariaFix
            ai0: ft[i].__EMPTY_34 || 0, // FuncVariaFix
            aj0: ft[i].__EMPTY_35 || 0, // ActingFix
            ak0: ft[i].__EMPTY_36 || 0, // OtherFix
            al0: ft[i].__EMPTY_37 || 0, // FuncNon
            am0: ft[i].__EMPTY_38 || 0, // ShiftNon
            an0: ft[i].__EMPTY_39 || 0, // TigNon
            ao0: ft[i].__EMPTY_40 || 0, // PlasmaNon
            ap0: ft[i].__EMPTY_41 || 0, // LKSNon
            aq0: ft[i].__EMPTY_42 || 0, // KopNon
            ar0: ft[i].__EMPTY_43 || 0, // QualityNon
            as0: ft[i].__EMPTY_44 || 0, // OtherNon
            at0: ft[i].__EMPTY_45 || 0, // Leave
            au0: ft[i].__EMPTY_46 || 0, // THR
            av0: ft[i].__EMPTY_47 || 0, // UangPisah
            aw0: ft[i].__EMPTY_48 || 0, // UangMasa
            ax0: ft[i].__EMPTY_49 || 0, // UangPesangon
            ay0: ft[i].__EMPTY_50 || 0, // UangHak
            az0: ft[i].__EMPTY_51 || 0, // Bonus
            ba0: ft[i].__EMPTY_52 || 0, // OtherNonTax
            bb0: ft[i].__EMPTY_53 || 0, // AbsenHour
            bc0: ft[i].__EMPTY_54 || 0, // Absen
            bd0: ft[i].__EMPTY_55 || 0, // Correct
            be0: ft[i].__EMPTY_56 || 0, // Tax
            bf0: ft[i].__EMPTY_57 || 0, // NonTax
            bg0: ft[i].__EMPTY_58 || 0, // JHT
            bh0: ft[i].__EMPTY_59 || 0, // Health
            bi0: ft[i].__EMPTY_60 || 0, // Pension
            bj0: ft[i].__EMPTY_61 || 0, // Loan
            bk0: ft[i].__EMPTY_62 || 0, // Kopkar
            bl0: ft[i].__EMPTY_63 || 0, // Canteen
            bm0: ft[i].__EMPTY_64 || 0, // Retro
            bn0: ft[i].__EMPTY_65 || 0, // UnderTax
            bo0: ft[i].__EMPTY_66 || 0, // TotDeduc
            bp0: ft[i].__EMPTY_67 || 0, // Gross
            bq0: ft[i].__EMPTY_68 || 0, // TaxReturn
            br0: ft[i].__EMPTY_69 || 0, // TotEarning
            bs0: ft[i].__EMPTY_70 || 0, // Net
            bt0: ft[i].__EMPTY_71 || '', // Note1
            bu0: ft[i].__EMPTY_72 || '', // Note2
            bv0: ft[i].__EMPTY_73 || '', // Note3
            bw0: ft[i].__EMPTY_74 || '', // DateSlip
          });
        }

        const saved = await eslip.save();
        return resolve(saved);
      } catch (err) {
        if (typeof err === 'string') {
          reject(new GraphQLError(err));
        } else {
          reject(new GraphQLError(err.message));
        }
      }

      return true;
    }));
};

module.exports = { processImportESlip };
