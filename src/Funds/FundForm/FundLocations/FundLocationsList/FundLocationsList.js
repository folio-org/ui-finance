import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { List } from '@folio/stripes/components';

import { FundLocationsListItem } from './FundLocationsListItem';

const DEFAULT_VALUE = [];

export const FundLocationsList = ({ fields, locations }) => {
  const { value = DEFAULT_VALUE, remove } = fields;

  const items = useMemo(() => {
    return value
      .map((locationId) => locations.find(location => locationId === location.id) || {})
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [value, locations]);

  const onRemove = useCallback((location) => {
    const indexToRemove = value.findIndex((locationId) => locationId === location.id);

    if (indexToRemove > -1) {
      remove(indexToRemove);
    }
  }, [value, remove]);

  const itemFormatter = useCallback((location, index) => {
    return (
      <FundLocationsListItem
        location={location}
        index={index}
        onRemove={onRemove}
      />
    );
  }, [onRemove]);

  return (
    <List
      items={items}
      itemFormatter={itemFormatter}
      isEmptyMessage={<FormattedMessage id="ui-finance.fund.information.locations.empty" />}
    />
  );
};

FundLocationsList.defaultProps = {
  locations: [],
};

FundLocationsList.propTypes = {
  fields: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.string),
    remove: PropTypes.func,
  }).isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    code: PropTypes.string,
  })),
};
