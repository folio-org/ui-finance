import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqUnitFilter,
} from '@folio/stripes-acq-components';

import {
  FISCAL_YEAR_FILTERS,
} from '../../constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const FiscalYearsListFilter = ({ activeFilters, applyFilters }) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqUnitFilter
        id={FISCAL_YEAR_FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FISCAL_YEAR_FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-finance.fiscalYear.filters.acqUnits"
        name={FISCAL_YEAR_FILTERS.ACQUISITIONS_UNIT}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

FiscalYearsListFilter.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default FiscalYearsListFilter;
