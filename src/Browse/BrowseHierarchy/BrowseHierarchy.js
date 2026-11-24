import PropTypes from 'prop-types';
import {
  useCallback,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  DEFAULT_EXPANDED_NODE_TYPES,
  EXPANDABLE_NODE_TYPES,
} from '../constants';
import { getVisibleRows } from '../utils';
import css from './BrowseHierarchy.css';
import HierarchyControls from './HierarchyControls';
import HierarchyRow from './HierarchyRow';

const getKeys = (keysByType, type) => keysByType[type] || [];

/*
  The expanded state is initialized once from the first hierarchy it receives,
  so render it with a `key` of the fiscal year to start over when the fiscal year changes.
*/
const BrowseHierarchy = ({
  fiscalYearName,
  hierarchy,
  keysByType,
}) => {
  const [expandedKeys, setExpandedKeys] = useState(
    () => new Set(DEFAULT_EXPANDED_NODE_TYPES.flatMap(type => getKeys(keysByType, type))),
  );

  const toggleNode = useCallback((key) => {
    setExpandedKeys(current => {
      const next = new Set(current);

      if (!next.delete(key)) next.add(key);

      return next;
    });
  }, []);

  const toggleType = useCallback((type) => {
    setExpandedKeys(current => {
      const keys = getKeys(keysByType, type);
      const next = new Set(current);

      if (keys.every(key => current.has(key))) {
        keys.forEach(key => next.delete(key));
      } else {
        keys.forEach(key => next.add(key));
      }

      return next;
    });
  }, [keysByType]);

  const expandedTypes = Object.fromEntries(EXPANDABLE_NODE_TYPES.map(type => {
    const keys = getKeys(keysByType, type);

    return [type, keys.length > 0 && keys.every(key => expandedKeys.has(key))];
  }));

  return (
    <div className={css.hierarchy}>
      <div className={css.header}>
        <FormattedMessage id="ui-finance.browse.hierarchy.header" />

        <HierarchyControls
          expandedTypes={expandedTypes}
          onToggleType={toggleType}
        />
      </div>

      <div className={css.fiscalYear}>{fiscalYearName}</div>

      <div className={css.rows}>
        {getVisibleRows(hierarchy, expandedKeys).map(({ node, level, isExpanded }) => (
          <HierarchyRow
            key={node.key}
            isExpanded={isExpanded}
            level={level}
            node={node}
            onToggle={toggleNode}
          />
        ))}
      </div>
    </div>
  );
};

BrowseHierarchy.propTypes = {
  fiscalYearName: PropTypes.string,
  hierarchy: PropTypes.arrayOf(PropTypes.object).isRequired,
  keysByType: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default BrowseHierarchy;
