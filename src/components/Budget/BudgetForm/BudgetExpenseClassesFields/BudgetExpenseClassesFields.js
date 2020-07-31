import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  KeyValue,
  Label,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  FieldSelectionFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import { EXPENSE_CLASS_STATUS_OPTIONS } from '../../constants';

const headLabels = (
  <Row>
    <Col xs>
      <Label
        id="budgetExpenseClassesFormNameLabel"
        required
      >
        <FormattedMessage id="ui-finance.budget.expenseClasses.expenseClassName" />
      </Label>
    </Col>

    <Col xs>
      <Label id="budgetExpenseClassesFormAccountNumberLabel">
        <FormattedMessage id="ui-finance.budget.expenseClasses.accountNumber" />
      </Label>
    </Col>

    <Col xs>
      <Label id="budgetExpenseClassesFormStatusLabel">
        <FormattedMessage id="ui-finance.budget.expenseClasses.status" />
      </Label>
    </Col>

    <Col xs>
      <Label id="budgetExpenseClassesFormExpendedLabel">
        <FormattedMessage id="ui-finance.budget.expenseClasses.expended" />
      </Label>
    </Col>
  </Row>
);

const BudgetExpenseClassesFields = ({ expenseClasses, values }) => {
  const expenseClassesOptions = useMemo(
    () => expenseClasses.map(({ id, name }) => ({
      label: name,
      value: id,
    })),
    [expenseClasses],
  );

  const getAccountNumberExt = useCallback(index => (
    expenseClasses.find(({ id }) => id === values.statusExpenseClasses[index].id)?.externalAccountNumberExt ?? null
  ), [values, expenseClasses]);

  const renderSubForm = (field, index) => {
    return (
      <Row>
        <Col xs>
          <FieldSelectionFinal
            ariaLabelledBy="budgetExpenseClassesFormNameLabel"
            dataOptions={expenseClassesOptions}
            fullWidth
            name={`${field}.id`}
            required
            validate={validateRequired}
          />
        </Col>
        <Col xs>
          <TextField
            ariaLabelledBy="budgetExpenseClassesFormAccountNumberLabel"
            value={getAccountNumberExt(index)}
            disabled
          />
        </Col>
        <Col xs>
          <FieldSelectFinal
            aria-labelledby="budgetExpenseClassesFormStatusLabel"
            dataOptions={EXPENSE_CLASS_STATUS_OPTIONS}
            fullWidth
            name={`${field}.status`}
          />
        </Col>
        <Col xs>
          <KeyValue
            ariaLabelledBy="budgetExpenseClassesFormExpendedLabel"
            value="-"
          />
        </Col>
      </Row>
    );
  };

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-finance.budget.expenseClasses.add" />}
      component={RepeatableField}
      headLabels={headLabels}
      id="budget-status-expense-classes"
      name="statusExpenseClasses"
      renderField={renderSubForm}
    />
  );
};

BudgetExpenseClassesFields.propTypes = {
  expenseClasses: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.object.isRequired,
};

export default BudgetExpenseClassesFields;
