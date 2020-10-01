const { GraphQLScalarType } = require('graphql');
const { format } = require('date-fns');
const { id } = require('date-fns/locale');

const idDateFormat = (d, f) => format(new Date(d), f, { locale: id });

const DateFormat = new GraphQLScalarType({
  name: 'DateFormat',
  serialize(value) {
    return format(new Date(value), 'dd-MM-yyyy');
  },
  parseValue(value) {
    return value;
  },
});

module.exports = { DateFormat, idDateFormat };
