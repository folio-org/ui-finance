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
import FundListFilters from './FundListFilters';

const FundListFiltersContainer = ({ resources, activeFilters, onChange }) => {
  const acqUnits = get(resources, 'acqUnits.records', []);
  const ledgers = get(resources, 'ledgers.records', []).map(({ id, name }) => ({ label: name, value: id }));
  const fundTypes = get(resources, 'fundTypes.records', []).map(({ id, name }) => ({ label: name, value: id }));
  const groups = get(resources, 'groups.records', []).map(({ id, name }) => ({ label: name, value: id }));

  return (
    <FundListFilters
      acqUnits={acqUnits}
      activeFilters={activeFilters}
      fundTypes={fundTypes}
      groups={groups}
      ledgers={ledgers}
      onChange={onChange}
    />
  );
};

FundListFiltersContainer.manifest = Object.freeze({
  acqUnits: acqUnitsResource,
  fundTypes: fundTypesResource,
  groups: groupsResource,
  ledgers: ledgersResource,
});

FundListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FundListFiltersContainer);
