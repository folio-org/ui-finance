import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { acqUnitsResource } from '../../common/resources';
import GroupsListFilters from './GroupsListFilters';

const GroupsListFiltersContainer = ({ resources, activeFilters, onChange }) => {
  const acqUnits = get(resources, 'acqUnits.records', []);

  return (
    <GroupsListFilters
      activeFilters={activeFilters}
      onChange={onChange}
      acqUnits={acqUnits}
    />
  );
};

GroupsListFiltersContainer.manifest = Object.freeze({
  acqUnits: acqUnitsResource,
});

GroupsListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(GroupsListFiltersContainer);
