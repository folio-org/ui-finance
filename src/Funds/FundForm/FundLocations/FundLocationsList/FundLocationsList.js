import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { List } from '@folio/stripes/components';

export const FundLocationsList = ({ items }) => {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.localeCompare(b))
  }, [items]);

  return (
    <List
      items={sortedItems}
      // itemFormatter={itemFormatter}
      isEmptyMessage={<FormattedMessage id="ui-finance.fund.information.locations.empty" />}
    />
  )
};
