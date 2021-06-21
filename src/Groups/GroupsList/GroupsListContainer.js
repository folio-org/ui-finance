import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { stripesConnect } from '@folio/stripes/core';
import {
  buildArrayFieldQuery,
  makeQueryBuilder,
  useLocationReset,
} from '@folio/stripes-acq-components';

import { GROUPS_ROUTE } from '../../common/const';
import { groupsResource } from '../../common/resources';
import { GROUPS_FILTERS } from '../constants';
import GroupsList from './GroupsList';
import {
  getKeywordQuery,
} from './GroupsListSearchConfig';

const RESULT_COUNT_INCREMENT = 30;

export const buildGroupsQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}=${query}*)`;
    }

    return `(${getKeywordQuery(query)})`;
  },
  'sortby name/sort.ascending',
  { [GROUPS_FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [GROUPS_FILTERS.ACQUISITIONS_UNIT]) },
);

const resetData = () => {};

export const GroupsListContainer = ({ mutator: originMutator, location, history }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutator = useMemo(() => originMutator, []);
  const [groups, setGroups] = useState([]);
  const [groupsCount, setGroupsCount] = useState(0);
  const [groupsOffset, setGroupsOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadGroups = useCallback((offset) => {
    setIsLoading(true);

    return mutator.groupsListGroups.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildGroupsQuery(queryString.parse(location.search)),
      },
    })
      .then(groupsResponse => {
        if (!offset) setGroupsCount(groupsResponse.totalRecords);

        setGroups((prev) => [...prev, ...groupsResponse.groups]);
      })
      .finally(() => setIsLoading(false));
  }, [location.search, mutator.groupsListGroups]);

  const onNeedMoreData = useCallback(
    () => {
      const newOffset = groupsOffset + RESULT_COUNT_INCREMENT;

      loadGroups(newOffset)
        .then(() => {
          setGroupsOffset(newOffset);
        });
    },
    [groupsOffset, loadGroups],
  );

  const refreshList = () => {
    setGroups([]);
    setGroupsOffset(0);
    loadGroups(0);
  };

  useEffect(
    () => {
      refreshList();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );
  useLocationReset(history, location, GROUPS_ROUTE, refreshList);

  return (
    <GroupsList
      onNeedMoreData={onNeedMoreData}
      resetData={resetData}
      groupsCount={groupsCount}
      isLoading={isLoading}
      groups={groups}
    />
  );
};

GroupsListContainer.manifest = Object.freeze({
  groupsListGroups: {
    ...groupsResource,
    accumulate: true,
    records: null,
  },
});

GroupsListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(GroupsListContainer));
