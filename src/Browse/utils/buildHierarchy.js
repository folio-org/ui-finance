import {
  HIERARCHY_NODE_TYPES,
  UNGROUPED_NODE_ID,
} from '../constants';

const {
  BUDGET,
  EXPENSE_CLASS,
  FUND,
  GROUP,
  LEDGER,
} = HIERARCHY_NODE_TYPES;

const compareByName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

/*
  A node is any row of the hierarchy. Its key is the path from the ledger down to the node, because
  the same group can be listed under several ledgers and the same record can't be used as a React or expanded key.
*/
const createNode = (type, parentKey, { id, name, code, status }) => ({
  key: parentKey ? `${parentKey}/${id}` : id,
  id,
  type,
  name: name || '',
  code,
  status,
  children: [],
});

const buildBudget = (fundKey, budget) => {
  const node = createNode(BUDGET, fundKey, {
    id: budget.budgetId,
    name: budget.budgetName,
    status: budget.budgetStatus,
  });

  node.children = (budget.budgetExpenseClasses || [])
    .map(({ expenseClassId, expenseClassName, status }) => createNode(EXPENSE_CLASS, node.key, {
      id: expenseClassId,
      name: expenseClassName,
      status,
    }))
    .sort(compareByName);

  return node;
};

const buildFund = (parentKey, fund) => {
  const node = createNode(FUND, parentKey, {
    id: fund.fundId,
    name: fund.fundName,
    code: fund.fundCode,
  });

  if (fund.budget) node.children = [buildBudget(node.key, fund.budget)];

  return node;
};

const buildFunds = (parentKey, funds = []) => funds.map(fund => buildFund(parentKey, fund)).sort(compareByName);

const buildGroup = (ledgerKey, group) => {
  const node = createNode(GROUP, ledgerKey, {
    id: group.groupId,
    name: group.groupName,
    code: group.groupCode,
  });

  node.children = buildFunds(node.key, group.funds);

  return node;
};

const buildUngroupedGroup = (ledgerKey, funds) => {
  const node = createNode(GROUP, ledgerKey, { id: UNGROUPED_NODE_ID });

  node.isUngrouped = true;
  node.children = buildFunds(node.key, funds);

  return node;
};

const buildLedger = (ledger) => {
  const node = createNode(LEDGER, null, {
    id: ledger.ledgerId,
    name: ledger.ledgerName,
    code: ledger.ledgerCode,
  });

  node.children = (ledger.groups || [])
    .map(group => buildGroup(node.key, group))
    .sort(compareByName);

  if (ledger.funds?.length) node.children.push(buildUngroupedGroup(node.key, ledger.funds));

  return node;
};

const summarize = (hierarchy) => {
  const idsByType = {};
  const keysByType = {};

  const visit = (node) => {
    // the synthetic "Ungrouped" group is not a record, so it is not counted
    if (!node.isUngrouped) {
      idsByType[node.type] = idsByType[node.type] || new Set();
      idsByType[node.type].add(node.id);
    }

    keysByType[node.type] = keysByType[node.type] || [];
    keysByType[node.type].push(node.key);

    node.children.forEach(visit);
  };

  hierarchy.forEach(visit);

  const countOf = (type) => idsByType[type]?.size || 0;

  return {
    counts: {
      ledgers: countOf(LEDGER),
      groups: countOf(GROUP),
      funds: countOf(FUND),
      budgets: countOf(BUDGET),
      expenseClasses: countOf(EXPENSE_CLASS),
    },
    keysByType,
  };
};

/*
  Turns the `finance-storage/fiscal-year-hierarchy` response (one entry per ledger) into a tree of nodes:
  Ledger > Group > Fund > Budget > Expense class, sorted by name on every level, with a synthetic
  "Ungrouped" group last in each ledger that has funds without a group.
*/
export const buildHierarchy = ({ fiscalYearHierarchies = [] } = {}) => {
  const hierarchy = fiscalYearHierarchies.map(buildLedger).sort(compareByName);

  return {
    hierarchy,
    ...summarize(hierarchy),
  };
};
