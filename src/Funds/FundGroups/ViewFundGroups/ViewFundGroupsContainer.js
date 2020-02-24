import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  groupsResource,
} from '../../../common/resources';
import ViewFundGroups from './ViewFundGroups';

function ViewFundGroupsContainer({ groupIds, resources }) {
  const isLoading = !get(resources, 'groupsDict.hasLoaded');

  if (isLoading) return null;

  const groups = get(resources, 'groupsDict.records', []).filter(({ id }) => groupIds.includes(id));

  return (
    <ViewFundGroups groups={groups} />
  );
}

ViewFundGroupsContainer.manifest = Object.freeze({
  groupsDict: groupsResource,
});

ViewFundGroupsContainer.propTypes = {
  groupIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(ViewFundGroupsContainer);
