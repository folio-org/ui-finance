import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import stripesForm from '@folio/stripes/form';
import {
  Button,
  Col,
  Pane,
  PaneFooter,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsField,
  FieldSelection,
  validateRequired,
} from '@folio/stripes-acq-components';

import { FiscalYearField } from '../../../common/FiscalYearField';
import {
  CREATE_UNITS_PERM,
  MANAGE_UNITS_PERM,
} from '../../../common/const';
import {
  LEDGER_FORM,
  LEDGER_STATUS_OPTIONS,
} from '../constants';

const CREATE_LEDGER_TITLE = <FormattedMessage id="ui-finance.ledger.form.title.create" />;
const EDIT_LEDGER_TITLE = <FormattedMessage id="ui-finance.ledger.form.title.edit" />;

const getPaneFooter = (handleSubmit, pristine, submitting, onCancel) => {
  const start = (
    <Button
      data-test-button-close-ledger
      buttonStyle="default mega"
      onClick={onCancel}
    >
      <FormattedMessage id="ui-finance.close" />
    </Button>
  );

  const end = (
    <Button
      data-test-button-save-ledger
      type="submit"
      buttonStyle="primary mega"
      disabled={submitting}
      onClick={handleSubmit}
    >
      <FormattedMessage id="ui-finance.saveAndClose" />
    </Button>
  );

  return (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
    />
  );
};

const LedgerForm = ({
  goToCreateFY,
  handleSubmit,
  initialValues,
  onCancel,
  pristine,
  submitting,
}) => {
  const isEditMode = Boolean(initialValues.id);
  const paneFooter = getPaneFooter(handleSubmit, pristine, submitting, onCancel);
  const metadata = initialValues.metadata;

  return (
    <form>
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-ledger-form"
          onClose={onCancel}
          footer={paneFooter}
          paneTitle={isEditMode ? EDIT_LEDGER_TITLE : CREATE_LEDGER_TITLE}
        >
          <Row>
            <Col
              xs={12}
              md={8}
              mdOffset={2}
            >
              {metadata && <ViewMetaData metadata={metadata} />}
              <Row>
                <Col data-test-col-ledger-form-name xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id="ui-finance.ledger.name" />}
                    name="name"
                    type="text"
                    required
                    validate={validateRequired}
                  />
                </Col>

                <Col data-test-col-ledger-form-code xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id="ui-finance.ledger.code" />}
                    name="code"
                    type="text"
                    required
                    validate={validateRequired}
                  />
                </Col>

                <Col xs>
                  <FiscalYearField
                    label={<FormattedMessage id="ui-finance.ledger.fiscalYear" />}
                    name="fiscalYearOneId"
                    required
                  />
                  <Button
                    buttonStyle="link bottomMargin0"
                    data-test-ledger-create-fy
                    onClick={goToCreateFY}
                  >
                    <FormattedMessage id="ui-finance.ledger.createNewFY" />
                  </Button>
                </Col>

                <Col data-test-col-ledger-form-status xs={3}>
                  <FieldSelection
                    dataOptions={LEDGER_STATUS_OPTIONS}
                    id="ledger-status"
                    labelId="ui-finance.ledger.status"
                    name="ledgerStatus"
                    required
                    validate={validateRequired}
                  />
                </Col>

                <Col data-test-col-ledger-form-acq-units xs={3}>
                  <AcqUnitsField
                    name="acqUnitIds"
                    perm={isEditMode ? MANAGE_UNITS_PERM : CREATE_UNITS_PERM}
                    isEdit={isEditMode}
                    preselectedUnits={initialValues.acqUnitIds}
                  />
                </Col>

                <Col data-test-col-ledger-form-description xs={12}>
                  <Field
                    component={TextArea}
                    label={<FormattedMessage id="ui-finance.ledger.description" />}
                    name="description"
                    type="text"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </form>
  );
};

LedgerForm.propTypes = {
  goToCreateFY: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

LedgerForm.defaultProps = {
  initialValues: {},
};

export default stripesForm({
  form: LEDGER_FORM,
  navigationCheck: true,
})(LedgerForm);
