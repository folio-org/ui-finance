import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { AccordionSet } from '@folio/stripes/components';
import {
  AcqDateRangeFilter,
  FiscalYearFilter,
  PluggableUserFilter,
  SelectionFilter,
} from '@folio/stripes-acq-components';

import { FILTERS } from './constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const BatchAllocationLogsFilters = ({
  activeFilters,
  applyFilters,
  disabled,
  groupsOptions,
  ledgersOptions,
}) => {
  const adaptedApplyFilters = useCallback((data) => {
    return applyFiltersAdapter(applyFilters)(data);
  }, [applyFilters]);

  return (
    <AccordionSet>
      <AcqDateRangeFilter
        activeFilters={activeFilters[FILTERS.DATE]}
        labelId={`ui-finance.allocation.batch.logs.filters.${FILTERS.DATE}`}
        name={FILTERS.DATE}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />
      <PluggableUserFilter
        id={FILTERS.USER}
        activeFilters={activeFilters[FILTERS.USER]}
        labelId={`ui-finance.allocation.batch.logs.filters.${FILTERS.USER}`}
        name={FILTERS.USER}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />
      <FiscalYearFilter
        id={FILTERS.FISCAL_YEAR}
        activeFilters={activeFilters[FILTERS.FISCAL_YEAR]}
        labelId={`ui-finance.allocation.batch.logs.filters.${FILTERS.FISCAL_YEAR}`}
        name={FILTERS.FISCAL_YEAR}
        onChange={adaptedApplyFilters}
        disabled={disabled}
      />
      <SelectionFilter
        activeFilters={activeFilters[FILTERS.LEDGER]}
        id={FILTERS.LEDGER}
        labelId={`ui-finance.allocation.batch.logs.filters.${FILTERS.LEDGER}`}
        name={FILTERS.LEDGER}
        onChange={adaptedApplyFilters}
        options={ledgersOptions}
      />
      <SelectionFilter
        activeFilters={activeFilters[FILTERS.GROUP]}
        id={FILTERS.GROUP}
        labelId={`ui-finance.allocation.batch.logs.filters.${FILTERS.GROUP}`}
        name={FILTERS.GROUP}
        onChange={adaptedApplyFilters}
        options={groupsOptions}
      />
    </AccordionSet>
  );
};

BatchAllocationLogsFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  groupsOptions: PropTypes.arrayOf(PropTypes.object),
  ledgersOptions: PropTypes.arrayOf(PropTypes.object),
};

export default BatchAllocationLogsFilters;
