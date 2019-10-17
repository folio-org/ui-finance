import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  map,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  groupFundFiscalYears,
  groupsResource,
} from '../../../../common/resources';
import ViewFundGroups from './ViewFundGroups';

function ViewFundGroupsContainer({ fundId, mutator, resources }) {
  useEffect(() => {
    if (mutator.gffy) {
      mutator.gffy.reset();
      if (fundId) {
        mutator.gffy.GET({
          params: {
            limit: LIMIT_MAX,
            query: `(fundId == ${fundId})`,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundId]);

  const isLoading = !(get(resources, 'gffy.hasLoaded') && get(resources, 'groupsDict.hasLoaded'));

  if (isLoading) return null;

  const connectionRecords = get(resources, 'gffy.records') || [];
  const groupIds = new Set(map(connectionRecords, 'groupId'));
  const groups = get(resources, 'groupsDict.records', []).filter(({ id }) => groupIds.has(id));

  return (
    <ViewFundGroups groups={groups} />
  );
}

ViewFundGroupsContainer.manifest = Object.freeze({
  gffy: groupFundFiscalYears,
  groupsDict: groupsResource,
});

ViewFundGroupsContainer.propTypes = {
  fundId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(ViewFundGroupsContainer);
