const { isNil, isEmpty } = require("ramda");

const parseInt10 = string => parseInt(string, 10);

const isPresent = val => !isNil(val) && !isEmpty(val);

const isBlank = val => !isPresent(val);

module.exports = {
  parseInt10,
  isPresent,
  isBlank,
};
