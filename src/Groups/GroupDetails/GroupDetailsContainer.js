import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  useAllFunds,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  GROUPS_ROUTE,
} from '../../common/const';
import {
  groupByUrlIdResource,
  fiscalYearsResource,
  groupSummariesResource,
} from '../../common/resources';

import { getGroupSummary } from './utils';
import GroupDetails from './GroupDetails';

export const GroupDetailsContainer = ({
  mutator,
  match,
  history,
  location,
}) => {
  const groupId = match.params.id;
  const [groupData, setGroupData] = useState({});
  const [selectedFY, setSelectedFY] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowCallout();

  useEffect(
    () => {
      setIsLoading(true);
      const groupDetailsPromise = mutator.groupDetails.GET();
      const groupFiscalYearsPromise = mutator.groupFiscalYears.GET();

      Promise.all([groupDetailsPromise, groupFiscalYearsPromise])
        .then(responses => {
          const groupDetails = responses[0];
          const groupFiscalYears = responses[1];

          setGroupData(prevGroupData => ({
            ...prevGroupData,
            groupDetails,
            groupFiscalYears,
          }));
          setSelectedFY(groupFiscalYears[0] || {});

          return getGroupSummary(mutator.groupSummaries, groupId, get(groupFiscalYears, [0, 'id']));
        })
        .then(groupSummary => {
          setGroupData(prevGroupData => ({
            ...prevGroupData,
            groupSummary,
          }));
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.groups.actions.load.error', type: 'error' });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId],
  );

  const closePane = useCallback(
    () => {
      history.push({
        pathname: GROUPS_ROUTE,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const editGroup = useCallback(
    () => {
      history.push({
        pathname: `${GROUPS_ROUTE}/${groupId}/edit`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search, groupId],
  );

  const removeGroup = useCallback(
    () => {
      mutator.groupDetails.DELETE({ id: groupId }, { silent: true })
        .then(() => {
          showToast({ messageId: 'ui-finance.groups.actions.remove.success' });
          history.replace({
            pathname: GROUPS_ROUTE,
            search: location.search,
          });
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.groups.actions.remove.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, showToast, history, location.search],
  );

  const selectFY = useCallback(
    (newSelectedFY) => {
      setSelectedFY(newSelectedFY);

      getGroupSummary(mutator.groupSummaries, groupId, newSelectedFY.id)
        .then(groupSummary => {
          setGroupData(prevGroupData => ({
            ...prevGroupData,
            groupSummary,
          }));
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.groups.actions.load.summary.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, showToast],
  );

  const { funds } = useAllFunds();

  if (isLoading) {
    return (
      <LoadingPane
        id="pane-group-details"
        onClose={closePane}
      />
    );
  }

  return (
    <GroupDetails
      group={groupData.groupDetails}
      groupSummary={groupData.groupSummary}
      fiscalYearsRecords={groupData.groupFiscalYears}
      funds={funds}
      onClose={closePane}
      editGroup={editGroup}
      removeGroup={removeGroup}
      selectedFY={selectedFY}
      onSelectFY={selectFY}
    />
  );
};

GroupDetailsContainer.manifest = Object.freeze({
  groupDetails: {
    ...groupByUrlIdResource,
    accumulate: true,
  },
  groupSummaries: groupSummariesResource,
  groupFiscalYears: {
    ...fiscalYearsResource,
    accumulate: true,
    fetch: false,
    GET: {
      params: {
        query: '(groupFundFY.groupId==":{id}")',
      },
    },
  },
});

GroupDetailsContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(GroupDetailsContainer));
