import gql from 'graphql-tag';

export const ImportPayroll = gql`
  mutation importPayroll($input: ImportInputType) {
    importPayroll(input: $input) {
      _id
      year
      month
      period
      dir
    }
  }
`;

export const ImportESlip = gql`
  mutation importESlip($input: ImportInputType) {
    importESlip(input: $input) {
      _id
      year
      period
    }
  }
`;

export const ImportThr = gql`
  mutation importThr($input: ImportInputType) {
    importThr(input: $input) {
      _id
      year
      period
    }
  }
`;

export const ImportTax = gql`
  mutation importTax($input: ImportInputType) {
    importTax(input: $input) {
      _id
      year
      period
    }
  }
`;

export const ImportProrate = gql`
  mutation importProrate($input: ImportInputType) {
    importProrate(input: $input) {
      _id
      year
      period
    }
  }
`;

export const ImportKantin = gql`
  mutation importKantin($input: ExtImportInputType) {
    importKantin(input: $input) {
      sStatus
    }
  }
`;

export const ImportKoperasi = gql`
  mutation importKoperasi($input: ExtImportInputType) {
    importKoperasi(input: $input) {
      sStatus
    }
  }
`;

export const ImportOvertime = gql`
  mutation importOvertime($input: ExtImportInputType) {
    importOvertime(input: $input) {
      sStatus
    }
  }
`;

export const ImportTax21 = gql`
  mutation importTax21($input: ExtImportInputType) {
    importTax21(input: $input) {
      sStatus
    }
  }
`;
