import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
} from '@folio/stripes-acq-components';

import { FINANCIAL_SUMMARY } from '../constants';
import { getFundingData } from '../utils';
import css from '../styles.css';

const visibleColumns = ['fundingDescription', 'fundingAmount'];
const columnMapping = {
  fundingDescription: <FormattedMessage id="ui-finance.financialSummary.description" />,
  fundingAmount: <FormattedMessage id="ui-finance.financialSummary.amount" />,
};

const FundingInformation = ({ data, currency }) => {
  const contentData = useMemo(() => getFundingData(data), [data]);
  const resultsFormatter = useMemo(() => ({
    fundingAmount: item => {
      const showBrackets = item.description === FINANCIAL_SUMMARY.netTransfers && item.amount < 0;
      const isBold = (
        item.description === FINANCIAL_SUMMARY.allocated || item.description === FINANCIAL_SUMMARY.totalFunding
      );

      return (
        <div className={isBold ? css.boldAmount : ''}>
          <AmountWithCurrencyField
            amount={item.amount}
            currency={currency}
            showBrackets={showBrackets}
          />
        </div>
      );
    },
    fundingDescription: item => item.label,
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

FundingInformation.propTypes = {
  data: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
};

export default FundingInformation;
