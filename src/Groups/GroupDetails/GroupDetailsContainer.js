import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import moment from 'moment';

import { stripesConnect } from '@folio/stripes/core';
import {
  DATE_FORMAT,
  LoadingPane,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  GROUP_EDIT_ROUTE,
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
  onClose,
}) => {
  const groupId = match.params.id;
  const [groupData, setGroupData] = useState({ isLoading: true });
  const showToast = useShowToast();

  useEffect(
    () => {
      const groupDetailsPromise = mutator.groupDetails.GET();
      const currentFiscalYearPromise = mutator.currentFiscalYears.GET();

      Promise.all([groupDetailsPromise, currentFiscalYearPromise])
        .then(responses => {
          const groupDetails = responses[0];
          const currentFiscalYears = responses[1];

          setGroupData(prevGroupData => ({
            ...prevGroupData,
            groupDetails,
            currentFiscalYears,
          }));

          return getGroupSummary(mutator.groupSummaries, groupId, get(currentFiscalYears, [0, 'id']));
        })
        .then(groupSummary => {
          setGroupData(prevGroupData => ({
            ...prevGroupData,
            groupSummary,
            isLoading: false,
          }));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId],
  );

  const editGroup = useCallback(
    () => {
      history.push(`${GROUP_EDIT_ROUTE}${groupId}`);
    },
    [history, groupId],
  );

  const removeGroup = useCallback(
    () => {
      mutator.groupDetails.DELETE(groupData.groupDetails)
        .then(() => {
          showToast('ui-finance.groups.actions.remove.success');
          history.push(GROUPS_ROUTE);
        })
        .catch(() => {
          showToast('ui-finance.groups.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, groupData.groupDetails],
  );

  if (groupData.isLoading) {
    return <LoadingPane onClose={onClose} />;
  }

  const fiscalYears = (groupData.currentFiscalYears || [])
    .map(({ code: fyCode }) => fyCode).join(', ');
  const funds = get(resources, ['funds', 'records'], []);

  return (
    <GroupDetails
      group={groupData.groupDetails}
      groupSummary={groupData.groupSummary}
      fiscalYears={fiscalYears}
      fiscalYearsRecords={groupData.currentFiscalYears}
      funds={funds}
      onClose={onClose}
      editGroup={editGroup}
      removeGroup={removeGroup}
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
  currentFiscalYears: {
    ...fiscalYearsResource,
    accumulate: true,
    GET: {
      params: {
        query: () => {
          const currentDate = moment.utc().format(DATE_FORMAT);

          return `(periodEnd>=${currentDate} and periodStart<=${currentDate})`;
        },
      },
    },
  },
});

GroupDetailsContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRouter(stripesConnect(GroupDetailsContainer));
