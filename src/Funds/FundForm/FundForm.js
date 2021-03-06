import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router';
import {
  find,
  get,
} from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import { useOkapiKy } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  KeyValue,
  Pane,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AcqUnitsField,
  FieldMultiSelectionFinal as FieldMultiSelection,
  FieldSelectionFinal as FieldSelection,
  FormFooter,
  FUNDS_API,
  handleKeyCommand,
  validateRequired,
} from '@folio/stripes-acq-components';

import { FieldFundGroups } from '../FundGroups';
import {
  CREATE_UNITS_PERM,
  FUNDS_ROUTE,
  MANAGE_UNITS_PERM,
} from '../../common/const';
import { validateDuplicateFieldValue } from '../../common/utils';
import {
  FUND_STATUSES_OPTIONS,
  SECTIONS_FUND,
} from '../constants';

const itemToString = item => item;

const FundForm = ({
  handleSubmit,
  form,
  onCancel,
  pristine,
  submitting,
  values: formValues,
  funds,
  fundTypes,
  ledgers,
  systemCurrency,
}) => {
  const ky = useOkapiKy();
  const accordionStatusRef = useRef();
  const history = useHistory();
  const fundTypeOptions = fundTypes.map(
    ({ name, id }) => ({
      label: name,
      value: id,
    }),
  );
  const initialValues = get(form.getState(), 'initialValues', {
    fund: {},
    groupIds: [],
  });
  const fundId = initialValues.fund.id;
  const fundLedgerId = get(formValues, 'fund.ledgerId');

  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const validateFundName = useCallback(
    (fieldValue) => {
      const errorMessage = <FormattedMessage id="ui-finance.fund.name.isInUse" />;
      const query = `name == "${fieldValue}" and ledgerId == "${fundLedgerId}"`;
      const params = {
        ky,
        api: FUNDS_API,
        id: fundId,
        fieldValue,
        errorMessage,
        fieldName: 'name',
        query,
      };

      return validateDuplicateFieldValue(params);
    },
    [fundId, fundLedgerId],
  );

  const validateFundCode = useCallback(
    (fieldValue) => {
      const errorMessage = <FormattedMessage id="ui-finance.fund.code.isInUse" />;
      const params = {
        ky,
        api: FUNDS_API,
        id: fundId,
        fieldValue,
        errorMessage,
        fieldName: 'code',
      };

      return validateDuplicateFieldValue(params);
    },
    [fundId],
  );

  const ledgerOptions = ledgers.map(
    ({ name, id, currency }) => ({
      label: name,
      value: id,
      currency,
    }),
  );

  const paneTitle = fundId
    ? initialValues.fund.name
    : <FormattedMessage id="ui-finance.fund.paneTitle.create" />;
  const metadata = initialValues.fund.metadata;
  const selectedLedger = find(ledgerOptions, ['value', fundLedgerId]);
  const fundCurrency = get(selectedLedger, 'currency') || systemCurrency;
  const fundOptions = funds.map(({ id }) => id);

  const formatter = ({ option }) => {
    const item = find(funds, { id: option }) || option;

    if (!item) return option;

    return item.name;
  };

  const filter = (filterText, list) => {
    const renderedItems = filterText
      ? funds
        .filter(fund => fund.name.toLowerCase().includes(filterText.toLowerCase()))
        .map(({ id }) => id)
      : list;

    return { renderedItems };
  };

  const isEditMode = Boolean(fundId);

  const paneFooter = (
    <FormFooter
      label={<FormattedMessage id="ui-finance.saveAndClose" />}
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
      handler: handleKeyCommand(() => history.push(FUNDS_ROUTE)),
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
            id="pane-fund-form"
            onClose={closeForm}
            paneSub={initialValues.fund.code}
            paneTitle={paneTitle}
          >
            <Row>
              <Col
                xs={12}
                md={8}
                mdOffset={2}
              >
                <AccordionStatus ref={accordionStatusRef}>
                  <Row end="xs">
                    <Col xs={12}>
                      <ExpandAllButton />
                    </Col>
                  </Row>
                  <AccordionSet>
                    <Accordion
                      id={SECTIONS_FUND.INFORMATION}
                      label={<FormattedMessage id="ui-finance.fund.information.title" />}
                    >
                      {metadata && <ViewMetaData metadata={metadata} />}
                      <Row>
                        <Col
                          data-test-col-name
                          xs={3}
                        >
                          <Field
                            component={TextField}
                            label={<FormattedMessage id="ui-finance.fund.information.name" />}
                            name="fund.name"
                            type="text"
                            required
                            validate={validateFundName}
                            validateFields={[]}
                          />
                        </Col>

                        <Col
                          data-test-col-code
                          xs={3}
                        >
                          <Field
                            component={TextField}
                            label={<FormattedMessage id="ui-finance.fund.information.code" />}
                            name="fund.code"
                            type="text"
                            required
                            validate={validateFundCode}
                            validateFields={[]}
                          />
                        </Col>

                        <Col
                          data-test-col-ledger
                          xs={3}
                        >
                          <FieldSelection
                            dataOptions={ledgerOptions}
                            labelId="ui-finance.fund.information.ledger"
                            name="fund.ledgerId"
                            required
                            validateFields={['fund.name']}
                          />
                        </Col>

                        <Col
                          data-test-col-status
                          xs={3}
                        >
                          <FieldSelection
                            dataOptions={FUND_STATUSES_OPTIONS}
                            labelId="ui-finance.fund.information.status"
                            name="fund.fundStatus"
                            required
                            validate={validateRequired}
                            validateFields={[]}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col
                          data-test-col-currency
                          xs={3}
                        >
                          <KeyValue
                            label={<FormattedMessage id="ui-finance.fund.information.currency" />}
                            value={fundCurrency}
                          />
                        </Col>

                        <Col
                          data-test-col-type
                          xs={3}
                        >
                          <FieldSelection
                            dataOptions={fundTypeOptions}
                            labelId="ui-finance.fund.information.type"
                            name="fund.fundTypeId"
                            validateFields={[]}
                          />
                        </Col>

                        <Col data-test-col-fund-form-acq-units xs={3}>
                          <AcqUnitsField
                            name="fund.acqUnitIds"
                            perm={isEditMode ? MANAGE_UNITS_PERM : CREATE_UNITS_PERM}
                            id="fund-acq-units"
                            isEdit={isEditMode}
                            isFinal
                            preselectedUnits={initialValues.fund.acqUnitIds}
                          />
                        </Col>
                        <Col
                          data-test-col-group
                          xs={3}
                        >
                          <FieldFundGroups name="groupIds" />
                        </Col>
                      </Row>

                      <Row>
                        <Col
                          data-test-col-transfer-from
                          xs={3}
                        >
                          <FieldMultiSelection
                            dataOptions={fundOptions}
                            label={<FormattedMessage id="ui-finance.fund.information.transferFrom" />}
                            name="fund.allocatedFromIds"
                            itemToString={itemToString}
                            formatter={formatter}
                            filter={filter}
                            validateFields={[]}
                          />
                        </Col>

                        <Col
                          data-test-col-transfer-to
                          xs={3}
                        >
                          <FieldMultiSelection
                            dataOptions={fundOptions}
                            label={<FormattedMessage id="ui-finance.fund.information.transferTo" />}
                            name="fund.allocatedToIds"
                            itemToString={itemToString}
                            formatter={formatter}
                            filter={filter}
                            validateFields={[]}
                          />
                        </Col>

                        <Col
                          data-test-col-external-account
                          xs={3}
                        >
                          <Field
                            component={TextField}
                            label={<FormattedMessage id="ui-finance.fund.information.externalAccount" />}
                            name="fund.externalAccountNo"
                            type="text"
                            required
                            validate={validateRequired}
                            validateFields={[]}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          data-test-col-description
                          xs={6}
                        >
                          <Field
                            component={TextArea}
                            label={<FormattedMessage id="ui-finance.fund.information.description" />}
                            name="fund.description"
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

FundForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object,  // form object to get initialValues with composite fund
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,  // current form values with composite fund
  systemCurrency: PropTypes.string,
  funds: PropTypes.arrayOf(PropTypes.object),
  fundTypes: PropTypes.arrayOf(PropTypes.object),
  ledgers: PropTypes.arrayOf(PropTypes.object),
};

FundForm.defaultProps = {
  funds: [],
  fundTypes: [],
  ledgers: [],
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
  validateOnBlur: true,
})(FundForm);
