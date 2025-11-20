import PropTypes from 'prop-types';
import { useMemo } from 'react';

import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';

const DEFAULT_FUNDS = [];

const FiscalYearFunds = ({
  currency,
  fiscalYearId,
  funds = DEFAULT_FUNDS,
}) => {
  const buildQuery = useMemo(() => {
    if (fiscalYearId) {
      return `query=(fiscalYearId=="${fiscalYearId}")`;
    }

    return null;
  }, [fiscalYearId]);

  return (
    <RelatedFunds
      funds={funds}
      currency={currency}
      query={buildQuery}
    />
  );
};

FiscalYearFunds.propTypes = {
  currency: PropTypes.string,
  fiscalYearId: PropTypes.string,
  funds: PropTypes.arrayOf(PropTypes.object),
};

export default FiscalYearFunds;
