import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Checkbox,
  Col,
  Layout,
  Pane,
  PaneFooter,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import {
  CredentialsField,
  CredentialsProvider,
  Selection,
  TextField,
  usePaneFocus,
  validateRequired,
} from '@folio/stripes-acq-components';
import { TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  EXCHANGE_RATE_FIELDS_CONFIG_PROPS_MAP,
  EXCHANGE_RATE_PROVIDERS_OPTIONS,
  FORM_FIELDS_NAMES,
} from './constants';

const validateFieldAdapter = (value, allValues, { name }) => {
  const fieldConfig = EXCHANGE_RATE_FIELDS_CONFIG_PROPS_MAP
    .get(allValues[FORM_FIELDS_NAMES.providerType])
    ?.get(name);

  return fieldConfig?.validate?.(value);
};

const ExchangeRateSourceForm = ({
  form,
  handleSubmit,
  isNonInteractive = false,
}) => {
  const intl = useIntl();
  const { paneTitleRef } = usePaneFocus();

  const {
    pristine,
    submitting,
    values,
  } = form.getState();

  const isEnabled = values[FORM_FIELDS_NAMES.enabled];
  const isSubmitDisabled = pristine || submitting || isNonInteractive;
  const paneTitle = intl.formatMessage({ id: 'ui-finance.settings.exchangeRateSource.title' });
  const providerType = values[FORM_FIELDS_NAMES.providerType];

  const renderHeader = useCallback((headerProps) => (
    <PaneHeader
      {...headerProps}
      paneTitle={paneTitle}
    />
  ), [paneTitle]);

  const footerEnd = (
    <Row>
      <Col xs>
        <Button
          buttonStyle="primary"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          marginBottom0
        >
          <FormattedMessage id="stripes-acq-components.button.save" />
        </Button>
      </Col>
    </Row>
  );

  return (
    <Pane
      id="exchange-rate-source-settings"
      defaultWidth="fill"
      footer={<PaneFooter renderEnd={footerEnd} />}
      paneTitleRef={paneTitleRef}
      renderHeader={renderHeader}
    >
      <TitleManager record={paneTitle} />
      <Layout className="padding-bottom-gutter">
        <FormattedMessage id="ui-finance.settings.exchangeRateSource.description" />
      </Layout>
      <form id="exchange-rate-source-settings-form">
        <Layout className="padding-bottom-gutter">
          <Row>
            <Col xs>
              <Field
                component={Checkbox}
                disabled={isNonInteractive}
                label={<FormattedMessage id="ui-finance.settings.exchangeRateSource.form.field.enabled" />}
                name={FORM_FIELDS_NAMES.enabled}
                type="checkbox"
              />
            </Col>
          </Row>
        </Layout>

        {isEnabled && (
          <>
            <Row>
              <Col xs>
                <Field
                  component={Selection}
                  isNonInteractive={isNonInteractive}
                  label={<FormattedMessage id="ui-finance.settings.exchangeRateSource.form.field.providerType" />}
                  name={FORM_FIELDS_NAMES.providerType}
                  dataOptions={EXCHANGE_RATE_PROVIDERS_OPTIONS}
                  fullWidth
                  validate={validateRequired}
                  validateFields={[FORM_FIELDS_NAMES.apiKey, FORM_FIELDS_NAMES.apiSecret]}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col xs>
                <Field
                  component={TextField}
                  isNonInteractive={isNonInteractive}
                  label={<FormattedMessage id="ui-finance.settings.exchangeRateSource.form.field.providerUri" />}
                  name={FORM_FIELDS_NAMES.providerUri}
                  fullWidth
                  validate={validateRequired}
                  validateFields={[]}
                  required
                />
              </Col>
            </Row>
            <CredentialsProvider>
              {({ renderToggle }) => (
                <>
                  <Row>
                    <Col xs>
                      <CredentialsField
                        isNonInteractive={isNonInteractive}
                        label={<FormattedMessage id="ui-finance.settings.exchangeRateSource.form.field.apiKey" />}
                        name={FORM_FIELDS_NAMES.apiKey}
                        validate={validateFieldAdapter}
                        validateFields={[]}
                        required={(
                          EXCHANGE_RATE_FIELDS_CONFIG_PROPS_MAP
                            .get(providerType)
                            ?.get(FORM_FIELDS_NAMES.apiKey)
                            ?.required
                        )}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs>
                      <CredentialsField
                        autoComplete="new-password"
                        isNonInteractive={isNonInteractive}
                        label={<FormattedMessage id="ui-finance.settings.exchangeRateSource.form.field.apiSecret" />}
                        name={FORM_FIELDS_NAMES.apiSecret}
                        validate={validateFieldAdapter}
                        validateFields={[]}
                        required={(
                          EXCHANGE_RATE_FIELDS_CONFIG_PROPS_MAP
                            .get(providerType)
                            ?.get(FORM_FIELDS_NAMES.apiSecret)
                            ?.required
                        )}
                      />
                    </Col>
                  </Row>
                  {renderToggle()}
                </>
              )}
            </CredentialsProvider>
          </>
        )}
      </form>
    </Pane>
  );
};

ExchangeRateSourceForm.propTypes = {
  form: PropTypes.shape({
    getState: PropTypes.func.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isNonInteractive: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(ExchangeRateSourceForm);
