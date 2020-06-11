import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

const BudgetSummary = ({ budget, fiscalYearCurrency }) => (
  <Row>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.allocated" />}
      >
        <AmountWithCurrencyField
          amount={budget.allocated}
          currency={fiscalYearCurrency}
        />
      </KeyValue>
    </Col>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.unavailable" />}
      >
        <AmountWithCurrencyField
          amount={budget.unavailable}
          currency={fiscalYearCurrency}
        />
      </KeyValue>
    </Col>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.available" />}
      >
        <AmountWithCurrencyField
          amount={budget.available}
          currency={fiscalYearCurrency}
        />
      </KeyValue>
    </Col>
  </Row>
);

BudgetSummary.propTypes = {
  budget: PropTypes.object,
  fiscalYearCurrency: PropTypes.string,
};

BudgetSummary.defaultProps = {
  budget: {},
};

export default BudgetSummary;
