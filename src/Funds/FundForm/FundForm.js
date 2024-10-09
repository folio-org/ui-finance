import React, { useCallback, useMemo, useRef } from 'react';
import {
  find,
  get,
} from 'lodash';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useHistory } from 'react-router';

import {
  AcqUnitsField,
  Donors,
  ConsortiumLocationsContextProvider,
  FieldMultiSelectionFinal as FieldMultiSelection,
  FieldSelectionFinal as FieldSelection,
  FormFooter,
  FUNDS_API,
  handleKeyCommand,
  LocationsContextProvider,
  OptimisticLockingBanner,
  useCentralOrderingSettings,
  validateRequired,
} from '@folio/stripes-acq-components';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Checkbox,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  KeyValue,
  Loading,
  Pane,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  CREATE_UNITS_PERM,
  FUNDS_ROUTE,
  MANAGE_UNITS_PERM,
} from '../../common/const';
import { useLedgerCurrentFiscalYear } from '../../common/hooks';
import {
  getFormattedOptions,
  validateDuplicateFieldValue,
} from '../../common/utils';
import {
  FUND_STATUSES_OPTIONS,
  SECTIONS_FUND,
} from '../constants';
import { FieldFundGroups } from '../FundGroups';
import { FundLocations } from './FundLocations';

const parseMultiSelectionValue = (items) => items.map(({ value }) => value);

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
  errorCode,
}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const stripes = useStripes();
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
  const donorOrganizationIds = get(formValues, 'fund.donorOrganizationIds', []);
  const isLocationRestricted = get(formValues, 'fund.restrictByLocations', false);
  const assignedLocations = get(formValues, 'fund.locations');

  const { enabled: isCentralOrderingEnabled } = useCentralOrderingSettings({
    enabled: checkIfUserInCentralTenant(stripes),
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fundId, fundLedgerId],
  );

  const validateFundCode = useCallback(
    async (fieldValue) => {
      let validationMessage;

      if (fieldValue?.includes(':')) {
        validationMessage = <FormattedMessage id="ui-finance.validation.mustNotIncludeColon" />;
      } else {
        const errorMessage = <FormattedMessage id="ui-finance.fund.code.isInUse" />;
        const params = {
          ky,
          api: FUNDS_API,
          id: fundId,
          fieldValue,
          errorMessage,
          fieldName: 'code',
        };

        validationMessage = await validateDuplicateFieldValue(params);
      }

      return validationMessage;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fundId],
  );

  const ledgerOptions = useMemo(() => ledgers.map(
    ({ name, id, currency }) => ({
      label: name,
      value: id,
      currency,
    }),
  ), [ledgers]);

  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, FUND_STATUSES_OPTIONS), [intl]);

  const paneTitle = fundId
    ? initialValues.fund.name
    : <FormattedMessage id="ui-finance.fund.paneTitle.create" />;
  const metadata = initialValues.fund.metadata;

  const {
    currentFiscalYear,
    isLoading: isCurrentFYLoading,
  } = useLedgerCurrentFiscalYear(fundLedgerId);

  const fundOptions = useMemo(() => {
    return funds.map(({ id, name }) => ({ value: id, label: name }));
  }, [funds]);

  const formatFundsFieldValue = useCallback((parsedIds) => {
    return parsedIds?.map(id => {
      const fund = find(funds, { id });

      return {
        label: fund?.name || id,
        value: id,
      };
    });
  }, [funds]);

  const filter = useCallback((filterText, list) => {
    const renderedItems = filterText
      ? list.filter(({ label }) => label.toLowerCase().includes(filterText.toLowerCase()))
      : list;

    return { renderedItems };
  }, []);

  const isEditMode = Boolean(fundId);

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

  const FundLocationsContextProvider = isCentralOrderingEnabled
    ? ConsortiumLocationsContextProvider
    : LocationsContextProvider;

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
                <OptimisticLockingBanner
                  errorCode={errorCode}
                  latestVersionLink={`${FUNDS_ROUTE}/view/${fundId}`}
                />
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
                            validateFields={['fund.name', 'fund.code']}
                          />
                        </Col>

                        <Col
                          data-test-col-status
                          xs={3}
                        >
                          <FieldSelection
                            dataOptions={fundStatusOptions}
                            labelId="ui-finance.fund.information.status"
                            name="fund.fundStatus"
                            required
                            validate={validateRequired}
                            validateFields={['fund.name', 'fund.code']}
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
                            value={isCurrentFYLoading ? <Loading /> : currentFiscalYear?.currency}
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
                            validateFields={['fund.name', 'fund.code']}
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
                            parse={parseMultiSelectionValue}
                            format={formatFundsFieldValue}
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
                            parse={parseMultiSelectionValue}
                            format={formatFundsFieldValue}
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
                        <Col xs={6}>
                          <Field
                            component={Checkbox}
                            label={<FormattedMessage id="ui-finance.fund.information.restrictByLocations" />}
                            name="fund.restrictByLocations"
                            type="checkbox"
                            vertical
                            validateFields={[]}
                          />
                        </Col>
                      </Row>
                    </Accordion>

                    {isLocationRestricted && (
                      <Accordion
                        id={SECTIONS_FUND.LOCATIONS}
                        label={<FormattedMessage id="ui-finance.fund.information.locations" />}
                      >
                        <FundLocationsContextProvider>
                          <FundLocations
                            name="fund.locations"
                            assignedLocations={assignedLocations}
                            centralOrdering={isCentralOrderingEnabled}
                          />
                        </FundLocationsContextProvider>
                      </Accordion>
                    )}

                    <Accordion
                      closedByDefault
                      id={SECTIONS_FUND.DONOR_INFORMATION}
                      label={<FormattedMessage id="ui-finance.fund.information.donorInformation" />}
                    >
                      <Donors
                        name="fund.donorOrganizationIds"
                        donorOrganizationIds={donorOrganizationIds}
                      />
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
  funds: PropTypes.arrayOf(PropTypes.object),
  fundTypes: PropTypes.arrayOf(PropTypes.object),
  ledgers: PropTypes.arrayOf(PropTypes.object),
  errorCode: PropTypes.string,
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
