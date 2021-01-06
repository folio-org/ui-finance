import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  Row,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import FundingInformation from './FundingInformation';
import FinancialActivity from './FinancialActivity';
import Overages from './Overages';
import css from './styles.css';

const FinancialSummary = ({ data, fiscalYearCurrency }) => {
  const cashBalance = (
    <AmountWithCurrencyField
      amount={data.cashBalance}
      currency={fiscalYearCurrency}
    />
  );

  const availableBalance = (
    <AmountWithCurrencyField
      amount={data.available}
      currency={fiscalYearCurrency}
    />
  );

  return (
    <>
      <Row>
        <Col xs={6}>
          <Headline>
            <FormattedMessage id="ui-finance.financialSummary.fundingInformation" />
          </Headline>

          <FundingInformation
            data={data}
            currency={fiscalYearCurrency}
          />
        </Col>

        <Col xs={6}>
          <Headline>
            <FormattedMessage id="ui-finance.financialSummary.financialActivity" />
          </Headline>

          <FinancialActivity
            data={data}
            currency={fiscalYearCurrency}
          />

          <Overages
            data={data}
            currency={fiscalYearCurrency}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={6}>
          <div className={css.balanceWrapper}>
            <AppIcon app="@folio/finance" size="small" className={css.icon} />
            <FormattedMessage id="ui-finance.financialSummary.cashBalance" values={{ cashBalance }} />
          </div>
        </Col>
        <Col xs={6}>
          <div className={css.balanceWrapper}>
            <AppIcon app="@folio/finance" size="small" className={css.icon} />
            <FormattedMessage id="ui-finance.financialSummary.availableBalance" values={{ availableBalance }} />
          </div>
        </Col>
      </Row>
    </>
  );
};

FinancialSummary.propTypes = {
  data: PropTypes.object.isRequired,
  fiscalYearCurrency: PropTypes.string.isRequired,
};

export default FinancialSummary;
