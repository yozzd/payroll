const { GraphQLScalarType } = require('graphql');
const currency = require('currency.js');

const intpre0 = (value) => currency(value, {
  symbol: '', separator: '.', decimal: ',', precision: '0',
});
const intpre0v2 = (value) => currency(value, {
  symbol: '', separator: '', decimal: '.', precision: '0',
});
const floatpre2 = (value) => currency(value, {
  symbol: '', separator: '.', decimal: ',', precision: '2',
});
const floatpre2v2 = (value) => currency(value, {
  symbol: '', separator: '.', decimal: '.', precision: '2',
});
const floatpre3 = (value) => currency(value, {
  symbol: '', separator: '.', decimal: ',', precision: '3',
});
const floatpre4 = (value) => currency(value, {
  symbol: '', separator: '.', decimal: ',', precision: '4',
});
const floatpre4v2 = (value) => currency(value, {
  symbol: '', separator: '.', decimal: '.', precision: '4',
});

const IntPre0 = new GraphQLScalarType({
  name: 'IntPre0',
  serialize(value) {
    return intpre0(value).format();
  },
  parseValue(value) {
    return value;
  },
});

const FloatPre2 = new GraphQLScalarType({
  name: 'FloatPre2',
  serialize(value) {
    if (value > 0) {
      return floatpre2(value).format();
    }
    return 0;
  },
  parseValue(value) {
    return value;
  },
});

const FloatPre4 = new GraphQLScalarType({
  name: 'FloatPre4',
  serialize(value) {
    if (value > 0) {
      return floatpre4(value).format();
    }
    return 0;
  },
  parseValue(value) {
    return value;
  },
});

module.exports = {
  IntPre0,
  FloatPre2,
  FloatPre4,
  intpre0,
  intpre0v2,
  floatpre2,
  floatpre2v2,
  floatpre3,
  floatpre4v2,
};
