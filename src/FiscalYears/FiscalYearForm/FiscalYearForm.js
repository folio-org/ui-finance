import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

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
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsField,
  FieldDatepickerFinal,
  FormFooter,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  CREATE_UNITS_PERM,
  MANAGE_UNITS_PERM,
} from '../../common/const';
import {
  FISCAL_YEAR_ACCORDION_LABELS,
  FISCAL_YEAR_ACCORDION,
} from '../constants';

const CREATE_FISCAL_YEAR_TITLE = <FormattedMessage id="ui-finance.fiscalYear.form.title.create" />;
const EDIT_FISCAL_YEAR_TITLE = <FormattedMessage id="ui-finance.fiscalYear.form.title.edit" />;

const FiscalYearForm = ({
  onCancel,
  initialValues,
  handleSubmit,
  pristine,
  submitting,
}) => {
  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const isEditMode = Boolean(initialValues.id);
  const metadata = initialValues.metadata;

  const paneFooter = (
    <FormFooter
      label={<FormattedMessage id="ui-finance.saveAndClose" />}
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
      onCancel={closeForm}
    />
  );

  return (
    <form>
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
              <AccordionStatus>
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
                        />
                      </Col>

                      <Col xs={4}>
                        <Field
                          component={TextField}
                          label={<FormattedMessage id="ui-finance.fiscalYear.information.code" />}
                          name="code"
                          type="text"
                          required
                          validate={validateRequired}
                        />
                      </Col>

                      <Col xs={4}>
                        <AcqUnitsField
                          name="acqUnitIds"
                          perm={isEditMode ? MANAGE_UNITS_PERM : CREATE_UNITS_PERM}
                          isEdit={isEditMode}
                          isFinal
                          preselectedUnits={initialValues.acqUnitIds}
                        />
                      </Col>

                      <Col xs={4}>
                        <FieldDatepickerFinal
                          labelId="ui-finance.fiscalYear.information.periodStart"
                          name="periodStart"
                          required
                          validate={validateRequired}
                        />
                      </Col>

                      <Col xs={4}>
                        <FieldDatepickerFinal
                          labelId="ui-finance.fiscalYear.information.periodEnd"
                          name="periodEnd"
                          required
                          validate={validateRequired}
                        />
                      </Col>

                      <Col xs={12}>
                        <Field
                          component={TextArea}
                          label={<FormattedMessage id="ui-finance.fiscalYear.information.description" />}
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

FiscalYearForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.object,
};

FiscalYearForm.defaultProps = {
  initialValues: {},
};

export default stripesForm({
  navigationCheck: true,
})(FiscalYearForm);
