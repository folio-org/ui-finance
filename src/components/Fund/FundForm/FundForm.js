import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  getFormValues,
} from 'redux-form';
import {
  find,
  get,
  sortBy,
} from 'lodash';

import { stripesShape } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FieldMultiSelection,
  FieldSelection,
  useAccordionToggle,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  FUND_FORM,
  SECTIONS_FUND,
  FUND_STATUSES_OPTIONS,
} from '../constants';

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
  change,
  dispatch,
  handleSubmit,
  initialValues,
  onCancel,
  parentResources,
  pristine,
  stripes,
  submitting,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();

  const selectLedger = useCallback(
    (e, selectedLedgerId) => (
      dispatch(change('ledgerId', selectedLedgerId))
    ),
    [change, dispatch],
  );

  const funds = sortBy(get(parentResources, ['records', 'records'], []), 'name');
  const fundTypes = get(parentResources, ['fundTypes', 'records'], []).map(
    ({ name, id }) => ({
      label: name,
      value: id,
    }),
  );
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
  const formValues = getFormValues(FUND_FORM)(stripes.store.getState());
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
                        validate={validateRequired}
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
                        validate={validateRequired}
                      />
                    </Col>

                    <Col
                      data-test-col-ledger
                      xs={3}
                    >
                      <FieldSelection
                        dataOptions={ledgers}
                        label={<FormattedMessage id="ui-finance.fund.information.ledger" />}
                        onChange={selectLedger}
                        name="ledgerId"
                        required
                        validate={validateRequired}
                      />
                    </Col>

                    <Col
                      data-test-col-status
                      xs={3}
                    >
                      <FieldSelection
                        dataOptions={FUND_STATUSES_OPTIONS}
                        label={<FormattedMessage id="ui-finance.fund.information.status" />}
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
                      <Field
                        component={TextField}
                        label={<FormattedMessage id="ui-finance.fund.information.currency" />}
                        value={fundCurrency}
                        disabled
                      />
                    </Col>

                    <Col
                      data-test-col-type
                      xs={3}
                    >
                      <FieldSelection
                        dataOptions={fundTypes}
                        label={<FormattedMessage id="ui-finance.fund.information.type" />}
                        name="fundTypeId"
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
  change: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  parentResources: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  stripes: stripesShape.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.object,
};

FundForm.defaultProps = {
  initialValues: {},
};

export default stripesForm({
  form: FUND_FORM,
  navigationCheck: true,
})(FundForm);
