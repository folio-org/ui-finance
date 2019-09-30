import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';

const LedgerFunds = ({ funds, currency, fiscalYears }) => {
  const buildQuery = useMemo(() => {
    const fiscalYearsIds = fiscalYears.map(fiscalYear => `fiscalYearId="${fiscalYear.id}"`);

    if (fiscalYears.length) {
      return `query=((${fiscalYearsIds.join(' or ')}))`;
    }

    return null;
  }, [fiscalYears]);

  return (
    <RelatedFunds
      funds={funds}
      currency={currency}
      query={buildQuery}
    />
  );
};

LedgerFunds.propTypes = {
  fiscalYears: PropTypes.arrayOf(PropTypes.object),
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

LedgerFunds.defaultProps = {
  funds: [],
  fiscalYears: [],
  currency: '',
};

export default LedgerFunds;
