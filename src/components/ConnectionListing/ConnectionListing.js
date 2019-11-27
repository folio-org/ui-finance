import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  Layout,
  MultiColumnList,
} from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

const defaultColumns = ['name', 'code', 'allocated', 'unavailable', 'available'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.item.name" />,
  code: <FormattedMessage id="ui-finance.item.code" />,
  allocated: <FormattedMessage id="ui-finance.item.allocated" />,
  unavailable: <FormattedMessage id="ui-finance.item.unavailable" />,
  available: <FormattedMessage id="ui-finance.item.available" />,
};

const ConnectionListing = ({ items, currency, openItem, visibleColumns }) => {
  const resultsFormatter = {
    allocated: item => (
      <AmountWithCurrencyField
        amount={item.allocated}
        currency={currency}
      />
    ),
    unavailable: item => (
      <AmountWithCurrencyField
        amount={item.unavailable}
        currency={currency}
      />
    ),
    available: item => (
      <AmountWithCurrencyField
        amount={item.available}
        currency={currency}
      />
    ),
  };

  return (
    <Fragment>
      <MultiColumnList
        columnMapping={columnMapping}
        contentData={items}
        formatter={resultsFormatter}
        onRowClick={openItem}
        visibleColumns={visibleColumns}
      />
      <Layout className="textCentered">
        <Icon icon="end-mark">
          <FormattedMessage id="stripes-components.endOfList" />
        </Icon>
      </Layout>
    </Fragment>
  );
};

ConnectionListing.propTypes = {
  openItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

ConnectionListing.defaultProps = {
  items: [],
  currency: '',
  visibleColumns: defaultColumns,
};

export default ConnectionListing;
