import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  acqUnitsResource,
  fundTypesResource,
  groupsResource,
  ledgersResource,
} from '../../../common/resources';
import FundsListFilters from './FundsListFilters';

const FundsListFiltersContainer = ({ resources, activeFilters, applyFilters }) => {
  const acqUnits = get(resources, 'acqUnits.records', []);
  const ledgers = get(resources, 'ledgers.records', []).map(({ id, name }) => ({ label: name, value: id }));
  const fundTypes = get(resources, 'fundTypes.records', []).map(({ id, name }) => ({ label: name, value: id }));
  const groups = get(resources, 'groups.records', []).map(({ id, name }) => ({ label: name, value: id }));

  return (
    <FundsListFilters
      acqUnits={acqUnits}
      activeFilters={activeFilters}
      fundTypes={fundTypes}
      groups={groups}
      ledgers={ledgers}
      applyFilters={applyFilters}
    />
  );
};

FundsListFiltersContainer.manifest = Object.freeze({
  acqUnits: acqUnitsResource,
  fundTypes: fundTypesResource,
  groups: groupsResource,
  ledgers: ledgersResource,
});

FundsListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FundsListFiltersContainer);
