import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
} from '@folio/stripes-acq-components';

import { FINANCIAL_SUMMARY } from '../constants';
import { getFinacialActivityData } from '../utils';
import css from '../styles.css';

const visibleColumns = ['financialDescription', 'financialAmount'];
const columnMapping = {
  financialDescription: <FormattedMessage id="ui-finance.financialSummary.description" />,
  financialAmount: <FormattedMessage id="ui-finance.financialSummary.amount" />,
};

const FinancialActivity = ({ data, currency }) => {
  const contentData = useMemo(() => getFinacialActivityData(data), [data]);
  const resultsFormatter = useMemo(() => ({
    financialAmount: item => {
      const isBold = item.description === FINANCIAL_SUMMARY.unavailable;

      return (
        <div className={isBold ? css.boldAmount : ''}>
          <AmountWithCurrencyField
            amount={item.amount}
            currency={currency}
          />
        </div>
      );
    },
    financialDescription: item => item.label,
  }), [currency]);

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={contentData}
      formatter={resultsFormatter}
      visibleColumns={visibleColumns}
      interactive={false}
    />
  );
};

FinancialActivity.propTypes = {
  data: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
};

export default FinancialActivity;
