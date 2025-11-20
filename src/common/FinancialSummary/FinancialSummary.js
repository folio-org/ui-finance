import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Headline,
  Row,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import FinancialActivity from './FinancialActivity';
import FundingInformation from './FundingInformation';
import Overages from './Overages';

import css from './styles.css';

const DEFAULT_DATA = {};

const FinancialSummary = ({
  data = DEFAULT_DATA,
  fiscalYearCurrency,
  isFiscalYear = false,
}) => {
  const cashBalance = (
    <AmountWithCurrencyField
      amount={data.cashBalance}
      currency={fiscalYearCurrency}
      showBrackets={data.cashBalance < 0}
    />
  );

  const availableBalance = (
    <AmountWithCurrencyField
      amount={data.available}
      currency={fiscalYearCurrency}
      showBrackets={data.available < 0}
    />
  );

  return (
    <>
      <Row>
        <Col xs={6}>
          <Headline margin="none">
            <FormattedMessage id="ui-finance.financialSummary.fundingInformation" />
          </Headline>

          <FundingInformation
            data={data}
            currency={fiscalYearCurrency}
            isFiscalYear={isFiscalYear}
          />
        </Col>

        <Col xs={6}>
          <Headline margin="none">
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
  data: PropTypes.object,
  fiscalYearCurrency: PropTypes.string.isRequired,
  isFiscalYear: PropTypes.bool,
};

export default FinancialSummary;
