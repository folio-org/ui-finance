import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Col,
  Modal,
  ModalFooter,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import { FiscalYearField } from '../../../common/FiscalYearField';
import { BUDGET_STATUSES_OPTIONS } from '../constants';

const footer = (onClose, onSave) => (
  <ModalFooter>
    <Button
      buttonStyle="primary"
      data-test-add-budget-save
      onClick={onSave}
    >
      <FormattedMessage id="ui-finance.budget.save" />
    </Button>
    <Button
      data-test-add-budget-cancel
      onClick={onClose}
    >
      <FormattedMessage id="ui-finance.budget.button.cancel" />
    </Button>
  </ModalFooter>
);

const BudgetAddModalForm = ({ handleSubmit, onClose, label, disabled }) => (
  <Modal
    id="add-budget-modal"
    label={label}
    footer={footer(onClose, handleSubmit)}
    open
  >
    <form>
      <Row>
        <Col xs>
          <FiscalYearField
            name="fiscalYearId"
            required
            disabled={disabled}
          />
        </Col>
        <Col xs>
          <FieldSelectFinal
            dataOptions={BUDGET_STATUSES_OPTIONS}
            id="invoice-status"
            label={<FormattedMessage id="ui-finance.budget.status" />}
            name="budgetStatus"
            required
            validate={validateRequired}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <Field
            component={TextField}
            label={<FormattedMessage id="ui-finance.budget.allowableExpenditurePercentage" />}
            name="allowableExpenditure"
            type="number"
          />
        </Col>
        <Col xs>
          <Field
            component={TextField}
            label={<FormattedMessage id="ui-finance.budget.allowableEncumbrancePercentage" />}
            name="allowableEncumbrance"
            type="number"
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <Field
            component={TextField}
            label={<FormattedMessage id="ui-finance.budget.allocated" />}
            name="allocated"
            type="number"
            required
            validate={validateRequired}
          />
        </Col>
      </Row>
    </form>
  </Modal>
);

BudgetAddModalForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  label: PropTypes.object,
  disabled: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
})(BudgetAddModalForm);
