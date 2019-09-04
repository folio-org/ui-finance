import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Col,
  Row,
  KeyValue,
  TextField,
  Datepicker,
} from '@folio/stripes/components';
import {
  FieldSelect,
} from '@folio/stripes-acq-components';
import { BUDGET_STATUSES_OPTIONS } from '../constants';

const BudgetInformationFields = ({
  fiscalEnd,
  fiscalStart,
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
      <Datepicker
        label={<FormattedMessage id="ui-finance.budget.allocationDate" />}
        disabled
      />
    </Col>

    <Col xs={3}>
      <FieldSelect
        dataOptions={BUDGET_STATUSES_OPTIONS}
        id="invoice-status"
        label={<FormattedMessage id="ui-finance.budget.status" />}
        name="budgetStatus"
        required
      />
    </Col>

    <Col xs={3}>
      <Datepicker
        label={<FormattedMessage id="ui-finance.budget.fiscalStart" />}
        value={fiscalStart}
        disabled
      />
    </Col>

    <Col xs={3}>
      <Datepicker
        label={<FormattedMessage id="ui-finance.budget.fiscalEnd" />}
        value={fiscalEnd}
        disabled
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
      <Field
        component={TextField}
        label={<FormattedMessage id="ui-finance.budget.encumbered" />}
        name="encumbered"
        disabled
      />
    </Col>

    <Col xs={3}>
      <Field
        component={TextField}
        label={<FormattedMessage id="ui-finance.budget.awaitingPayment" />}
        name="awaitingPayment"
        disabled
      />
    </Col>

    <Col xs={3}>
      <Field
        component={TextField}
        label={<FormattedMessage id="ui-finance.budget.expended" />}
        name="expended"
        disabled
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.transactions" />}
      />
    </Col>
  </Row>
);

BudgetInformationFields.propTypes = {
  fiscalEnd: PropTypes.string,
  fiscalStart: PropTypes.string,
};

BudgetInformationFields.defaultProps = {
  fiscalEnd: '',
  fiscalStart: '',
};

export default BudgetInformationFields;
