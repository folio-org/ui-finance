import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { acqUnitsResource } from '../../../common/resources';

import LedgerListFilters from './LedgerListFilters';

const LedgerListFiltersContainer = ({ resources, activeFilters, applyFilters }) => {
  const acqUnits = get(resources, 'acqUnits.records', []);

  return (
    <LedgerListFilters
      activeFilters={activeFilters}
      applyFilters={applyFilters}
      acqUnits={acqUnits}
    />
  );
};

LedgerListFiltersContainer.manifest = Object.freeze({
  acqUnits: acqUnitsResource,
});

LedgerListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(LedgerListFiltersContainer);
