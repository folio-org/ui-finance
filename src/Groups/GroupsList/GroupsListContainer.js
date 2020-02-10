import React, {
  useCallback,
  useEffect,
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
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { groupsResource } from '../../common/resources';

import GroupsList from './GroupsList';
import {
  getKeywordQuery,
} from './GroupsListSearchConfig';

const RESULT_COUNT_INCREMENT = 30;
const buildGroupsQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}=${query}*)`;
    }

    return getKeywordQuery(query);
  },
  'sortby name/sort.ascending',
);

const resetData = () => {};

const GroupsListContainer = ({ mutator, location }) => {
  const [groups, setGroups] = useState([]);
  const [groupsCount, setGroupsCount] = useState(0);
  const [groupsOffset, setGroupsOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadGroups = (offset) => {
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
  };

  const onNeedMoreData = useCallback(
    () => {
      const newOffset = groupsOffset + RESULT_COUNT_INCREMENT;

      loadGroups(newOffset)
        .then(() => {
          setGroupsOffset(newOffset);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupsOffset],
  );

  useEffect(
    () => {
      setGroups([]);
      setGroupsOffset(0);
      loadGroups(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

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
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(GroupsListContainer));
