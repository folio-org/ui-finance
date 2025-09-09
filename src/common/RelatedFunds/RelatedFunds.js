import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';

import { Icon } from '@folio/stripes/components';

import ConnectionListing from '../../components/ConnectionListing';
import { getFundsToDisplay } from '../utils';
import { useRelatedBudgets } from './useRelatedBudgets';

const defaultProps = {
  funds: [],
};

const RelatedFunds = ({
  currency,
  funds = defaultProps.funds,
  onRemoveFund,
  query,
}) => {
  const history = useHistory();

  const {
    budgets,
    isLoading,
  } = useRelatedBudgets(query);

  const openFund = useCallback(({ target }, fund) => {
    if (!(
      target.classList?.contains('icon-times-circle') ||
      target.parentElement?.classList?.contains('icon-times-circle') ||
      target.id === 'remove-item-button'
    )) {
      const path = `/finance/fund/view/${fund.id}`;

      history.push(path);
    }
  }, [history]);

  const fundsToDisplay = useMemo(() => {
    return getFundsToDisplay(funds, budgets).filter(fund => fund.available !== undefined);
  }, [funds, budgets]);

  if (isLoading) {
    return (
      <Icon
        icon="spinner-ellipsis"
        width="100px"
      />
    );
  }

  return (
    <ConnectionListing
      items={fundsToDisplay}
      currency={currency}
      openItem={openFund}
      onRemoveItem={onRemoveFund}
      columnIdPrefix="fund-list"
    />
  );
};

RelatedFunds.propTypes = {
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  query: PropTypes.string,
  onRemoveFund: PropTypes.func,
};

export default RelatedFunds;
