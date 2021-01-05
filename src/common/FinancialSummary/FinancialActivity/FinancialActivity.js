import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  Headline,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
} from '@folio/stripes-acq-components';

import { FINANCIAL_SUMMARY } from '../constants';
import { getFinacialActivityData } from '../utils';

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
        <Headline weight={isBold ? 'bold' : 'regular'} margin="none">
          <AmountWithCurrencyField
            amount={item.amount}
            currency={currency}
          />
        </Headline>
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
