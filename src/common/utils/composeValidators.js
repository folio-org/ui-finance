export const composeValidators = (...validators) => (...data) => {
  return validators.reduce((error, validator) => error || validator(...data), undefined);
};
