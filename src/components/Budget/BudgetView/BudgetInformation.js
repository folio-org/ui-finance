import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

import {
  BUDGET_ROUTE,
  BUDGET_TRANSACTIONS_ROUTE,
} from '../../../common/const';

const BudgetInformation = ({
  allowableEncumbrance,
  allowableExpenditure,
  awaitingPayment,
  budgetStatus,
  encumbered,
  expenditures,
  fiscalEnd,
  fiscalStart,
  name,
  id,
}) => (
  <Row>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.name" />}
        value={name}
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
        value={budgetStatus}
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
      <KeyValue label={<FormattedMessage id="ui-finance.budget.allowableExpenditure" />}>
        {`${allowableExpenditure}%`}
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue label={<FormattedMessage id="ui-finance.budget.allowableEncumbrance" />}>
        {`${allowableEncumbrance}%`}
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.encumbered" />}
      >
        <AmountWithCurrencyField
          amount={encumbered}
        />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.awaitingPayment" />}
      >
        <AmountWithCurrencyField
          amount={awaitingPayment}
        />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.expended" />}
      >
        <AmountWithCurrencyField
          amount={expenditures}
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
        label={<FormattedMessage id="ui-finance.budget.transactions" />}
      >
        <Link to={`${BUDGET_ROUTE}${id}${BUDGET_TRANSACTIONS_ROUTE}`}>
          <FormattedMessage id="ui-finance.budget.transactions.view" />
        </Link>
      </KeyValue>
    </Col>
  </Row>
);

BudgetInformation.propTypes = {
  allowableEncumbrance: PropTypes.number,
  allowableExpenditure: PropTypes.number,
  awaitingPayment: PropTypes.number,
  budgetStatus: PropTypes.string,
  encumbered: PropTypes.number,
  expenditures: PropTypes.number,
  fiscalEnd: PropTypes.string,
  fiscalStart: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
};

BudgetInformation.defaultProps = {
  allowableEncumbrance: 0,
  allowableExpenditure: 0,
  awaitingPayment: 0,
  budgetStatus: '',
  encumbered: 0,
  expenditures: 0,
  fiscalEnd: '',
  fiscalStart: '',
  name: '',
};

export default BudgetInformation;
