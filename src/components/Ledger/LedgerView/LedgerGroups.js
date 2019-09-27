import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import {
  get,
  chunk,
  uniqBy,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Icon } from '@folio/stripes/components';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  groupFundFiscalYears,
  groupsResource,
} from '../../../common/resources';
import { CHUNK_LIMIT } from '../../../common/const';
import ConnectionListing from '../../ConnectionListing';

const LedgerGroups = ({ history, funds, currency, mutator, resources }) => {
  const fundIds = funds.map(fund => `fundId="${fund.id}"`);
  const chunkedFundIds = chunk(fundIds, CHUNK_LIMIT).map(arr => arr.join(' or '));

  useEffect(() => {
    mutator.groups.reset();
    mutator.groupFundFYByFundId.reset();

    if (funds.length) {
      Promise.all(
        chunkedFundIds.map(fundIdsQuery => (
          mutator.groupFundFYByFundId.GET({
            params: {
              limit: LIMIT_MAX,
              query: fundIdsQuery,
            },
          })
        )),
      ).then(response => {
        const groupIds = uniqBy(response.flat(), 'groupId').map(item => `id="${item.groupId}"`);
        const query = groupIds.length ? `(${groupIds.join(' or ')}) sortby name` : null;

        mutator.groups.GET({ params: { query } });
      });
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

  const groupsToDisplay = get(resources, ['groups', 'records'], []);
  const isLoading = get(resources, ['groups', 'isPending']);

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
      items={groupsToDisplay}
      currency={currency}
      openItem={openGroup}
    />
  );
};

LedgerGroups.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
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
});

export default withRouter(stripesConnect(LedgerGroups));
