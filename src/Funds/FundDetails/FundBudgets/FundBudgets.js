import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion } from '@folio/stripes/components';

import ConnectionListing from '../../../components/ConnectionListing';

const budgetColumns = ['name', 'allocated', 'unavailable', 'available', 'arrow'];

const FundBudgets = ({
  addBudgetButton,
  budgets,
  budgetStatus,
  currency,
  labelId,
  openBudget,
  sectionId,
}) => (
  <Accordion
    displayWhenOpen={addBudgetButton(budgetStatus, budgets.length)}
    id={sectionId}
    label={<FormattedMessage id={labelId} />}
  >
    <ConnectionListing
      currency={currency}
      items={budgets}
      openItem={openBudget}
      visibleColumns={budgetColumns}
    />
  </Accordion>
);

FundBudgets.propTypes = {
  addBudgetButton: PropTypes.func,
  budgets: PropTypes.arrayOf(PropTypes.object),
  budgetStatus: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  openBudget: PropTypes.func.isRequired,
  sectionId: PropTypes.string.isRequired,
};

FundBudgets.defaultProps = {
  addBudgetButton: () => null,
  budgets: [],
};

export default FundBudgets;
