import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  GROUPS_ROUTE,
} from '../../common/const';
import {
  groupByUrlIdResource,
  fiscalYearsResource,
  fundsResource,
  groupSummariesResource,
} from '../../common/resources';

import { getGroupSummary } from './utils';
import GroupDetails from './GroupDetails';

const GroupDetailsContainer = ({
  mutator,
  resources,
  match,
  history,
  location,
}) => {
  const groupId = match.params.id;
  const [groupData, setGroupData] = useState({});
  const [selectedFY, setSelectedFY] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();

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
          showToast('ui-finance.groups.actions.load.error', 'error');
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
      mutator.groupDetails.DELETE(groupData.groupDetails)
        .then(() => {
          showToast('ui-finance.groups.actions.remove.success');
          history.replace({
            pathname: GROUPS_ROUTE,
            search: location.search,
          });
        })
        .catch(() => {
          showToast('ui-finance.groups.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search, groupData.groupDetails],
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
          showToast('ui-finance.groups.actions.load.summary.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId],
  );

  if (isLoading) {
    return <LoadingPane onClose={closePane} />;
  }

  const funds = get(resources, ['funds', 'records'], []);

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
  funds: fundsResource,
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
  resources: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(GroupDetailsContainer));
