import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqUnitFilter,
  acqUnitsShape,
} from '@folio/stripes-acq-components';

import {
  LEDGER_FILTERS,
  LEDGER_STATUS_OPTIONS,
} from '../../constants';

const LedgerListFilters = ({ activeFilters, onChange, acqUnits }) => {
  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={LEDGER_FILTERS.STATUS}
        activeFilters={activeFilters[LEDGER_FILTERS.STATUS]}
        labelId="ui-finance.ledger.status"
        name={LEDGER_FILTERS.STATUS}
        onChange={onChange}
        options={LEDGER_STATUS_OPTIONS}
      />
      <AcqUnitFilter
        id={LEDGER_FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[LEDGER_FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-finance.ledger.acqUnits"
        name={LEDGER_FILTERS.ACQUISITIONS_UNIT}
        onChange={onChange}
        acqUnits={acqUnits}
      />
    </AccordionSet>
  );
};

LedgerListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  acqUnits: acqUnitsShape,
  onChange: PropTypes.func.isRequired,
};

export default LedgerListFilters;
