import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { IconButton } from '@folio/stripes/components';

import { HIERARCHY_NODE_TYPES } from '../constants';
import css from './BrowseHierarchy.css';

const TYPE_MESSAGE_IDS = {
  [HIERARCHY_NODE_TYPES.LEDGER]: 'ui-finance.browse.hierarchy.type.ledger',
  [HIERARCHY_NODE_TYPES.GROUP]: 'ui-finance.browse.hierarchy.type.group',
  [HIERARCHY_NODE_TYPES.FUND]: 'ui-finance.browse.hierarchy.type.fund',
  [HIERARCHY_NODE_TYPES.BUDGET]: 'ui-finance.browse.hierarchy.type.budget',
  [HIERARCHY_NODE_TYPES.EXPENSE_CLASS]: 'ui-finance.browse.hierarchy.type.expenseClass',
};

const STATUS_MESSAGE_IDS = {
  [HIERARCHY_NODE_TYPES.LEDGER]: (status) => `ui-finance.ledger.status.${status.toLowerCase()}`,
  [HIERARCHY_NODE_TYPES.GROUP]: (status) => `ui-finance.groups.status.${status.toLowerCase()}`,
  [HIERARCHY_NODE_TYPES.FUND]: (status) => `ui-finance.fund.status.${status.toLowerCase()}`,
  [HIERARCHY_NODE_TYPES.BUDGET]: (status) => `ui-finance.budget.status.${status.toLowerCase()}`,
  [HIERARCHY_NODE_TYPES.EXPENSE_CLASS]: (status) => `ui-finance.budget.expenseClasses.status.${status}`,
};

const HierarchyRow = ({
  isExpanded,
  level,
  node,
  onToggle,
}) => {
  const intl = useIntl();

  const { code, children, isUngrouped, key, name, status, type } = node;
  const hasChildren = children.length > 0;

  const displayName = code ? `${name} (${code})` : name;

  return (
    <div
      className={css.row}
      data-testid={`hierarchy-row-${type}`}
      style={{ '--hierarchy-level': level }}
    >
      {hasChildren
        ? (
          <IconButton
            ariaLabel={intl.formatMessage({
              id: isExpanded ? 'ui-finance.browse.hierarchy.collapseRow' : 'ui-finance.browse.hierarchy.expandRow',
            }, { name: displayName })}
            aria-expanded={isExpanded}
            className={css.toggle}
            icon={isExpanded ? 'caret-up' : 'caret-down'}
            onClick={() => onToggle(key)}
          />
        )
        : <span className={css.togglePlaceholder} />
      }
      {!isUngrouped && (
        <>
          <span className={css.type}>
            <FormattedMessage id={TYPE_MESSAGE_IDS[type]} />
          </span>
          <span aria-hidden="true">–</span>
        </>
      )}
      <span className={isUngrouped ? css.type : undefined}>
        {isUngrouped ? <FormattedMessage id="ui-finance.browse.hierarchy.ungrouped" /> : displayName}
      </span>
      {status && (
        <>
          <span aria-hidden="true">–</span>
          <span>
            <FormattedMessage id={STATUS_MESSAGE_IDS[type](status)} />
          </span>
        </>
      )}
    </div>
  );
};

HierarchyRow.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  level: PropTypes.number.isRequired,
  node: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    code: PropTypes.string,
    isUngrouped: PropTypes.bool,
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string,
    type: PropTypes.oneOf(Object.values(HIERARCHY_NODE_TYPES)).isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default HierarchyRow;
