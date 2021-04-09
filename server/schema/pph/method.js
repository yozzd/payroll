const { GraphQLError } = require('graphql');
const PdfPrinter = require('pdfmake');
const fs = require('fs-extra');

const { intpre0, intpre0v2 } = require('../scalar/number');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
    bolditalics: 'static/font/Roboto-MediumItalic.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const genPDF = async (p) => {
  try {
    const [e] = p.employee;
    await fs.ensureDir(`static/pph/${p.dir}`);

    const widths = [10, 150, 60];

    const col1 = [
      [{ text: '', border: [true, true, false, false] }, { text: 'Nama Karyawan', border: [false, true, false, false] }, { text: e.d0, border: [false, true, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Status Tanggungan', border: [false, false, false] }, { text: e.r0, border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: e.ea0, border: [false, false, false], alignment: 'right' }, { text: 'Bulanan', border: [false, false, true, false] }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Gaji Pokok', border: [false, false, false], bold: true }, {
        text: intpre0(e.l0).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
      [{ text: '1', border: [true, false, false, false], alignment: 'center' }, { text: 'Tunjangan Tetap & Tidak Tetap', border: [false, false, false] }, { text: intpre0(e.bk0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '2', border: [true, false, false, false], alignment: 'center' }, { text: 'Lembur & Insentif', border: [false, false, false] }, { text: intpre0(e.ai0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '3', border: [true, false, false, false], alignment: 'center' }, { text: 'Jaminan Kecelakaan Kerja, 0.54%', border: [false, false, false] }, { text: intpre0(e.cb0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '4', border: [true, false, false, false], alignment: 'center' }, { text: 'Jaminan Kematian, 0.30%', border: [false, false, false] }, { text: intpre0(e.cc0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '5', border: [true, false, false, false], alignment: 'center' }, { text: 'Iuran BPJS Kesehatan, 4% dibayar perusahaan', border: [false, false, false] }, { text: intpre0(e.cq0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '6', border: [true, false, false, false], alignment: 'center' }, { text: 'Retro Fill', border: [false, false, false] }, { text: intpre0(e.bu0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '7', border: [true, false, false, false], alignment: 'center' }, { text: 'Bonus & THR', border: [false, false, false] }, { text: intpre0(e.dr0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '8', border: [true, false, false, false], alignment: 'center' }, { text: 'Cuti yang diuangkan', border: [false, false, false] }, { text: intpre0(e.bz0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '9', border: [true, false, false, false], alignment: 'center' }, { text: '(Other Deduction)', border: [false, false, false] }, { text: intpre0(e.df0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '10', border: [true, false, false, false], alignment: 'center' }, { text: '(Absent Deduction)', border: [false, false, false] }, { text: intpre0(e.cy0).format(), border: [false, false, true, false], alignment: 'right' }],
      [{ text: '', border: [true, false, false, false] }, { text: 'Total Penghasilan Bruto', border: [false, false, false], bold: true }, {
        text: intpre0(e.bruto).format(), border: [false, false, true, false], alignment: 'right', bold: true,
      }],
    ];

    const col2 = [
      ['', 'Nama Karyawan', e.d0],
    ];

    const col3 = [
      ['', 'Nama Karyawan', e.d0],
    ];

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        {
          columns: [
            {
              style: 'tbl1',
              table: {
                widths,
                body: col1,
              },
            },
            {
              style: 'tbl1',
              table: {
                widths,
                body: col2,
              },
            },
            {
              style: 'tbl1',
              table: {
                widths,
                body: col3,
              },
            },
          ],
        },
      ],
      styles: {
        tbl1: {
          fontSize: 6,
          margin: [-10, -10, -10, 0],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/pph/${p.dir}/${e.pph.name}.pdf`));
      pdfDoc.on('end', () => {
        resolve({ sStatus: 1 });
      });
      pdfDoc.end();
    });
  } catch (err) {
    if (typeof err === 'string') {
      throw new GraphQLError(err);
    } else {
      throw new GraphQLError(err.message);
    }
  }
};

module.exports = {
  genPDF,
};
