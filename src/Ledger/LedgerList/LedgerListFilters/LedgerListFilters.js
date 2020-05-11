import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqUnitFilter,
} from '@folio/stripes-acq-components';

import {
  LEDGER_FILTERS,
  LEDGER_STATUS_OPTIONS,
} from '../../constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const LedgerListFilters = ({ activeFilters, applyFilters }) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={LEDGER_FILTERS.STATUS}
        activeFilters={activeFilters[LEDGER_FILTERS.STATUS]}
        labelId="ui-finance.ledger.status"
        name={LEDGER_FILTERS.STATUS}
        onChange={adaptedApplyFilters}
        options={LEDGER_STATUS_OPTIONS}
      />
      <AcqUnitFilter
        id={LEDGER_FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[LEDGER_FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-finance.ledger.acqUnits"
        name={LEDGER_FILTERS.ACQUISITIONS_UNIT}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

LedgerListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default LedgerListFilters;
