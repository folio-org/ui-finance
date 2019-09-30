import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { acqUnitsResource } from '../../../../common/resources';

import FiscalYearListFilters from './FiscalYearListFilters';

const FiscalYearListFiltersContainer = ({ resources, activeFilters, onChange }) => {
  const acqUnits = get(resources, 'acqUnits.records', []);

  return (
    <FiscalYearListFilters
      activeFilters={activeFilters}
      onChange={onChange}
      acqUnits={acqUnits}
    />
  );
};

FiscalYearListFiltersContainer.manifest = Object.freeze({
  acqUnits: acqUnitsResource,
});

FiscalYearListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FiscalYearListFiltersContainer);
