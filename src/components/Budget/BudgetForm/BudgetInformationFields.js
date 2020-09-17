import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FieldSelectFinal,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

import { BUDGET_STATUSES_OPTIONS } from '../constants';

const BudgetInformationFields = ({
  awaitingPayment,
  encumbered,
  expended,
  fiscalEnd,
  fiscalStart,
  fiscalYearCurrency,
}) => (
  <Row>
    <Col xs={3}>
      <Field
        component={TextField}
        fullWidth
        label={<FormattedMessage id="ui-finance.budget.name" />}
        name="name"
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.allocationDate" />}
        value={<NoValue />}
      />
    </Col>

    <Col xs={3}>
      <FieldSelectFinal
        dataOptions={BUDGET_STATUSES_OPTIONS}
        id="budget-status"
        label={<FormattedMessage id="ui-finance.budget.status" />}
        name="budgetStatus"
        required
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.fiscalStart" />}
        value={<FolioFormattedDate value={fiscalStart} />}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.fiscalEnd" />}
        value={<FolioFormattedDate value={fiscalEnd} />}
      />
    </Col>

    <Col xs={3}>
      <Field
        component={TextField}
        label={<FormattedMessage id="ui-finance.budget.allowableExpenditure" />}
        name="allowableExpenditure"
      />
    </Col>

    <Col xs={3}>
      <Field
        component={TextField}
        label={<FormattedMessage id="ui-finance.budget.allowableEncumbrance" />}
        name="allowableEncumbrance"
      />
    </Col>

    <Col xs={3}>
      <KeyValue label={<FormattedMessage id="ui-finance.budget.encumbered" />}>
        <AmountWithCurrencyField
          amount={encumbered}
          currency={fiscalYearCurrency}
        />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue label={<FormattedMessage id="ui-finance.budget.awaitingPayment" />}>
        <AmountWithCurrencyField
          amount={awaitingPayment}
          currency={fiscalYearCurrency}
        />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue label={<FormattedMessage id="ui-finance.budget.expended" />}>
        <AmountWithCurrencyField
          amount={expended}
          currency={fiscalYearCurrency}
        />
      </KeyValue>
    </Col>
  </Row>
);

BudgetInformationFields.propTypes = {
  awaitingPayment: PropTypes.number,
  encumbered: PropTypes.number,
  expended: PropTypes.number,
  fiscalEnd: PropTypes.string,
  fiscalStart: PropTypes.string,
  fiscalYearCurrency: PropTypes.string,
};

export default BudgetInformationFields;
