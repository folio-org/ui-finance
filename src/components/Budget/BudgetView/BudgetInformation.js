import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

const BudgetInformation = ({ budget, fiscalStart, fiscalEnd }) => (
  <Row>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.name" />}
        value={budget.name}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.code" />}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.allocationDate" />}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.status" />}
        value={budget.budgetStatus}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.fiscalStart" />}
      >
        <FolioFormattedDate value={fiscalStart} />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.fiscalEnd" />}
      >
        <FolioFormattedDate value={fiscalEnd} />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.allowableExpenditure" />}
        value={budget.allowableExpenditure}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.allowableEncumbrance" />}
        value={budget.allowableEncumbrance}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.encumbered" />}
      >
        <AmountWithCurrencyField
          amount={budget.encumbered}
        />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.awaitingPayment" />}
      >
        <AmountWithCurrencyField
          amount={budget.awaitingPayment}
        />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.expended" />}
      >
        <AmountWithCurrencyField
          amount={budget.expenditures}
        />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.actionsRequired" />}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.description" />}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.transactions" />}
      />
    </Col>
  </Row>
);

BudgetInformation.propTypes = {
  budget: PropTypes.object,
  fiscalEnd: PropTypes.string,
  fiscalStart: PropTypes.string,
};

BudgetInformation.defaultProps = {
  budget: {},
  fiscalEnd: '',
  fiscalStart: '',
};

export default BudgetInformation;
