import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  FolioFormattedDate,
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
  </Row>
);

BudgetInformationFields.propTypes = {
  fiscalEnd: PropTypes.string,
  fiscalStart: PropTypes.string,
};

export default BudgetInformationFields;
