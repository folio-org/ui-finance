import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import {
  find,
  get,
  sortBy,
} from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  KeyValue,
  Pane,
  PaneMenu,
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
  useAccordionToggle,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  CREATE_UNITS_PERM,
  MANAGE_UNITS_PERM,
} from '../../../common/const';
import {
  SECTIONS_FUND,
  FUND_STATUSES_OPTIONS,
} from '../constants';
import {
  fetchFundsByCode,
  fetchFundsByNameAndLedger,
} from './fetchFunds';

const getLastMenu = (handleSubmit, pristine, submitting) => {
  return (
    <PaneMenu>
      <Button
        buttonStyle="primary"
        data-test-button-save-fund
        disabled={pristine || submitting}
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="ui-finance.fund.save" />
      </Button>
    </PaneMenu>
  );
};
const itemToString = item => item;

const FundForm = ({
  handleSubmit,
  initialValues,
  onCancel,
  parentResources,
  pristine,
  submitting,
  values: formValues,
  parentMutator: { fundsByName },
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const funds = sortBy(get(parentResources, ['records', 'records'], []), 'name');
  const fundTypes = get(parentResources, ['fundTypes', 'records'], []).map(
    ({ name, id }) => ({
      label: name,
      value: id,
    }),
  );

  const validateFundName = async value => {
    const errorRequired = validateRequired(value);

    if (errorRequired) {
      return errorRequired;
    }

    const existingFunds = await fetchFundsByNameAndLedger(fundsByName, formValues.id, value, formValues.ledgerId);

    if (existingFunds.length) return <FormattedMessage id="ui-finance.fund.name.isInUse" />;

    return undefined;
  };

  const validateFundCode = async value => {
    const errorRequired = validateRequired(value);

    if (errorRequired) {
      return errorRequired;
    }

    const existingFunds = await fetchFundsByCode(fundsByName, formValues.id, value);

    if (existingFunds.length) return <FormattedMessage id="ui-finance.fund.code.isInUse" />;

    return undefined;
  };

  const ledgers = get(parentResources, ['ledgers', 'records'], []).map(
    ({ name, id, currency }) => ({
      label: name,
      value: id,
      currency,
    }),
  );

  const lastMenu = getLastMenu(handleSubmit, pristine, submitting);
  const paneTitle = initialValues.id
    ? initialValues.name
    : <FormattedMessage id="ui-finance.fund.paneTitle.create" />;
  const metadata = initialValues.metadata;
  const selectedLedger = find(ledgers, ['value', formValues.ledgerId]);
  const fundCurrency = get(selectedLedger, 'currency', '');
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

  const isEditMode = Boolean(initialValues.id);

  return (
    <form>
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-fund-form"
          lastMenu={lastMenu}
          onClose={onCancel}
          paneTitle={paneTitle}
          paneSub={initialValues.code}
        >
          <Row>
            <Col
              xs={12}
              md={8}
              mdOffset={2}
            >
              <Row end="xs">
                <Col xs={12}>
                  <ExpandAllButton
                    accordionStatus={sections}
                    onToggle={expandAll}
                  />
                </Col>
              </Row>
              <AccordionSet
                accordionStatus={sections}
                onToggle={toggleSection}
              >
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
                        name="name"
                        type="text"
                        required
                        validate={validateFundName}
                      />
                    </Col>

                    <Col
                      data-test-col-code
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        label={<FormattedMessage id="ui-finance.fund.information.code" />}
                        name="code"
                        type="text"
                        required
                        validate={validateFundCode}
                      />
                    </Col>

                    <Col
                      data-test-col-ledger
                      xs={3}
                    >
                      <FieldSelection
                        dataOptions={ledgers}
                        labelId="ui-finance.fund.information.ledger"
                        name="ledgerId"
                        required
                      />
                    </Col>

                    <Col
                      data-test-col-status
                      xs={3}
                    >
                      <FieldSelection
                        dataOptions={FUND_STATUSES_OPTIONS}
                        labelId="ui-finance.fund.information.status"
                        name="fundStatus"
                        required
                        validate={validateRequired}
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
                        dataOptions={fundTypes}
                        labelId="ui-finance.fund.information.type"
                        name="fundTypeId"
                      />
                    </Col>

                    <Col data-test-col-fund-form-acq-units xs={3}>
                      <AcqUnitsField
                        name="acqUnitIds"
                        perm={isEditMode ? MANAGE_UNITS_PERM : CREATE_UNITS_PERM}
                        isEdit={isEditMode}
                        isFinal
                        preselectedUnits={initialValues.acqUnitIds}
                      />
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
                        name="allocatedFromIds"
                        itemToString={itemToString}
                        formatter={formatter}
                        filter={filter}
                      />
                    </Col>

                    <Col
                      data-test-col-transfer-to
                      xs={3}
                    >
                      <FieldMultiSelection
                        dataOptions={fundOptions}
                        label={<FormattedMessage id="ui-finance.fund.information.transferTo" />}
                        name="allocatedToIds"
                        itemToString={itemToString}
                        formatter={formatter}
                        filter={filter}
                      />
                    </Col>

                    <Col
                      data-test-col-external-account
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        label={<FormattedMessage id="ui-finance.fund.information.externalAccount" />}
                        name="externalAccountNo"
                        type="text"
                        required
                        validate={validateRequired}
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
                        name="description"
                        type="text"
                      />
                    </Col>
                  </Row>
                </Accordion>
              </AccordionSet>
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </form>
  );
};

FundForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  parentMutator: PropTypes.object.isRequired,
  parentResources: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
};

FundForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
  validateOnBlur: true,
})(FundForm);
