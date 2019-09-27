import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqUnitFilter,
  acqUnitsShape,
} from '@folio/stripes-acq-components';

import {
  FISCAL_YEAR_FILTERS,
} from '../../constants';

const FiscalYearListFilters = ({ activeFilters, onChange, acqUnits }) => {
  return (
    <AccordionSet>
      <AcqUnitFilter
        id={FISCAL_YEAR_FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FISCAL_YEAR_FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-finance.fiscalYear.filters.acqUnits"
        name={FISCAL_YEAR_FILTERS.ACQUISITIONS_UNIT}
        onChange={onChange}
        acqUnits={acqUnits}
      />
    </AccordionSet>
  );
};

FiscalYearListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  acqUnits: acqUnitsShape,
  onChange: PropTypes.func.isRequired,
};

export default FiscalYearListFilters;
