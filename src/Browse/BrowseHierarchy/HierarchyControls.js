import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import css from './BrowseHierarchy.css';

const HierarchyControls = ({
  allLedgersExpanded,
  allGroupsExpanded,
  allFundsExpanded,
  allBudgetsExpanded,
  onToggleLedgers,
  onToggleGroups,
  onToggleFunds,
  onToggleBudgets,
}) => {
  return (
    <div className={css.controlsBar}>
      <button
        type="button"
        className={css.controlLink}
        onClick={onToggleLedgers}
      >
        <FormattedMessage
          id={allLedgersExpanded
            ? 'ui-finance.browse.hierarchy.collapseLedgers'
            : 'ui-finance.browse.hierarchy.expandLedgers'}
        />
      </button>
      <span className={css.controlSeparator}>|</span>
      <button
        type="button"
        className={css.controlLink}
        onClick={onToggleGroups}
      >
        <FormattedMessage
          id={allGroupsExpanded
            ? 'ui-finance.browse.hierarchy.collapseGroups'
            : 'ui-finance.browse.hierarchy.expandGroups'}
        />
      </button>
      <span className={css.controlSeparator}>|</span>
      <button
        type="button"
        className={css.controlLink}
        onClick={onToggleFunds}
      >
        <FormattedMessage
          id={allFundsExpanded
            ? 'ui-finance.browse.hierarchy.collapseFunds'
            : 'ui-finance.browse.hierarchy.expandFunds'}
        />
      </button>
      <span className={css.controlSeparator}>|</span>
      <button
        type="button"
        className={css.controlLink}
        onClick={onToggleBudgets}
      >
        <FormattedMessage
          id={allBudgetsExpanded
            ? 'ui-finance.browse.hierarchy.collapseBudgets'
            : 'ui-finance.browse.hierarchy.expandBudgets'}
        />
      </button>
    </div>
  );
};

HierarchyControls.propTypes = {
  allLedgersExpanded: PropTypes.bool.isRequired,
  allGroupsExpanded: PropTypes.bool.isRequired,
  allFundsExpanded: PropTypes.bool.isRequired,
  allBudgetsExpanded: PropTypes.bool.isRequired,
  onToggleLedgers: PropTypes.func.isRequired,
  onToggleGroups: PropTypes.func.isRequired,
  onToggleFunds: PropTypes.func.isRequired,
  onToggleBudgets: PropTypes.func.isRequired,
};

export default HierarchyControls;

