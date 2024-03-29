import React, { useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router';

import { useOkapiKy } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/final-form';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  Pane,
  Paneset,
  Row,
  TextArea,
  TextField,
  HasCommand,
  checkScope,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsField,
  FieldDatepickerFinal,
  FormFooter,
  handleKeyCommand,
  OptimisticLockingBanner,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  CREATE_UNITS_PERM,
  MANAGE_UNITS_PERM,
  FISCAL_YEARS_API,
  FISCAL_YEAR_ROUTE,
} from '../../common/const';
import {
  FISCAL_YEAR_ACCORDION_LABELS,
  FISCAL_YEAR_ACCORDION,
} from '../constants';
import { validateDuplicateFieldValue } from '../../common/utils';
import DebouncingValidatingField from './DebouncingValidatingField';

const CREATE_FISCAL_YEAR_TITLE = <FormattedMessage id="ui-finance.fiscalYear.form.title.create" />;
const EDIT_FISCAL_YEAR_TITLE = <FormattedMessage id="ui-finance.fiscalYear.form.title.edit" />;

const FiscalYearForm = ({
  onCancel,
  initialValues,
  handleSubmit,
  pristine,
  submitting,
  errorCode,
}) => {
  const ky = useOkapiKy();
  const accordionStatusRef = useRef();
  const history = useHistory();

  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const validateCode = useCallback(
    (fieldValue) => {
      const errorMessage = <FormattedMessage id="ui-finance.fiscalYear.code.isInUse" />;
      const params = {
        ky,
        api: FISCAL_YEARS_API,
        id: initialValues.id,
        fieldValue,
        errorMessage,
        fieldName: 'code',
      };

      return validateDuplicateFieldValue(params);
    },
    [initialValues.id],
  );

  const isEditMode = Boolean(initialValues.id);
  const metadata = initialValues.metadata;

  const paneFooter = (
    <FormFooter
      label={<FormattedMessage id="stripes-components.saveAndClose" />}
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
      onCancel={closeForm}
    />
  );

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
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
      handler: handleKeyCommand(() => history.push(FISCAL_YEAR_ROUTE)),
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
            footer={paneFooter}
            id="pane-fiscal-year-form"
            onClose={closeForm}
            paneTitle={isEditMode ? EDIT_FISCAL_YEAR_TITLE : CREATE_FISCAL_YEAR_TITLE}
          >
            <Row>
              <Col
                xs={12}
                md={8}
                mdOffset={2}
              >
                <OptimisticLockingBanner
                  errorCode={errorCode}
                  latestVersionLink={`${FISCAL_YEAR_ROUTE}/${initialValues.id}/view`}
                />
                <AccordionStatus ref={accordionStatusRef}>
                  <Row end="xs">
                    <Col xs={12}>
                      <ExpandAllButton />
                    </Col>
                  </Row>
                  <AccordionSet>
                    <Accordion
                      id={FISCAL_YEAR_ACCORDION.information}
                      label={FISCAL_YEAR_ACCORDION_LABELS.information}
                    >
                      {metadata && <ViewMetaData metadata={metadata} />}
                      <Row>
                        <Col xs={4}>
                          <Field
                            component={TextField}
                            label={<FormattedMessage id="ui-finance.fiscalYear.information.name" />}
                            name="name"
                            type="text"
                            required
                            validate={validateRequired}
                            validateFields={[]}
                          />
                        </Col>

                        <Col
                          xs={4}
                          data-test-col-fy-form-code
                        >
                          <DebouncingValidatingField
                            component={TextField}
                            label={<FormattedMessage id="ui-finance.fiscalYear.information.code" />}
                            name="code"
                            type="text"
                            required
                            validate={validateCode}
                            validateFields={[]}
                          />
                        </Col>

                        <Col xs={4}>
                          <AcqUnitsField
                            name="acqUnitIds"
                            perm={isEditMode ? MANAGE_UNITS_PERM : CREATE_UNITS_PERM}
                            id="fy-acq-units"
                            isEdit={isEditMode}
                            isFinal
                            preselectedUnits={initialValues.acqUnitIds}
                          />
                        </Col>

                        <Col xs={4}>
                          <FieldDatepickerFinal
                            labelId="ui-finance.fiscalYear.information.periodStartUTC"
                            name="periodStart"
                            required
                            validate={validateRequired}
                            validateFields={[]}
                          />
                        </Col>

                        <Col xs={4}>
                          <FieldDatepickerFinal
                            labelId="ui-finance.fiscalYear.information.periodEndUTC"
                            name="periodEnd"
                            required
                            validate={validateRequired}
                            validateFields={[]}
                          />
                        </Col>

                        <Col xs={12}>
                          <Field
                            component={TextArea}
                            label={<FormattedMessage id="ui-finance.fiscalYear.information.description" />}
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

FiscalYearForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.object,
  errorCode: PropTypes.string,
};

FiscalYearForm.defaultProps = {
  initialValues: {},
};

export default stripesForm({
  navigationCheck: true,
})(FiscalYearForm);
