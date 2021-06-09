import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import {
  flatten,
  uniqBy,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';
import { batchFetch } from '@folio/stripes-acq-components';

import {
  groupFundFiscalYears,
  groupsResource,
  groupSummariesResource,
} from '../../common/resources';
import {
  GROUPS_ROUTE,
} from '../../common/const';
import ConnectionListing from '../../components/ConnectionListing';

import { getLedgerGroupsSummary } from './utils';

const LedgerGroups = ({ history, funds, currency, mutator, ledgerId, fiscalYearId }) => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fundIds = useMemo(() => funds.map(({ id }) => id), [funds]);

  useEffect(() => {
    setGroups([]);
    if (fundIds.length) {
      setIsLoading(true);

      batchFetch(mutator.groupFundFYByFundId, fundIds, (itemsChunk) => {
        const query = itemsChunk
          .map(id => `fundId==${id}`)
          .join(' or ');

        return query || '';
      })
        .then(response => {
          const groupIds = uniqBy(flatten(response), 'groupId').map(({ groupId }) => groupId);
          const relatedGroupsPromise = batchFetch(mutator.groups, groupIds, (itemsChunk) => {
            const query = itemsChunk
              .map(id => `id==${id}`)
              .join(' or ');

            return query ? `${query} sortby name` : '';
          });
          const ledgerGroupSummariesPromise = getLedgerGroupsSummary(
            mutator.ledgerGroupSummaries, ledgerId, fiscalYearId,
          );

          return Promise.all([relatedGroupsPromise, ledgerGroupSummariesPromise]);
        })
        .then(([relatedGroups, ledgerGroupSummaries]) => {
          setGroups(relatedGroups.map(relatedGroup => ({
            ...relatedGroup,
            ...(ledgerGroupSummaries[relatedGroup.id] || {}),
          })));
        })
        .catch(() => {
          setGroups([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [fiscalYearId, ledgerId, fundIds]);

  const openGroup = useCallback(
    (e, group) => {
      const path = `${GROUPS_ROUTE}/${group.id}/view`;

      history.push(path);
    },
    [history],
  );

  if (isLoading) {
    return (
      <Icon
        icon="spinner-ellipsis"
        width="100px"
      />
    );
  }

  return (
    <ConnectionListing
      items={groups}
      currency={currency}
      openItem={openGroup}
    />
  );
};

LedgerGroups.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.object.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  ledgerId: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string,
};

LedgerGroups.defaultProps = {
  funds: [],
};

LedgerGroups.manifest = Object.freeze({
  groupFundFYByFundId: groupFundFiscalYears,
  groups: {
    ...groupsResource,
    accumulate: true,
  },
  ledgerGroupSummaries: groupSummariesResource,
});

export default withRouter(stripesConnect(LedgerGroups));
