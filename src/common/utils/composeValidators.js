export const composeValidators = (...validators) => (value) => {
  return validators.reduce((error, validator) => error || validator(value), undefined);
};
