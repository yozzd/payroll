const { GraphQLError } = require('graphql');
const fs = require('fs-extra');
const XLSX = require('xlsx');

const Payroll = require('../payroll/model');
const ESlip = require('../eslip/model');

const parseDate = ({
  D, y, m, d,
}) => {
  if (D > 0) return new Date(`${y}-${m}-${d}`);
  return null;
};

const processImportPayroll = async ({ file, from, to }) => {
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
        const payroll = new Payroll({
          from,
          to,
          rate: {
            b4: ft[2].__EMPTY_1 || 0, // TK/0
            b5: ft[3].__EMPTY_1 || 0, // TK/1
            b6: ft[4].__EMPTY_1 || 0, // TK/2
            b7: ft[5].__EMPTY_1 || 0, // TK/3
            b8: ft[6].__EMPTY_1 || 0, // K/0
            b9: ft[7].__EMPTY_1 || 0, // K/1
            b10: ft[8].__EMPTY_1 || 0, // K/2
            b11: ft[9].__EMPTY_1 || 0, // K/3
            b14: ft[12].__EMPTY_1 || 0, // Upah Minimum BPJS Kesehatan
            b15: ft[13].__EMPTY_1 || 0, // Upah Maximum BPJS Kesehatan
            b17: ft[15].__EMPTY_1 || 0, // Upah Minimum BPJS Ketenagakerjaan
            b18: ft[16].__EMPTY_1 || 0, // Upah Maximum BPJS Ketenagakerjaan
            cb5: ft[3].__EMPTY_79 || 0, // %JKK Perusahaan
            cc5: ft[3].__EMPTY_80 || 0, // %JK Perusahaan
            cd5: ft[3].__EMPTY_81 || 0, // %JHT Perusahaan
            ce5: ft[3].__EMPTY_82 || 0, // %JHT Karyawan
            ci5: ft[3].__EMPTY_86 || 0, // %Pensiun Perusahaan
            cj5: ft[3].__EMPTY_87 || 0, // %Pensiun Karyawan
            cq5: ft[3].__EMPTY_94 || 0, // %BPJS Kesehatan Perusahaan
            cr5: ft[3].__EMPTY_95 || 0, // %BPJS Kesehatan Karyawan
          },
        });

        for (let i = 4; i < ft.length; i += 1) {
          payroll.employee.push({
            d0: ft[i].__EMPTY_3 || '', // Nama Karyawan
            e0: ft[i].__EMPTY_4 || '', // No. Karyawan
            g0: ft[i].__EMPTY_6 || 0, // Gaji Pokok
            h0: ft[i].__EMPTY_7 || '', // Status Karyawan
            i0: parseDate(XLSX.SSF.parse_date_code(ft[i].__EMPTY_8)), // Hired date
            j0: ft[i].__EMPTY_9 || 0, // Hari Kerja
            k0: parseDate(XLSX.SSF.parse_date_code(ft[i].__EMPTY_10)), // Resign/Finish Contract
            m0: ft[i].__EMPTY_12 || '', // Note
            n0: ft[i].__EMPTY_13 || '', // Jenis Kelamin
            o0: parseDate(XLSX.SSF.parse_date_code(ft[i].__EMPTY_14)), // Birthday
            p0: ft[i].__EMPTY_15 || '', // Status NPWP
            q0: ft[i].__EMPTY_16 || '', // No. NPWP
            r0: ft[i].__EMPTY_17 || '', // Status Tanggungan
            s0: ft[i].__EMPTY_18 || '', // Bank
            t0: ft[i].__EMPTY_19 || '', // No. Rekening
            u0: ft[i].__EMPTY_20 || '', // Department
            v0: ft[i].__EMPTY_21 || '', // Section
            w0: ft[i].__EMPTY_22 || '', // Section Code
            x0: ft[i].__EMPTY_23 || '', // Grade
            y0: ft[i].__EMPTY_24 || '', // Jabatan
            z0: ft[i].__EMPTY_25 || '', // JPK No. (Kartu Peserta Jamsostek)
            aa0: ft[i].__EMPTY_26 || '', // No. BPJS Kesehatan
            ab0: ft[i].__EMPTY_27 || 0, // Jam Lembur Normal
            ad0: ft[i].__EMPTY_29 || 0, // Jam Lembur Dinas
            af0: ft[i].__EMPTY_31 || 0, // Jam Insentif
            ag0: ft[i].__EMPTY_32 || 0, // Rate Insentif
            aj0: ft[i].__EMPTY_35 || 0, // Tunjangan Tetap Living
            ak0: ft[i].__EMPTY_36 || 0, // Tunjangan Tetap Perumahan
            al0: ft[i].__EMPTY_37 || 0, // Tunjangan Tetap Posisi Fix
            am0: ft[i].__EMPTY_38 || 0, // Tunjangan Tetap Fungsional Fix
            an0: ft[i].__EMPTY_39 || 0, // Tunjangan Tetap Koordinator
            ao0: ft[i].__EMPTY_40 || 0, // Tunjangan Tetap Transport
            ap0: ft[i].__EMPTY_41 || 0, // Tunjangan Tetap Komunikasi
            aq0: ft[i].__EMPTY_42 || 0, // Tunjangan Tetap Expertisi
            ar0: ft[i].__EMPTY_43 || 0, // Tunjangan Tetap Honorarium
            as0: ft[i].__EMPTY_44 || 0, // Tunjangan Tetap Posisi Variable
            at0: ft[i].__EMPTY_45 || 0, // Tunjangan Tetap Fungsional Variable
            au0: ft[i].__EMPTY_46 || 0, // Tunjangan Tetap Acting/PLT
            av0: ft[i].__EMPTY_47 || 0, // Tunjangan Tetap Others
            ay0: ft[i].__EMPTY_50 || 0, // Upah Normal
            ba0: ft[i].__EMPTY_52 || 0, // Tunjangan Tidak Tetap Fungsional
            bb0: ft[i].__EMPTY_53 || 0, // Tunjangan Tidak Tetap Shift
            bc0: ft[i].__EMPTY_54 || 0, // Tunjangan Tidak Tetap Tig Welding
            bd0: ft[i].__EMPTY_55 || 0, // Tunjangan Tidak Tetap Operator Plasma
            be0: ft[i].__EMPTY_56 || 0, // Tunjangan Tidak Tetap LKS
            bf0: ft[i].__EMPTY_57 || 0, // Tunjangan Tidak Tetap Koperasi
            bg0: ft[i].__EMPTY_58 || 0, // Tunjangan Tidak Tetap Quality System
            bh0: ft[i].__EMPTY_59 || 0, // Tunjangan Tidak Tetap Penghargaan Masa Kerja
            bi0: ft[i].__EMPTY_60 || 0, // Tunjangan Tidak Tetap Others
            bl0: ft[i].__EMPTY_63 || 0, // Pembetulan Pembayaran Koreksi Absen
            bm0: ft[i].__EMPTY_64 || 0, // Pembetulan Pembayaran Koreksi Gaji & Hari Kerja
            bn0: ft[i].__EMPTY_65 || 0, // Pembetulan Pembayaran Koreksi OT
            bo0: ft[i].__EMPTY_66 || 0, // Pembetulan Pembayaran Tunjangan
            bp0: ft[i].__EMPTY_67 || 0, // Pembetulan Pembayaran Insentif
            bq0: ft[i].__EMPTY_68 || 0, // Pembetulan Pembayaran THR
            br0: ft[i].__EMPTY_69 || 0, // Pembetulan Pembayaran Allowance
            bs0: ft[i].__EMPTY_70 || 0, // Pembetulan Pembayaran Uang Makan Security
            bt0: ft[i].__EMPTY_71 || 0, // Pembetulan Pembayaran Others
            bv0: ft[i].__EMPTY_73 || 0, // Tambahan Lain Tidak Kena Pajak
            bw0: ft[i].__EMPTY_74 || 0, // THR Prorate Months
            by0: ft[i].__EMPTY_76 || 0, // Cuti Days
            ck0: ft[i].__EMPTY_88 || '', // Description (BPJS Ketenagakerjaan)
            co0: ft[i].__EMPTY_92 || 0, // Upah untuk Pelaporan BPJS Kesehatan
            ct0: ft[i].__EMPTY_97 || '', // Description Medical
            cw0: ft[i].__EMPTY_100 || 0, // Absen
            dc0: ft[i].__EMPTY_106 || 0, // Pemotongan Kelebihan Bayar Gaji
            dd0: ft[i].__EMPTY_107 || 0, // Pemotongan Kelebihan Bayar OT
            de0: ft[i].__EMPTY_108 || 0, // Pemotongan Prorate Absen
            dg0: ft[i].__EMPTY_110 || 0, // Pemotongan Koreksi Absen
            dh0: ft[i].__EMPTY_111 || 0, // Pemotongan Toolroom
            di0: ft[i].__EMPTY_112 || 0, // Pemotongan Others
            dr0: ft[i].__EMPTY_121 || 0, // Bonus
            ds0: ft[i].__EMPTY_122 || 0, // Uang Pisah Prorate
            du0: ft[i].__EMPTY_124 || 0, // Uang Pesangon Prorate
            dw0: ft[i].__EMPTY_126 || 0, // Uang Penghargaan Masa Kerja Prorate
            ea0: ft[i].__EMPTY_130 || 0, // Total Bulan Periode Pajak
            ex0: ft[i].__EMPTY_153 || 0, // Slot 1 Flag
            ey0: ft[i].__EMPTY_154 || 0, // Slot 2 Flag
            ez0: ft[i].__EMPTY_155 || 0, // Slot 3 Flag
            fa0: ft[i].__EMPTY_156 || 0, // Slot 3 Flag
          });
        }

        const saved = await payroll.save();
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

module.exports = { processImportPayroll, processImportESlip };
