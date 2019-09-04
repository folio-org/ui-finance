import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import moment from 'moment';

import {
  DATE_FORMAT,
  LoadingPane,
} from '@folio/stripes-acq-components';

import {
  groupByUrlIdResource,
  fiscalYearsResource,
} from '../../common/resources';

import GroupDetails from './GroupDetails';

const GroupDetailsContainer = ({
  mutator,
  resources,
  match,
  onClose,
}) => {
  useEffect(
    () => {
      mutator.groupDetails.GET();
      mutator.currentFiscalYears.GET();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [match.id]
  );

  const isLoading = !(
    get(resources, ['groupDetails', 'hasLoaded']) &&
    get(resources, ['currentFiscalYears', 'hasLoaded'])
  );

  if (isLoading) {
    return <LoadingPane onClose={onClose} />;
  }

  const group = get(resources, ['groupDetails', 'records', '0']);
  const fiscalYears = get(resources, ['currentFiscalYears', 'records'], [])
    .map(({ code: fyCode }) => fyCode).join(', ');

  return (
    <GroupDetails
      group={group}
      fiscalYears={fiscalYears}
      onClose={onClose}
    />
  );
};

GroupDetailsContainer.manifest = Object.freeze({
  groupDetails: {
    ...groupByUrlIdResource,
    accumulate: true,
  },
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
  }
});

GroupDetailsContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRouter(GroupDetailsContainer);
