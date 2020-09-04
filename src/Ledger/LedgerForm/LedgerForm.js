import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  Pane,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsField,
  FieldSelectionFinal,
  validateRequired,
  FormFooter,
} from '@folio/stripes-acq-components';

import { FiscalYearField } from '../../common/FiscalYearField';
import {
  CREATE_UNITS_PERM,
  MANAGE_UNITS_PERM,
} from '../../common/const';
import {
  LEDGER_ACCORDTION_LABELS,
  LEDGER_ACCORDTION,
  LEDGER_STATUS_OPTIONS,
} from '../constants';

const CREATE_LEDGER_TITLE = <FormattedMessage id="ui-finance.ledger.form.title.create" />;
const EDIT_LEDGER_TITLE = <FormattedMessage id="ui-finance.ledger.form.title.edit" />;
const SAVE_AND_CLOSE_TITLE = <FormattedMessage id="ui-finance.saveAndClose" />;

const LedgerForm = ({
  goToCreateFY,
  handleSubmit,
  initialValues,
  onCancel,
  submitting,
  pristine,
}) => {
  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const isEditMode = Boolean(initialValues.id);
  const paneFooter = (
    <FormFooter
      label={SAVE_AND_CLOSE_TITLE}
      handleSubmit={handleSubmit}
      submitting={submitting}
      onCancel={closeForm}
      pristine={pristine}
    />
  );
  const metadata = initialValues.metadata;

  return (
    <form>
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-ledger-form"
          onClose={closeForm}
          footer={paneFooter}
          paneTitle={isEditMode ? EDIT_LEDGER_TITLE : CREATE_LEDGER_TITLE}
        >
          <Row>
            <Col
              xs={12}
              md={8}
              mdOffset={2}
            >
              <AccordionStatus>
                <Row end="xs">
                  <Col xs={12}>
                    <ExpandAllButton />
                  </Col>
                </Row>
                <AccordionSet>
                  <Accordion
                    id={LEDGER_ACCORDTION.information}
                    label={LEDGER_ACCORDTION_LABELS.information}
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

                      <Col
                        data-test-col-ledger-form-fy
                        xs={3}
                      >
                        <FiscalYearField
                          label={<FormattedMessage id="ui-finance.ledger.fiscalYear" />}
                          name="fiscalYearOneId"
                          required
                        />
                        <IfPermission perm="finance.fiscal-years.item.post">
                          <Button
                            buttonStyle="link bottomMargin0"
                            data-test-ledger-create-fy
                            onClick={goToCreateFY}
                          >
                            <FormattedMessage id="ui-finance.ledger.createNewFY" />
                          </Button>
                        </IfPermission>
                      </Col>

                      <Col data-test-col-ledger-form-status xs={3}>
                        <FieldSelectionFinal
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
                          id="ledger-acq-units"
                          isEdit={isEditMode}
                          preselectedUnits={initialValues.acqUnitIds}
                          isFinal
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
                  </Accordion>
                </AccordionSet>
              </AccordionStatus>
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
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.func.isRequired,
};

LedgerForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
})(LedgerForm);
