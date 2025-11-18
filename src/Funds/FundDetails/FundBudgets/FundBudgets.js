import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion } from '@folio/stripes/components';

import ConnectionListing from '../../../components/ConnectionListing';

const budgetColumns = ['name', 'allocated', 'netTransfers', 'unavailable', 'available', 'arrow'];

const DEFAULT_BUDGETS = [];

const FundBudgets = ({
  addBudgetButton = noop,
  budgets = DEFAULT_BUDGETS,
  budgetStatus,
  currency,
  labelId,
  openBudget,
  sectionId,
}) => (
  <Accordion
    displayWhenOpen={addBudgetButton(budgetStatus, budgets)}
    id={sectionId}
    label={<FormattedMessage id={labelId} />}
  >
    <ConnectionListing
      currency={currency}
      items={budgets}
      openItem={openBudget}
      visibleColumns={budgetColumns}
      columnIdPrefix="budget-list"
    />
  </Accordion>
);

FundBudgets.propTypes = {
  addBudgetButton: PropTypes.func,
  budgets: PropTypes.arrayOf(PropTypes.object),
  budgetStatus: PropTypes.string.isRequired,
  currency: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  openBudget: PropTypes.func.isRequired,
  sectionId: PropTypes.string.isRequired,
};

export default FundBudgets;
