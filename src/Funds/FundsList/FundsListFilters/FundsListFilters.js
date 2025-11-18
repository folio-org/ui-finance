import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { AccordionSet } from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqTagsFilter,
  AcqUnitFilter,
  SelectionFilter,
  selectOptionsShape,
} from '@folio/stripes-acq-components';

import {
  FUND_FILTERS,
  FUND_STATUSES_OPTIONS,
} from '../../constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const DEFAULT_FUND_TYPES = [];
const DEFAULT_GROUPS = [];
const DEFAULT_LEDGERS = [];

const FundsListFilters = ({
  activeFilters,
  applyFilters,
  fundTypes = DEFAULT_FUND_TYPES,
  groups = DEFAULT_GROUPS,
  ledgers = DEFAULT_LEDGERS,
}) => {
  const adaptedApplyFilters = useCallback(
    ({ name, values }) => applyFiltersAdapter(applyFilters)({ name, values }),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <SelectionFilter
        activeFilters={activeFilters[FUND_FILTERS.LEDGER]}
        id={FUND_FILTERS.LEDGER}
        labelId="ui-finance.fund.filters.ledger"
        name={FUND_FILTERS.LEDGER}
        onChange={adaptedApplyFilters}
        options={ledgers}
      />
      <AcqCheckboxFilter
        id={FUND_FILTERS.STATUS}
        activeFilters={activeFilters[FUND_FILTERS.STATUS]}
        labelId="ui-finance.fund.filters.status"
        name={FUND_FILTERS.STATUS}
        onChange={adaptedApplyFilters}
        options={FUND_STATUSES_OPTIONS}
      />
      <SelectionFilter
        activeFilters={activeFilters[FUND_FILTERS.TYPE]}
        id={FUND_FILTERS.TYPE}
        labelId="ui-finance.fund.filters.type"
        name={FUND_FILTERS.TYPE}
        onChange={adaptedApplyFilters}
        options={fundTypes}
      />
      <SelectionFilter
        activeFilters={activeFilters[FUND_FILTERS.GROUP]}
        id={FUND_FILTERS.GROUP}
        labelId="ui-finance.fund.filters.group"
        name={FUND_FILTERS.GROUP}
        onChange={adaptedApplyFilters}
        options={groups}
      />
      <AcqUnitFilter
        id={FUND_FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FUND_FILTERS.ACQUISITIONS_UNIT]}
        name={FUND_FILTERS.ACQUISITIONS_UNIT}
        onChange={adaptedApplyFilters}
      />
      <AcqTagsFilter
        activeFilters={activeFilters[FUND_FILTERS.TAGS]}
        id={FUND_FILTERS.TAGS}
        name={FUND_FILTERS.TAGS}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

FundsListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  fundTypes: selectOptionsShape,
  groups: selectOptionsShape,
  ledgers: selectOptionsShape,
};

export default FundsListFilters;
