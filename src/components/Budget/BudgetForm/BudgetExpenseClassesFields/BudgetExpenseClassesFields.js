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
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  FieldSelectionFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  EXPENSE_CLASS_STATUS,
  EXPENSE_CLASS_STATUS_OPTIONS,
} from '../../constants';
import { getExpenseClassesForSelect } from '../../../../common/utils';

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
  </Row>
);

const BudgetExpenseClassesFields = ({ expenseClasses, formValues: { statusExpenseClasses } }) => {
  const expenseClassesOptions = useMemo(
    () => getExpenseClassesForSelect(expenseClasses),
    [expenseClasses],
  );

  const addFields = useCallback(fields => fields.push({ status: EXPENSE_CLASS_STATUS.ACTIVE }), []);

  const renderSubForm = useCallback((field, index) => {
    const getAccountNumberExt = () => (
      expenseClasses.find(({ id }) => (
        id === statusExpenseClasses[index].expenseClassId
      ))?.externalAccountNumberExt ?? null
    );

    return (
      <Row>
        <Col xs>
          <FieldSelectionFinal
            ariaLabelledBy="budgetExpenseClassesFormNameLabel"
            dataOptions={expenseClassesOptions}
            fullWidth
            name={`${field}.expenseClassId`}
            required
            validate={validateRequired}
          />
        </Col>
        <Col xs>
          <KeyValue
            ariaLabelledBy="budgetExpenseClassesFormAccountNumberLabel"
            value={getAccountNumberExt()}
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
      </Row>
    );
  }, [expenseClasses, statusExpenseClasses, expenseClassesOptions]);

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-finance.budget.expenseClasses.add" />}
      component={RepeatableField}
      headLabels={headLabels}
      id="budget-status-expense-classes"
      name="statusExpenseClasses"
      onAdd={addFields}
      renderField={renderSubForm}
    />
  );
};

BudgetExpenseClassesFields.propTypes = {
  expenseClasses: PropTypes.arrayOf(PropTypes.object).isRequired,
  formValues: PropTypes.object.isRequired,
};

export default BudgetExpenseClassesFields;
