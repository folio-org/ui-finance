import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import {
  chunk,
  uniqBy,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  groupFundFiscalYears,
  groupsResource,
  groupSummariesResource,
} from '../../common/resources';
import { CHUNK_LIMIT } from '../../common/const';
import ConnectionListing from '../../components/ConnectionListing';

import { getLedgerGroupsSummary } from './utils';

const LedgerGroups = ({ history, funds, currency, mutator, ledgerId, fiscalYearId }) => {
  const fundIds = funds.map(fund => `fundId="${fund.id}"`);
  const chunkedFundIds = chunk(fundIds, CHUNK_LIMIT).map(arr => arr.join(' or '));
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (funds.length) {
      setIsLoading(true);

      Promise.all(
        chunkedFundIds.map(fundIdsQuery => (
          mutator.groupFundFYByFundId.GET({
            params: {
              limit: LIMIT_MAX,
              query: fundIdsQuery,
            },
          })
        )),
      )
        .then(response => {
          const groupIds = uniqBy(response.flat(), 'groupId').map(item => `id="${item.groupId}"`);
          const query = groupIds.length ? `(${groupIds.join(' or ')}) sortby name` : null;

          const relatedGroupsPromise = mutator.groups.GET({ params: { query } });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funds]);

  const openGroup = useCallback(
    (e, group) => {
      const path = `/finance/groups/view/${group.id}`;

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
