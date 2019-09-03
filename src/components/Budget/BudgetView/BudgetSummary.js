import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

const BudgetSummary = ({ budget }) => (
  <Row>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.allocated" />}
      >
        <AmountWithCurrencyField
          amount={budget.allocated}
        />
      </KeyValue>
    </Col>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.unavailable" />}
      >
        <AmountWithCurrencyField
          amount={budget.unavailable}
        />
      </KeyValue>
    </Col>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.available" />}
      >
        <AmountWithCurrencyField
          amount={budget.available}
        />
      </KeyValue>
    </Col>
  </Row>
);

BudgetSummary.propTypes = {
  budget: PropTypes.object,
};

BudgetSummary.defaultProps = {
  budget: {},
};

export default BudgetSummary;
