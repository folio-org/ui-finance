import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  BUDGETS_API,
  FINANCE_DATA_API,
  GROUPS_API,
  LEDGERS_API,
} from '../../../common/const';

const UNGROUPED_ID = 'ungrouped';
const UNGROUPED_NAME = 'Ungrouped';

/**
 * Builds the hierarchical structure from finance data API response.
 * The finance-data API only returns ledger/group codes (not their full
 * name/status), so those are enriched from the full ledger and group
 * records looked up by id.
 */
const buildHierarchyFromFinanceData = (financeData, ledgersById, groupsById) => {
  // Group by ledger
  const ledgerMap = new Map();

  financeData.forEach(item => {
    const ledgerId = item.ledgerId;
    const ledgerCode = item.ledgerCode || '';
    const ledgerRecord = ledgersById.get(ledgerId);

    if (!ledgerMap.has(ledgerId)) {
      ledgerMap.set(ledgerId, {
        id: ledgerId,
        type: 'ledger',
        name: ledgerRecord?.name || ledgerCode || 'Unknown Ledger',
        code: ledgerCode,
        status: ledgerRecord?.ledgerStatus || 'Active',
        groupsMap: new Map(),
      });
    }

    const ledger = ledgerMap.get(ledgerId);
    const groupId = item.groupId || UNGROUPED_ID;
    const groupCode = item.groupCode || '';
    const groupRecord = groupsById.get(groupId);

    if (!ledger.groupsMap.has(groupId)) {
      ledger.groupsMap.set(groupId, {
        id: groupId,
        type: 'group',
        name: groupId === UNGROUPED_ID ? UNGROUPED_NAME : (groupRecord?.name || groupCode || 'Unknown Group'),
        code: groupCode,
        status: groupId === UNGROUPED_ID ? '' : (groupRecord?.status || ''),
        isUngrouped: groupId === UNGROUPED_ID,
        fundsMap: new Map(),
      });
    }

    const group = ledger.groupsMap.get(groupId);
    const fundId = item.fundId;

    if (!group.fundsMap.has(fundId)) {
      group.fundsMap.set(fundId, {
        id: fundId,
        type: 'fund',
        name: item.fundName || '',
        code: item.fundCode || '',
        status: item.fundStatus || 'Active',
        budgets: [],
      });
    }

    const fund = group.fundsMap.get(fundId);

    // Add budget
    if (item.budgetId) {
      fund.budgets.push({
        id: item.budgetId,
        type: 'budget',
        name: item.budgetName || '',
        code: item.budgetCode || '',
        status: item.budgetStatus || 'Active',
        expenseClasses: [], // Finance data doesn't include expense classes directly
      });
    }
  });

  // Convert maps to arrays
  const hierarchy = Array.from(ledgerMap.values()).map(ledger => ({
    ...ledger,
    groups: Array.from(ledger.groupsMap.values()).map(group => ({
      ...group,
      funds: Array.from(group.fundsMap.values()),
    })),
  }));

  // Remove the map properties
  hierarchy.forEach(ledger => {
    delete ledger.groupsMap;
    ledger.groups.forEach(group => {
      delete group.fundsMap;
    });
  });

  return hierarchy;
};

/**
 * Builds the hierarchical structure from budgets when finance data is empty.
 */
const buildHierarchyFromBudgets = (ledgers, allGroups, budgets) => {
  const groupsMap = allGroups.reduce((acc, group) => {
    acc[group.id] = group;

    return acc;
  }, {});

  const ledgersMap = ledgers.reduce((acc, ledger) => {
    acc[ledger.id] = {
      ...ledger,
      type: 'ledger',
      status: ledger.ledgerStatus,
      groupsMap: new Map(),
    };

    return acc;
  }, {});

  // Process budgets
  budgets.forEach(budget => {
    const fundDetails = budget.fundDetails || {};
    const ledgerId = fundDetails.ledgerId;

    if (!ledgerId || !ledgersMap[ledgerId]) return;

    const ledger = ledgersMap[ledgerId];
    const groupIds = fundDetails.groupIds || [];
    const fundId = budget.fundId;

    const fundData = {
      id: fundId,
      type: 'fund',
      name: fundDetails.name || budget.name?.split('-')[0] || 'Unknown Fund',
      code: fundDetails.code || '',
      status: fundDetails.fundStatus || 'Active',
    };

    const budgetData = {
      id: budget.id,
      type: 'budget',
      name: budget.name,
      code: budget.budgetCode || budget.name,
      status: budget.budgetStatus,
      expenseClasses: (budget.statusExpenseClasses || []).map(ec => ({
        id: ec.expenseClassId,
        type: 'expenseClass',
        name: ec.expenseClassName || 'Unknown',
        status: ec.status,
      })),
    };

    if (groupIds.length === 0) {
      // Ungrouped fund
      if (!ledger.groupsMap.has(UNGROUPED_ID)) {
        ledger.groupsMap.set(UNGROUPED_ID, {
          id: UNGROUPED_ID,
          type: 'group',
          name: UNGROUPED_NAME,
          code: '',
          status: '',
          isUngrouped: true,
          fundsMap: new Map(),
        });
      }

      const ungrouped = ledger.groupsMap.get(UNGROUPED_ID);

      if (!ungrouped.fundsMap.has(fundId)) {
        ungrouped.fundsMap.set(fundId, { ...fundData, budgets: [] });
      }
      ungrouped.fundsMap.get(fundId).budgets.push(budgetData);
    } else {
      groupIds.forEach(groupId => {
        if (!ledger.groupsMap.has(groupId)) {
          const group = groupsMap[groupId] || { id: groupId, name: 'Unknown Group', code: '' };

          ledger.groupsMap.set(groupId, {
            id: group.id,
            type: 'group',
            name: group.name,
            code: group.code,
            status: group.status || 'Active',
            isUngrouped: false,
            fundsMap: new Map(),
          });
        }

        const groupData = ledger.groupsMap.get(groupId);

        if (!groupData.fundsMap.has(fundId)) {
          groupData.fundsMap.set(fundId, { ...fundData, budgets: [] });
        }
        groupData.fundsMap.get(fundId).budgets.push(budgetData);
      });
    }
  });

  // Convert maps to arrays
  const hierarchy = Object.values(ledgersMap).map(ledger => ({
    id: ledger.id,
    type: 'ledger',
    name: ledger.name,
    code: ledger.code,
    status: ledger.status,
    groups: Array.from(ledger.groupsMap.values()).map(group => ({
      id: group.id,
      type: 'group',
      name: group.name,
      code: group.code,
      status: group.status,
      isUngrouped: group.isUngrouped,
      funds: Array.from(group.fundsMap.values()),
    })),
  }));

  // Filter out ledgers with no groups
  return hierarchy.filter(ledger => ledger.groups.length > 0);
};

/**
 * Calculate counts for each level of the hierarchy.
 */
const calculateCounts = (hierarchy) => {
  const ledgersCount = hierarchy.length;
  let groupsCount = 0;
  let fundsCount = 0;
  let budgetsCount = 0;
  let expenseClassesCount = 0;

  hierarchy.forEach(ledger => {
    groupsCount += ledger.groups?.length || 0;
    ledger.groups?.forEach(group => {
      fundsCount += group.funds?.length || 0;
      group.funds?.forEach(fund => {
        budgetsCount += fund.budgets?.length || 0;
        fund.budgets?.forEach(budget => {
          expenseClassesCount += budget.expenseClasses?.length || 0;
        });
      });
    });
  });

  return {
    ledgers: ledgersCount,
    groups: groupsCount,
    funds: fundsCount,
    budgets: budgetsCount,
    expenseClasses: expenseClassesCount,
  };
};

/**
 * Fetches and builds the hierarchical finance structure for a fiscal year.
 * Structure: Fiscal Year > Ledger > Group > Fund > Budget > Expense Class
 */
export const useBrowseHierarchy = (fiscalYearId, options = {}) => {
  const { enabled = true } = options;

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'browse-hierarchy' });

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [namespace, fiscalYearId],
    queryFn: async ({ signal }) => {
      if (!fiscalYearId) return null;

      // Ledgers/groups are needed regardless of which path below is taken:
      // the finance-data API only returns their codes, not name/status.
      const [financeDataResponse, ledgersResponse, groupsResponse] = await Promise.all([
        ky.get(FINANCE_DATA_API, {
          searchParams: {
            query: `fiscalYearId=="${fiscalYearId}"`,
            limit: LIMIT_MAX,
          },
          signal,
        }).json(),
        ky.get(LEDGERS_API, {
          searchParams: {
            query: 'cql.allRecords=1',
            limit: LIMIT_MAX,
          },
          signal,
        }).json(),
        ky.get(GROUPS_API, {
          searchParams: {
            query: 'cql.allRecords=1',
            limit: LIMIT_MAX,
          },
          signal,
        }).json(),
      ]);

      const financeData = financeDataResponse.fyFinanceData || [];
      const ledgers = ledgersResponse.ledgers || [];
      const allGroups = groupsResponse.groups || [];
      const ledgersById = new Map(ledgers.map(ledger => [ledger.id, ledger]));
      const groupsById = new Map(allGroups.map(group => [group.id, group]));

      if (financeData.length === 0) {
        // Fallback: build the hierarchy from budgets directly
        const budgetsResponse = await ky.get(BUDGETS_API, {
          searchParams: {
            query: `fiscalYearId=="${fiscalYearId}"`,
            limit: LIMIT_MAX,
          },
          signal,
        }).json();

        const budgets = budgetsResponse.budgets || [];

        // Get unique ledger IDs from budgets
        const ledgerIdsFromBudgets = new Set();

        budgets.forEach(budget => {
          if (budget.fundDetails?.ledgerId) {
            ledgerIdsFromBudgets.add(budget.fundDetails.ledgerId);
          }
        });

        // Filter ledgers to only those with budgets
        const filteredLedgers = ledgers.filter(l => ledgerIdsFromBudgets.has(l.id));

        // Build hierarchy from budgets
        const hierarchy = buildHierarchyFromBudgets(filteredLedgers, allGroups, budgets);
        const counts = calculateCounts(hierarchy);

        return { hierarchy, counts };
      }

      // Build hierarchy from finance data
      const hierarchy = buildHierarchyFromFinanceData(financeData, ledgersById, groupsById);
      const counts = calculateCounts(hierarchy);

      return { hierarchy, counts };
    },
    enabled: enabled && Boolean(fiscalYearId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    hierarchy: data?.hierarchy || [],
    counts: data?.counts || { ledgers: 0, groups: 0, funds: 0, budgets: 0, expenseClasses: 0 },
    isLoading,
    isFetching,
    refetch,
  };
};

export default useBrowseHierarchy;
