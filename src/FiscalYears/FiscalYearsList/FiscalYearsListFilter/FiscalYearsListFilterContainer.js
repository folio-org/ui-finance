import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { acqUnitsResource } from '../../../common/resources';

import FiscalYearsListFilter from './FiscalYearsListFilter';

const FiscalYearsListFilterContainer = ({ resources, activeFilters, applyFilters }) => {
  const acqUnits = get(resources, 'acqUnits.records', []);

  return (
    <FiscalYearsListFilter
      activeFilters={activeFilters}
      applyFilters={applyFilters}
      acqUnits={acqUnits}
    />
  );
};

FiscalYearsListFilterContainer.manifest = Object.freeze({
  acqUnits: acqUnitsResource,
});

FiscalYearsListFilterContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FiscalYearsListFilterContainer);
