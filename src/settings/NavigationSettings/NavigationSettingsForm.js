import PropTypes from 'prop-types';
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
import { usePaneFocus } from '@folio/stripes-acq-components';
import { TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import { FORM_FIELDS_NAMES } from './constants';

const NavigationSettingsForm = ({
  form,
  handleSubmit,
  isNonInteractive,
}) => {
  const intl = useIntl();
  const { paneTitleRef } = usePaneFocus();

  const {
    pristine,
    submitting,
  } = form.getState();

  const isSubmitDisabled = pristine || submitting || isNonInteractive;
  const paneTitle = intl.formatMessage({ id: 'ui-finance.settings.navigation.title' });

  const renderHeader = (headerProps) => (
    <PaneHeader
      {...headerProps}
      paneTitle={paneTitle}
    />
  );

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
      id="navigation-settings"
      defaultWidth="fill"
      footer={<PaneFooter renderEnd={footerEnd} />}
      paneTitleRef={paneTitleRef}
      renderHeader={renderHeader}
    >
      <TitleManager record={paneTitle} />
      <Layout className="padding-bottom-gutter">
        <FormattedMessage id="ui-finance.settings.navigation.description" />
      </Layout>
      <form id="navigation-settings-form">
        <Layout className="padding-bottom-gutter">
          <Row>
            <Col xs>
              <Layout className="padding-bottom-gutter">
                <strong>
                  <FormattedMessage id="ui-finance.settings.navigation.enableBrowseTab" />
                </strong>
              </Layout>
              <Field
                component={Checkbox}
                disabled={isNonInteractive}
                name={FORM_FIELDS_NAMES.enabled}
                type="checkbox"
              />
            </Col>
          </Row>
        </Layout>
      </form>
    </Pane>
  );
};

NavigationSettingsForm.propTypes = {
  form: PropTypes.shape({
    getState: PropTypes.func.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isNonInteractive: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(NavigationSettingsForm);

