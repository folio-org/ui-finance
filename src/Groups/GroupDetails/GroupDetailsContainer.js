import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import {
  differenceBy,
  uniq,
} from 'lodash';

import {
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  useAllFunds,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  GROUPS_ROUTE,
} from '../../common/const';
import {
  groupByUrlIdResource,
  fiscalYearsResource,
  groupSummariesResource,
} from '../../common/resources';

import {
  useFundGroupMutation,
  useFundsGroupMutation,
} from './hooks';
import {
  getGroupLedgers,
  getGroupSummary,
  getLedgersCurrentFiscalYears,
  sortGroupFiscalYears,
} from './utils';
import GroupDetails from './GroupDetails';

export const GroupDetailsContainer = ({
  mutator,
  match,
  history,
  location,
  refreshList,
}) => {
  const groupId = match.params.id;
  const [groupData, setGroupData] = useState({});
  const [selectedFY, setSelectedFY] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const ky = useOkapiKy();
  const showToast = useShowCallout();
  const { mutateFundsGroup: addFundsGroup } = useFundsGroupMutation(fund => ({
    ...fund,
    groupIds: [...fund.groupIds, groupId],
  }));
  const { mutateFundGroup } = useFundGroupMutation();

  const fetchGroupDetails = async (id, fiscalYear) => {
    const groupDetailsPromise = mutator.groupDetails.GET();
    const groupFiscalYearsPromise = mutator.groupFiscalYears.GET();
    const groupLedgersPromise = getGroupLedgers(ky)(groupId).then(({ ledgers }) => ledgers);

    return Promise.all([groupDetailsPromise, groupFiscalYearsPromise, groupLedgersPromise])
      .then(async ([
        groupDetails,
        groupFiscalYears,
        groupLedgers,
      ]) => {
        const ledgerIds = uniq(groupLedgers.map(({ id: ledgerId }) => ledgerId));
        const currentFYs = await getLedgersCurrentFiscalYears(ky)(ledgerIds).then(sortGroupFiscalYears);
        const previousFYs = sortGroupFiscalYears(differenceBy(groupFiscalYears, currentFYs, 'id'));

        const aggregatedFiscalYears = {
          current: currentFYs,
          previous: previousFYs,
        };

        setGroupData(prevGroupData => ({
          ...prevGroupData,
          groupDetails,
          groupFiscalYears: aggregatedFiscalYears,
        }));

        let newFiscalYear = {};

        if (currentFYs[0] && fiscalYear?.id) {
          newFiscalYear = fiscalYear;
        } else if (currentFYs[0]) {
          newFiscalYear = currentFYs[0];
        } else if (previousFYs[0]) {
          newFiscalYear = previousFYs[0];
        }

        setSelectedFY(newFiscalYear);

        return getGroupSummary(mutator.groupSummaries, id, newFiscalYear.id);
      })
      .then(groupSummary => {
        setGroupData(prevGroupData => ({
          ...prevGroupData,
          groupSummary,
        }));
      })
      .catch(() => {
        showToast({ messageId: 'ui-finance.groups.actions.load.error', type: 'error' });
      });
  };

  useEffect(
    () => {
      setIsLoading(true);

      fetchGroupDetails(groupId)
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
      mutator.groupDetails.DELETE({ id: groupId }, { silent: true })
        .then(() => {
          showToast({ messageId: 'ui-finance.groups.actions.remove.success' });
          history.replace({
            pathname: GROUPS_ROUTE,
            search: location.search,
          });

          refreshList();
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.groups.actions.remove.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, showToast, history, location.search, refreshList],
  );

  const onBatchAllocation = useCallback(
    (fiscalYearId) => {
      history.push({
        pathname: `${GROUPS_ROUTE}/${groupId}/batch-allocations/create/${fiscalYearId}`,
        state: { search: location.search },
      });
    },
    [history, groupId, location.search],
  );

  const selectFY = useCallback(
    (newSelectedFY) => {
      setSelectedFY(newSelectedFY);

      return getGroupSummary(mutator.groupSummaries, groupId, newSelectedFY.id)
        .then(groupSummary => {
          setGroupData(prevGroupData => ({
            ...prevGroupData,
            groupSummary,
          }));
        })
        .catch(() => {
          showToast({ messageId: 'ui-finance.groups.actions.load.summary.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, showToast],
  );

  const onAddFundToGroup = async newFunds => {
    setIsLoading(true);

    addFundsGroup(newFunds)
      .then(() => {
        showToast({ messageId: 'ui-finance.groups.actions.addFunds.success' });
      })
      .catch(() => {
        showToast({ messageId: 'ui-finance.groups.actions.addFunds.error', type: 'error' });
      })
      .then(() => {
        fetchGroupDetails(groupId, selectedFY);
      })
      .finally(() => setIsLoading(false));
  };

  const onRemoveFundFromGroup = async (e, fundToRemove) => {
    const fundCode = fundToRemove.code;

    setIsLoading(true);

    mutateFundGroup({
      fund: fundToRemove,
      hydrate: fund => ({
        ...fund,
        groupIds: fund?.groupIds.filter(id => id !== groupId) || [],
      }),
    })
      .then(() => {
        showToast({ messageId: 'ui-finance.groups.actions.removeFund.success', values: { fundCode } });
      })
      .catch(() => {
        showToast({ messageId: 'ui-finance.groups.actions.removeFund.error', values: { fundCode }, type: 'error' });
      })
      .then(() => {
        fetchGroupDetails(groupId, selectedFY);
      })
      .finally(() => setIsLoading(false));
  };

  const { funds } = useAllFunds();

  if (isLoading) {
    return (
      <LoadingPane
        id="pane-group-details"
        onClose={closePane}
      />
    );
  }

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
      onAddFundToGroup={onAddFundToGroup}
      onSelectFY={selectFY}
      onRemoveFundFromGroup={onRemoveFundFromGroup}
      onBatchAllocation={onBatchAllocation}
    />
  );
};

GroupDetailsContainer.manifest = Object.freeze({
  groupDetails: {
    ...groupByUrlIdResource,
    accumulate: true,
  },
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
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  refreshList: PropTypes.func.isRequired,
};

export default withRouter(stripesConnect(GroupDetailsContainer));
