import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Loading,
  Icon,
} from '@folio/stripes/components';

import HierarchyRow from './HierarchyRow';
import HierarchyControls from './HierarchyControls';
import css from './BrowseHierarchy.css';

const RECORD_TYPES = {
  LEDGER: 'ledger',
  GROUP: 'group',
  FUND: 'fund',
  BUDGET: 'budget',
  EXPENSE_CLASS: 'expenseClass',
};

/**
 * Component that renders the hierarchical finance structure.
 */
const BrowseHierarchy = ({
  hierarchy,
  fiscalYearCode,
  isLoading,
}) => {
  // Track expanded state for each level
  const [expandedLedgers, setExpandedLedgers] = useState(new Set());
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [expandedFunds, setExpandedFunds] = useState(new Set());
  const [expandedBudgets, setExpandedBudgets] = useState(new Set());

  // Calculate all IDs for each level
  const allIds = useMemo(() => {
    const ledgerIds = new Set();
    const groupIds = new Set();
    const fundIds = new Set();
    const budgetIds = new Set();

    (hierarchy || []).forEach(ledger => {
      ledgerIds.add(ledger.id);
      ledger.groups?.forEach(group => {
        groupIds.add(`${ledger.id}-${group.id}`);
        group.funds?.forEach(fund => {
          fundIds.add(`${ledger.id}-${group.id}-${fund.id}`);
          fund.budgets?.forEach(budget => {
            budgetIds.add(`${ledger.id}-${group.id}-${fund.id}-${budget.id}`);
          });
        });
      });
    });

    return { ledgerIds, groupIds, fundIds, budgetIds };
  }, [hierarchy]);

  // Check if all items at a level are expanded
  const allLedgersExpanded = expandedLedgers.size === allIds.ledgerIds.size && allIds.ledgerIds.size > 0;
  const allGroupsExpanded = expandedGroups.size === allIds.groupIds.size && allIds.groupIds.size > 0;
  const allFundsExpanded = expandedFunds.size === allIds.fundIds.size && allIds.fundIds.size > 0;
  const allBudgetsExpanded = expandedBudgets.size === allIds.budgetIds.size && allIds.budgetIds.size > 0;

  // Toggle handlers for individual items
  const toggleLedger = useCallback((ledgerId) => {
    setExpandedLedgers(prev => {
      const next = new Set(prev);

      if (next.has(ledgerId)) {
        next.delete(ledgerId);
      } else {
        next.add(ledgerId);
      }

      return next;
    });
  }, []);

  const toggleGroup = useCallback((groupKey) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);

      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }

      return next;
    });
  }, []);

  const toggleFund = useCallback((fundKey) => {
    setExpandedFunds(prev => {
      const next = new Set(prev);

      if (next.has(fundKey)) {
        next.delete(fundKey);
      } else {
        next.add(fundKey);
      }

      return next;
    });
  }, []);

  const toggleBudget = useCallback((budgetKey) => {
    setExpandedBudgets(prev => {
      const next = new Set(prev);

      if (next.has(budgetKey)) {
        next.delete(budgetKey);
      } else {
        next.add(budgetKey);
      }

      return next;
    });
  }, []);

  // Toggle all handlers
  const toggleAllLedgers = useCallback(() => {
    if (allLedgersExpanded) {
      setExpandedLedgers(new Set());
    } else {
      setExpandedLedgers(new Set(allIds.ledgerIds));
    }
  }, [allLedgersExpanded, allIds.ledgerIds]);

  const toggleAllGroups = useCallback(() => {
    if (allGroupsExpanded) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(allIds.groupIds));
    }
  }, [allGroupsExpanded, allIds.groupIds]);

  const toggleAllFunds = useCallback(() => {
    if (allFundsExpanded) {
      setExpandedFunds(new Set());
    } else {
      setExpandedFunds(new Set(allIds.fundIds));
    }
  }, [allFundsExpanded, allIds.fundIds]);

  const toggleAllBudgets = useCallback(() => {
    if (allBudgetsExpanded) {
      setExpandedBudgets(new Set());
    } else {
      setExpandedBudgets(new Set(allIds.budgetIds));
    }
  }, [allBudgetsExpanded, allIds.budgetIds]);

  if (isLoading) {
    return (
      <div className={css.loadingContainer}>
        <Loading size="large" />
      </div>
    );
  }

  if (!hierarchy || hierarchy.length === 0) {
    return (
      <div className={css.emptyContainer}>
        <Icon icon="search" size="large" className={css.emptyIcon} />
        <FormattedMessage id="ui-finance.browse.hierarchy.noResults" />
      </div>
    );
  }

  const renderBudgets = (budgets, fundKey) => {
    return budgets.map(budget => {
      const budgetKey = `${fundKey}-${budget.id}`;
      const isBudgetExpanded = expandedBudgets.has(budgetKey);
      const hasExpenseClasses = budget.expenseClasses && budget.expenseClasses.length > 0;

      return (
        <React.Fragment key={budgetKey}>
          <HierarchyRow
            type={RECORD_TYPES.BUDGET}
            id={budget.id}
            name={budget.name}
            code={budget.code}
            status={budget.status}
            level={4}
            isExpanded={isBudgetExpanded}
            hasChildren={hasExpenseClasses}
            onToggle={() => toggleBudget(budgetKey)}
          />
          {isBudgetExpanded && hasExpenseClasses && (
            budget.expenseClasses.map(expenseClass => (
              <HierarchyRow
                key={`${budgetKey}-${expenseClass.id}`}
                type={RECORD_TYPES.EXPENSE_CLASS}
                id={expenseClass.id}
                name={expenseClass.name}
                status={expenseClass.status}
                level={5}
                hasChildren={false}
              />
            ))
          )}
        </React.Fragment>
      );
    });
  };

  const renderFunds = (funds, groupKey) => {
    return funds.map(fund => {
      const fundKey = `${groupKey}-${fund.id}`;
      const isFundExpanded = expandedFunds.has(fundKey);
      const hasBudgets = fund.budgets && fund.budgets.length > 0;

      return (
        <React.Fragment key={fundKey}>
          <HierarchyRow
            type={RECORD_TYPES.FUND}
            id={fund.id}
            name={fund.name}
            code={fund.code}
            status={fund.status}
            level={3}
            isExpanded={isFundExpanded}
            hasChildren={hasBudgets}
            onToggle={() => toggleFund(fundKey)}
          />
          {isFundExpanded && hasBudgets && renderBudgets(fund.budgets, fundKey)}
        </React.Fragment>
      );
    });
  };

  const renderGroups = (groups, ledgerId) => {
    return groups.map(group => {
      const groupKey = `${ledgerId}-${group.id}`;
      const isGroupExpanded = expandedGroups.has(groupKey);
      const hasFunds = group.funds && group.funds.length > 0;

      return (
        <React.Fragment key={groupKey}>
          <HierarchyRow
            type={RECORD_TYPES.GROUP}
            id={group.id}
            name={group.name}
            code={group.code}
            status={group.status}
            level={2}
            isExpanded={isGroupExpanded}
            hasChildren={hasFunds}
            onToggle={() => toggleGroup(groupKey)}
            isUngrouped={group.isUngrouped}
          />
          {isGroupExpanded && hasFunds && renderFunds(group.funds, groupKey)}
        </React.Fragment>
      );
    });
  };

  const renderLedgers = () => {
    return hierarchy.map(ledger => {
      const isLedgerExpanded = expandedLedgers.has(ledger.id);
      const hasGroups = ledger.groups && ledger.groups.length > 0;

      return (
        <React.Fragment key={ledger.id}>
          <HierarchyRow
            type={RECORD_TYPES.LEDGER}
            id={ledger.id}
            name={ledger.name}
            code={ledger.code}
            status={ledger.status}
            level={1}
            isExpanded={isLedgerExpanded}
            hasChildren={hasGroups}
            onToggle={() => toggleLedger(ledger.id)}
          />
          {isLedgerExpanded && hasGroups && renderGroups(ledger.groups, ledger.id)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={css.hierarchyContainer}>
      <HierarchyControls
        allLedgersExpanded={allLedgersExpanded}
        allGroupsExpanded={allGroupsExpanded}
        allFundsExpanded={allFundsExpanded}
        allBudgetsExpanded={allBudgetsExpanded}
        onToggleLedgers={toggleAllLedgers}
        onToggleGroups={toggleAllGroups}
        onToggleFunds={toggleAllFunds}
        onToggleBudgets={toggleAllBudgets}
      />
      <div className={css.fiscalYearHeader}>
        <span className={css.fiscalYearLabel}>
          <FormattedMessage id="ui-finance.browse.hierarchy.fiscalYear" />
        </span>
        {fiscalYearCode}
      </div>
      {renderLedgers()}
    </div>
  );
};

BrowseHierarchy.propTypes = {
  hierarchy: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string,
    status: PropTypes.string,
    groups: PropTypes.array,
  })),
  fiscalYearCode: PropTypes.string,
  isLoading: PropTypes.bool,
};

BrowseHierarchy.defaultProps = {
  hierarchy: [],
  fiscalYearCode: '',
  isLoading: false,
};

export default BrowseHierarchy;
