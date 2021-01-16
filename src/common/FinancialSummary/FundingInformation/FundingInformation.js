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
import { getFundingData } from '../utils';

const visibleColumns = ['fundingDescription', 'fundingAmount'];
const columnMapping = {
  fundingDescription: <FormattedMessage id="ui-finance.financialSummary.description" />,
  fundingAmount: <FormattedMessage id="ui-finance.financialSummary.amount" />,
};

const FundingInformation = ({ data, currency, isFiscalYear }) => {
  const contentData = useMemo(() => getFundingData(data, isFiscalYear), [data, isFiscalYear]);
  const resultsFormatter = useMemo(() => ({
    fundingAmount: item => {
      const showBrackets = (
        item.description === FINANCIAL_SUMMARY.netTransfers ||
        item.description === FINANCIAL_SUMMARY.allocationFrom ||
        item.description === FINANCIAL_SUMMARY.allocationTo
      ) && item.amount < 0;
      const isBold = (
        item.description === FINANCIAL_SUMMARY.allocated || item.description === FINANCIAL_SUMMARY.totalFunding
      );

      return (
        <Headline weight={isBold ? 'bold' : 'regular'} margin="none">
          <AmountWithCurrencyField
            amount={item.amount}
            currency={currency}
            showBrackets={showBrackets}
          />
        </Headline>
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
  isFiscalYear: PropTypes.bool,
};

FundingInformation.defaultProps = {
  isFiscalYear: false,
};

export default FundingInformation;
