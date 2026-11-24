import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import {
  EXPANDABLE_NODE_TYPES,
  HIERARCHY_NODE_TYPES,
} from '../constants';
import css from './BrowseHierarchy.css';

const MESSAGE_IDS = {
  [HIERARCHY_NODE_TYPES.LEDGER]: {
    collapse: 'ui-finance.browse.hierarchy.collapseLedgers',
    expand: 'ui-finance.browse.hierarchy.expandLedgers',
  },
  [HIERARCHY_NODE_TYPES.GROUP]: {
    collapse: 'ui-finance.browse.hierarchy.collapseGroups',
    expand: 'ui-finance.browse.hierarchy.expandGroups',
  },
  [HIERARCHY_NODE_TYPES.FUND]: {
    collapse: 'ui-finance.browse.hierarchy.collapseFunds',
    expand: 'ui-finance.browse.hierarchy.expandFunds',
  },
  [HIERARCHY_NODE_TYPES.BUDGET]: {
    collapse: 'ui-finance.browse.hierarchy.collapseBudgets',
    expand: 'ui-finance.browse.hierarchy.expandBudgets',
  },
};

const HierarchyControls = ({ expandedTypes, onToggleType }) => (
  <div className={css.controls}>
    {EXPANDABLE_NODE_TYPES.map((type, index) => (
      <Fragment key={type}>
        {index > 0 && <span aria-hidden="true">|</span>}
        <Button
          buttonStyle="link"
          data-testid={`toggle-${type}`}
          onClick={() => onToggleType(type)}
        >
          <FormattedMessage id={MESSAGE_IDS[type][expandedTypes[type] ? 'collapse' : 'expand']} />
        </Button>
      </Fragment>
    ))}
  </div>
);

HierarchyControls.propTypes = {
  expandedTypes: PropTypes.objectOf(PropTypes.bool).isRequired,
  onToggleType: PropTypes.func.isRequired,
};

export default HierarchyControls;
