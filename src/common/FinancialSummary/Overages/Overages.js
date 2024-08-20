import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { MultiColumnList } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
} from '@folio/stripes-acq-components';

import { getOveragesData } from '../utils';

const visibleColumns = ['description', 'amount'];
const columnMapping = {
  description: null,
  amount: null,
};

const Overages = ({ data, currency }) => {
  const contentData = useMemo(() => getOveragesData(data), [data]);
  const resultsFormatter = useMemo(() => ({
    amount: item => (
      <AmountWithCurrencyField
        amount={item.amount}
        currency={currency}
        showBrackets={item.amount < 0}
      />
    ),
    description: item => item.label,
  }), [currency]);

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={contentData}
      formatter={resultsFormatter}
      visibleColumns={visibleColumns}
      interactive={false}
      columnIdPrefix="financial-overages"
    />
  );
};

Overages.propTypes = {
  data: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
};

export default Overages;
