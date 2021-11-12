import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';
import { useFund, useFundMutation } from './hooks';

const GroupFund = ({ funds, currency, fiscalYearId, groupId }) => {
  const stripes = useStripes();
  const [fundId, setFundId] = useState();
  const { isLoading: isFundLoading, fetchFund } = useFund(fundId);
  const { mutateFund, isLoading } = useFundMutation();

  const isFundRemovable = stripes.hasPerm('finance.funds.item.put');

  const buildQuery = useMemo(() => {
    if (fiscalYearId) {
      return `query=(fiscalYearId=="${fiscalYearId}" AND groupFundFY.groupId=="${groupId}")`;
    }

    return null;
  }, [fiscalYearId, groupId]);

  const onUpdateFundGroups = useCallback(() => {
    fetchFund().then(({ data }) => {
      const groupIds = data.groupIds.filter(id => id !== groupId);
      const updatedFund = { ...data, groupIds };

      return mutateFund(updatedFund);
    });
  }, [groupId, mutateFund, fetchFund]);

  const onRemoveFund = (e, fund) => setFundId(fund.id);

  useEffect(() => {
    if (fundId) onUpdateFundGroups();
  }, [fundId, onUpdateFundGroups]);

  const removeProp = isFundRemovable ? { onRemoveFund } : {};

  if (isLoading || isFundLoading) return null;

  return (
    <RelatedFunds
      currency={currency}
      funds={funds}
      query={buildQuery}
      {...removeProp}
    />
  );
};

GroupFund.propTypes = {
  groupId: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

GroupFund.defaultProps = {
  funds: [],
};

export default GroupFund;
