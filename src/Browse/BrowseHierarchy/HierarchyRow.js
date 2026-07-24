import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Icon,
} from '@folio/stripes/components';

import {
  BROWSE_ROUTE,
} from '../../common/const';

import css from './BrowseHierarchy.css';

const RECORD_TYPES = {
  FISCAL_YEAR: 'fiscalYear',
  LEDGER: 'ledger',
  GROUP: 'group',
  FUND: 'fund',
  BUDGET: 'budget',
  EXPENSE_CLASS: 'expenseClass',
};

const INDENT_SIZE = 24; // pixels per level

const getRecordLink = (type, id) => {
  switch (type) {
    case RECORD_TYPES.LEDGER:
      return `${BROWSE_ROUTE}/ledger/${id}/view`;
    case RECORD_TYPES.GROUP:
      return id !== 'ungrouped' ? `${BROWSE_ROUTE}/group/${id}/view` : null;
    case RECORD_TYPES.FUND:
      return `${BROWSE_ROUTE}/fund/${id}/view`;
    case RECORD_TYPES.BUDGET:
      return `${BROWSE_ROUTE}/budget/${id}/view`;
    default:
      return null;
  }
};

const HierarchyRow = ({
  type,
  id,
  name,
  code,
  status,
  level,
  isExpanded,
  hasChildren,
  onToggle,
  isUngrouped,
}) => {
  const indent = level * INDENT_SIZE;
  const link = getRecordLink(type, id);
  const showCode = code && !isUngrouped;
  const showStatus = status && !isUngrouped;

  const handleToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle?.();
  }, [onToggle]);

  const renderName = () => {
    const displayName = showCode ? `${name} (${code})` : name;

    if (link) {
      return (
        <Link to={link} className={css.hierarchyLink}>
          {displayName}
        </Link>
      );
    }

    return <span>{displayName}</span>;
  };

  const renderExpandIcon = () => {
    if (!hasChildren) {
      return <span className={css.expandIconPlaceholder} />;
    }

    return (
      <button
        type="button"
        className={css.expandButton}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      >
        <Icon icon={isExpanded ? 'caret-down' : 'caret-right'} size="small" />
      </button>
    );
  };

  const renderRecordType = () => {
    const typeLabels = {
      [RECORD_TYPES.LEDGER]: 'ui-finance.browse.hierarchy.type.ledger',
      [RECORD_TYPES.GROUP]: 'ui-finance.browse.hierarchy.type.group',
      [RECORD_TYPES.FUND]: 'ui-finance.browse.hierarchy.type.fund',
      [RECORD_TYPES.BUDGET]: 'ui-finance.browse.hierarchy.type.budget',
      [RECORD_TYPES.EXPENSE_CLASS]: 'ui-finance.browse.hierarchy.type.expenseClass',
    };

    return (
      <span className={css.recordType}>
        <FormattedMessage id={typeLabels[type]} />
      </span>
    );
  };

  return (
    <div
      className={css.hierarchyRow}
      style={{ paddingLeft: `${indent}px` }}
      data-type={type}
      data-id={id}
    >
      <div className={css.rowContent}>
        {renderExpandIcon()}
        {renderRecordType()}
        <span className={css.separator}>–</span>
        {renderName()}
        {showStatus && (
          <>
            <span className={css.separator}>–</span>
            <span className={css.status}>{status}</span>
          </>
        )}
      </div>
    </div>
  );
};

HierarchyRow.propTypes = {
  type: PropTypes.oneOf(Object.values(RECORD_TYPES)).isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string,
  status: PropTypes.string,
  level: PropTypes.number.isRequired,
  isExpanded: PropTypes.bool,
  hasChildren: PropTypes.bool,
  onToggle: PropTypes.func,
  isUngrouped: PropTypes.bool,
};

HierarchyRow.defaultProps = {
  code: '',
  status: '',
  isExpanded: false,
  hasChildren: false,
  onToggle: null,
  isUngrouped: false,
};

export default HierarchyRow;
