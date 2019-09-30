import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  acqUnitsResource,
  fundTypesResource,
  ledgersResource,
} from '../../../common/resources';
import FundListFilters from './FundListFilters';

const FundListFiltersContainer = ({ resources, activeFilters, onChange }) => {
  const acqUnits = get(resources, 'acqUnits.records', []);
  const ledgers = get(resources, 'ledgers.records', []).map(({ id, name }) => ({ label: name, value: id }));
  const fundTypes = get(resources, 'fundTypes.records', []).map(({ id, name }) => ({ label: name, value: id }));

  return (
    <FundListFilters
      acqUnits={acqUnits}
      activeFilters={activeFilters}
      fundTypes={fundTypes}
      ledgers={ledgers}
      onChange={onChange}
    />
  );
};

FundListFiltersContainer.manifest = Object.freeze({
  acqUnits: acqUnitsResource,
  ledgers: ledgersResource,
  fundTypes: fundTypesResource,
});

FundListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FundListFiltersContainer);
