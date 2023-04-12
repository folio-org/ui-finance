import React, { useCallback, useMemo, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router';

import stripesFinalForm from '@folio/stripes/final-form';
import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Checkbox,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Pane,
  Paneset,
  Row,
  TextArea,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsField,
  FieldSelectionFinal,
  FormFooter,
  handleKeyCommand,
  OptimisticLockingBanner,
  validateRequired,
} from '@folio/stripes-acq-components';

import { FiscalYearField } from '../../common/FiscalYearField';
import {
  CREATE_UNITS_PERM,
  LEDGERS_ROUTE,
  MANAGE_UNITS_PERM,
} from '../../common/const';
import { getFormattedOptions } from '../../common/utils';
import {
  LEDGER_ACCORDION_LABELS,
  LEDGER_ACCORDION,
  LEDGER_STATUS_OPTIONS,
} from '../constants';
import FieldLedgerCode from './FieldLedgerCode';
import FieldLedgerName from './FieldLedgerName';

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
  errorCode,
}) => {
  const intl = useIntl();
  const accordionStatusRef = useRef();
  const history = useHistory();
  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const ledgerStatusOptions = useMemo(() => getFormattedOptions(intl, LEDGER_STATUS_OPTIONS), [intl]);

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

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(closeForm),
    },
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push(LEDGERS_ROUTE)),
    },
  ];

  return (
    <form>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
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
                <OptimisticLockingBanner
                  errorCode={errorCode}
                  latestVersionLink={`${LEDGERS_ROUTE}/${initialValues.id}/view`}
                />
                <AccordionStatus ref={accordionStatusRef}>
                  <Row end="xs">
                    <Col xs={12}>
                      <ExpandAllButton />
                    </Col>
                  </Row>
                  <AccordionSet>
                    <Accordion
                      id={LEDGER_ACCORDION.information}
                      label={LEDGER_ACCORDION_LABELS.information}
                    >
                      {metadata && <ViewMetaData metadata={metadata} />}
                      <Row>
                        <Col data-test-col-ledger-form-name xs={3}>
                          <FieldLedgerName ledgerId={initialValues.id} />
                        </Col>

                        <Col data-test-col-ledger-form-code xs={3}>
                          <FieldLedgerCode ledgerId={initialValues.id} />
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
                            dataOptions={ledgerStatusOptions}
                            id="ledger-status"
                            labelId="ui-finance.ledger.status"
                            name="ledgerStatus"
                            required
                            validate={validateRequired}
                            validateFields={['name', 'code']}
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

                        <Col data-test-col-ledger-form-encumbrance-restriction xs={3}>
                          <Field
                            component={Checkbox}
                            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictEncumbrance" />}
                            name="restrictEncumbrance"
                            type="checkbox"
                            validateFields={[]}
                            vertical
                          />
                        </Col>

                        <Col
                          xs={3}
                          data-test-col-ledger-form-restrict-expenditures
                        >
                          <Field
                            component={Checkbox}
                            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictExpenditures" />}
                            name="restrictExpenditures"
                            type="checkbox"
                            validateFields={[]}
                            vertical
                          />
                        </Col>

                        <Col data-test-col-ledger-form-description xs={12}>
                          <Field
                            component={TextArea}
                            label={<FormattedMessage id="ui-finance.ledger.description" />}
                            name="description"
                            type="text"
                            validateFields={[]}
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
      </HasCommand>
    </form>
  );
};

LedgerForm.propTypes = {
  goToCreateFY: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errorCode: PropTypes.string,
};

LedgerForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
  validateOnBlur: true,
})(LedgerForm);
