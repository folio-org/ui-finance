import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import stripesForm from '@folio/stripes/form';
import {
  Button,
  Col,
  Modal,
  ModalFooter,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelect,
  validateRequired,
} from '@folio/stripes-acq-components';

import { FiscalYearField } from '../../../common/FiscalYearField';
import { ADD_BUDGET_MODAL_FORM, BUDGET_STATUSES_OPTIONS } from '../constants';

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

const BudgetAddModal = ({ handleSubmit, onClose, label }) => (
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
          />
        </Col>
        <Col xs>
          <FieldSelect
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
            label={<FormattedMessage id="ui-finance.budget.allowableExpenditure" />}
            name="allowableExpenditure"
          />
        </Col>
        <Col xs>
          <Field
            component={TextField}
            label={<FormattedMessage id="ui-finance.budget.allowableEncumbrance" />}
            name="allowableEncumbrance"
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

BudgetAddModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  label: PropTypes.object,
};

export default stripesForm({
  form: ADD_BUDGET_MODAL_FORM,
})(BudgetAddModal);
