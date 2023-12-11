import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { List } from '@folio/stripes/components';

import { FundLocationsListItem } from './FundLocationsListItem';

export const FundLocationsList = ({ fields, locations }) => {
  const items = useMemo(() => {
    return (fields.value || [])
      .map((locationId) => locations.find(location => locationId === location.id) || {})
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [fields?.value, locations]);

  const onRemove = useCallback((location) => {
    const indexToRemove = (fields.value || []).findIndex((locationId) => locationId === location.id);

    if (indexToRemove > -1) {
      fields.remove(indexToRemove);
    }
  }, [fields.value, fields.remove]);

  const itemFormatter = useCallback((location, index) => {
    return (
      <FundLocationsListItem
        location={location}        
        index={index}
        onRemove={onRemove}
      />
    )
  }, [onRemove]);

  return (
    <List
      items={items}
      itemFormatter={itemFormatter}
      isEmptyMessage={<FormattedMessage id="ui-finance.fund.information.locations.empty" />}
    />
  )
};
