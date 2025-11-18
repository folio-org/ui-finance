import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import { fiscalYearsResource } from '../resources';
import { getFiscalYearsForSelect } from '../utils';

import FiscalYearField from './FiscalYearField';

const DEFAULT_VALIDATE_FIELDS = [];

function FiscalYearFieldContainer({
  dataOptions,
  disabled = false,
  label = <FormattedMessage id="ui-finance.budget.fiscalYear" />,
  name,
  resources,
  required = false,
  validateFields = DEFAULT_VALIDATE_FIELDS,
}) {
  const fiscalYears = dataOptions || getFiscalYearsForSelect(resources);

  return (
    <FiscalYearField
      dataOptions={fiscalYears}
      label={label}
      name={name}
      required={required}
      disabled={disabled}
      validateFields={validateFields}
    />
  );
}

FiscalYearFieldContainer.manifest = Object.freeze({
  fiscalYears: fiscalYearsResource,
});

FiscalYearFieldContainer.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
  required: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  series: PropTypes.string,
  validateFields: PropTypes.arrayOf(PropTypes.string),
};

export default stripesConnect(FiscalYearFieldContainer);
