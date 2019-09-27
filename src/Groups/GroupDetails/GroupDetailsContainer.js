import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import moment from 'moment';

import { stripesConnect } from '@folio/stripes/core';
import {
  DATE_FORMAT,
  LoadingPane,
} from '@folio/stripes-acq-components';

import {
  GROUP_EDIT_ROUTE,
  GROUPS_ROUTE,
} from '../../common/const';
import {
  groupByUrlIdResource,
  fiscalYearsResource,
  fundsResource,
} from '../../common/resources';

import GroupDetails from './GroupDetails';

const GroupDetailsContainer = ({
  mutator,
  resources,
  match,
  history,
  onClose,
}) => {
  const groupId = match.params.id;
  const group = get(resources, ['groupDetails', 'records', '0']);

  useEffect(
    () => {
      mutator.groupDetails.reset();
      mutator.currentFiscalYears.reset();
      mutator.groupDetails.GET();
      mutator.currentFiscalYears.GET();
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
      mutator.groupDetails.DELETE(group)
        .then(() => history.push(GROUPS_ROUTE));
    },
    [history, group, mutator.groupDetails],
  );

  const isLoading = !(
    get(resources, ['groupDetails', 'hasLoaded']) &&
    get(resources, ['currentFiscalYears', 'hasLoaded'])
  );

  if (isLoading) {
    return <LoadingPane onClose={onClose} />;
  }

  const fiscalYear = get(resources, ['currentFiscalYears', 'records'], [])
    .map(({ code: fyCode }) => fyCode).join(', ');
  const fiscalYears = get(resources, ['currentFiscalYears', 'records'], []);
  const funds = get(resources, ['funds', 'records'], []);

  return (
    <GroupDetails
      group={group}
      fiscalYear={fiscalYear}
      fiscalYears={fiscalYears}
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
