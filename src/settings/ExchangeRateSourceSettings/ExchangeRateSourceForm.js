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
  TextField,
} from '@folio/stripes/components';
import {
  CredentialsField,
  CredentialsProvider,
  usePaneFocus,
} from '@folio/stripes-acq-components';
import { TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import { FORM_FIELDS_NAMES } from './constants';

const ExchangeRateSourceForm = ({
  form,
  handleSubmit,
}) => {
  const intl = useIntl();
  const { paneTitleRef } = usePaneFocus();

  const {
    pristine,
    submitting,
    values,
  } = form.getState();

  const isEnabled = values[FORM_FIELDS_NAMES.enabled];
  const isSubmitDisabled = pristine || submitting;
  const paneTitle = intl.formatMessage({ id: 'ui-finance.settings.exchangeRateSource.title' });

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
        <Row>
          <Col xs>
            <Field
              component={Checkbox}
              label={<FormattedMessage id="ui-finance.settings.exchangeRateSource.form.field.enabled" />}
              name={FORM_FIELDS_NAMES.enabled}
              type="checkbox"
            />
          </Col>
        </Row>

        {isEnabled && (
          <>
            <Row>
              <Col xs>
                <Field
                  label={<FormattedMessage id="ui-finance.settings.exchangeRateSource.form.field.providerUri" />}
                  name={FORM_FIELDS_NAMES.providerUri}
                  component={TextField}
                  fullWidth
                  validateFields={[]}
                />
              </Col>
            </Row>
            <CredentialsProvider>
              {({ renderToggle }) => (
                <>
                  <Row>
                    <Col xs>
                      <CredentialsField
                        label={<FormattedMessage id="ui-finance.settings.exchangeRateSource.form.field.apiKey" />}
                        name={FORM_FIELDS_NAMES.apiKey}
                        validateFields={[]}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs>
                      <CredentialsField
                        autoComplete="new-password"
                        label={<FormattedMessage id="ui-finance.settings.exchangeRateSource.form.field.apiSecret" />}
                        name={FORM_FIELDS_NAMES.apiSecret}
                        validateFields={[]}
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
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(ExchangeRateSourceForm);
