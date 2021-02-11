import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelectFinal } from '@folio/stripes-acq-components';
import { Loading } from '@folio/stripes/components';

import { mapFiscalYearsToOptions } from '../../common/utils';

function RolloverFiscalYearField({ fiscalYears, currentYearPeriodStart }) {
  if (!fiscalYears) {
    return <Loading />;
  }
  const futureYears = fiscalYears.filter(({ periodStart }) => periodStart > currentYearPeriodStart);
  const fiscalYearsOptions = mapFiscalYearsToOptions(futureYears);

  return (
    <FieldSelectFinal
      dataOptions={fiscalYearsOptions}
      label={<FormattedMessage id="ui-finance.budget.fiscalYear" />}
      name="toFiscalYearId"
      required
    />
  );
}

RolloverFiscalYearField.propTypes = {
  currentYearPeriodStart: PropTypes.string,
  fiscalYears: PropTypes.arrayOf(PropTypes.object),
};

RolloverFiscalYearField.defaultProps = {
};

export default RolloverFiscalYearField;
