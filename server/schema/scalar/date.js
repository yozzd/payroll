const { GraphQLScalarType } = require('graphql');
const { format, intervalToDuration } = require('date-fns');
const { id } = require('date-fns/locale');

const gDateFormat = (d, f) => format(new Date(d), f);
const idDateFormat = (d, f) => format(new Date(d), f, { locale: id });
const dateDiff = (d1, d2) => {
  const { years, months, days } = intervalToDuration({ start: new Date(d1), end: new Date(d2) });
  return `${years} years ${months} months ${days} days`;
};

const DateFormat = new GraphQLScalarType({
  name: 'DateFormat',
  serialize(value) {
    return format(new Date(value), 'yyyy-MM-dd');
  },
  parseValue(value) {
    return value;
  },
});

module.exports = {
  DateFormat, gDateFormat, idDateFormat, dateDiff,
};
