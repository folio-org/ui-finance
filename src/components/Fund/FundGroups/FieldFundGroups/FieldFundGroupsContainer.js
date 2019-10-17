import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { groupsResource } from '../../../../common/resources';
import FieldFundGroups from './FieldFundGroups';

function FieldFundGroupsContainer({ name, resources }) {
  const isLoading = !get(resources, 'groupsDict.hasLoaded');

  if (isLoading) return null;

  const groupsDict = get(resources, 'groupsDict.records') || [];
  const groupOptions = groupsDict.map((group) => ({
    label: group.name,
    value: group.id,
  }));

  return (
    <FieldFundGroups
      name={name}
      dataOptions={groupOptions}
    />
  );
}

FieldFundGroupsContainer.manifest = Object.freeze({
  groupsDict: groupsResource,
});

FieldFundGroupsContainer.propTypes = {
  name: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FieldFundGroupsContainer);
