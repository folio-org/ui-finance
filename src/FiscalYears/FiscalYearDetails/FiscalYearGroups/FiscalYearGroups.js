import React, {
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { LIMIT_MAX } from '@folio/stripes-acq-components';
import { stripesConnect } from '@folio/stripes/core';

import { GROUPS_ROUTE } from '../../../common/const';
import {
  groupsResource,
} from '../../../common/resources';
import {
  getGroupsWithTotals,
} from '../../../common/utils';
import ConnectionListing from '../../../components/ConnectionListing';

const FiscalYearGroups = ({
  fiscalYear,
  groupSummaries,
  history,
  mutator,
}) => {
  const [fiscalYearGroups, setFiscalYearGroups] = useState([]);

  useEffect(
    () => {
      setFiscalYearGroups([]);

      mutator.fiscalYearGroups.GET({
        params: {
          query: `groupFundFY.fiscalYearId == ${fiscalYear.id} sortby name`,
          limit: LIMIT_MAX,
        },
      })
        .then(fiscalYearGroupsResponse => {
          setFiscalYearGroups(getGroupsWithTotals(fiscalYearGroupsResponse, groupSummaries));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fiscalYear.id],
  );

  const openGroup = useCallback(
    (e, group) => {
      const path = `${GROUPS_ROUTE}/${group.id}/view`;

      history.push(path);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <ConnectionListing
      items={fiscalYearGroups}
      currency={fiscalYear.currency}
      openItem={openGroup}
      columnIdPrefix="group-list"
    />
  );
};

FiscalYearGroups.manifest = Object.freeze({
  fiscalYearGroups: {
    ...groupsResource,
    accumulate: true,
  },
});

FiscalYearGroups.propTypes = {
  fiscalYear: PropTypes.object.isRequired,
  groupSummaries: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.object.isRequired,
};

FiscalYearGroups.defaultProps = {
  groupSummaries: [],
};

export default withRouter(stripesConnect(FiscalYearGroups));
