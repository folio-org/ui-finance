import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  FiscalYearFilter,
} from '@folio/stripes-acq-components';

import {
  BROWSE_FILTERS,
  LEDGER_STATUS_OPTIONS_BROWSE,
  GROUP_STATUS_OPTIONS_BROWSE,
  FUND_STATUS_OPTIONS_BROWSE,
  BUDGET_STATUS_OPTIONS_BROWSE,
  EXPENSE_CLASS_STATUS_OPTIONS_BROWSE,
} from '../constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const BrowseFilters = ({ activeFilters, applyFilters }) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <FiscalYearFilter
        id={BROWSE_FILTERS.FISCAL_YEAR}
        activeFilters={activeFilters[BROWSE_FILTERS.FISCAL_YEAR]}
        labelId="ui-finance.browse.filter.fiscalYear"
        name={BROWSE_FILTERS.FISCAL_YEAR}
        onChange={adaptedApplyFilters}
        closedByDefault={false}
      />
      <AcqCheckboxFilter
        id={BROWSE_FILTERS.LEDGER_STATUS}
        activeFilters={activeFilters[BROWSE_FILTERS.LEDGER_STATUS]}
        labelId="ui-finance.browse.filter.ledgerStatus"
        name={BROWSE_FILTERS.LEDGER_STATUS}
        onChange={adaptedApplyFilters}
        options={LEDGER_STATUS_OPTIONS_BROWSE}
        closedByDefault
      />
      <AcqCheckboxFilter
        id={BROWSE_FILTERS.GROUP_STATUS}
        activeFilters={activeFilters[BROWSE_FILTERS.GROUP_STATUS]}
        labelId="ui-finance.browse.filter.groupStatus"
        name={BROWSE_FILTERS.GROUP_STATUS}
        onChange={adaptedApplyFilters}
        options={GROUP_STATUS_OPTIONS_BROWSE}
        closedByDefault
      />
      <AcqCheckboxFilter
        id={BROWSE_FILTERS.FUND_STATUS}
        activeFilters={activeFilters[BROWSE_FILTERS.FUND_STATUS]}
        labelId="ui-finance.browse.filter.fundStatus"
        name={BROWSE_FILTERS.FUND_STATUS}
        onChange={adaptedApplyFilters}
        options={FUND_STATUS_OPTIONS_BROWSE}
        closedByDefault
      />
      <AcqCheckboxFilter
        id={BROWSE_FILTERS.BUDGET_STATUS}
        activeFilters={activeFilters[BROWSE_FILTERS.BUDGET_STATUS]}
        labelId="ui-finance.browse.filter.budgetStatus"
        name={BROWSE_FILTERS.BUDGET_STATUS}
        onChange={adaptedApplyFilters}
        options={BUDGET_STATUS_OPTIONS_BROWSE}
        closedByDefault
      />
      <AcqCheckboxFilter
        id={BROWSE_FILTERS.EXPENSE_CLASS_STATUS}
        activeFilters={activeFilters[BROWSE_FILTERS.EXPENSE_CLASS_STATUS]}
        labelId="ui-finance.browse.filter.expenseClassStatus"
        name={BROWSE_FILTERS.EXPENSE_CLASS_STATUS}
        onChange={adaptedApplyFilters}
        options={EXPENSE_CLASS_STATUS_OPTIONS_BROWSE}
        closedByDefault
      />
    </AccordionSet>
  );
};

BrowseFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default BrowseFilters;

