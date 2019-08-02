import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Button, Pane, PaneMenu } from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { FormattedMessage } from 'react-intl';
import FundForm from './FundForm';

class FundPane extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object
  }

  getAddFirstMenu() {
    const { onCancel, initialValues } = this.props;
    const ttl = initialValues.id ? 'Edit' : 'New';
    return (
      <PaneMenu>
        <IconButton
          icon="times"
          id="clickable-closedialog"
          onClick={onCancel}
          title="Close"
          aria-label={`Close ${ttl} Fund Dialog`}
        />
      </PaneMenu>
    );
  }

  getLastMenu(id, label) {
    const { pristine, submitting, handleSubmit } = this.props;
    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          title={label}
          disabled={pristine || submitting}
          onClick={handleSubmit}
          style={{ marginBottom: '0' }}
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  render() {
    const { initialValues } = this.props;
    const firstMenu = this.getAddFirstMenu();
    const paneTitle = initialValues.id ? (
      <span>
        {`Edit: ${_.get(initialValues, ['name'], '')}`}
      </span>
    ) : 'Create fund';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updatefund', <FormattedMessage id="ui-finance.fund.save" />) :
      this.getLastMenu('clickable-createnewfund', <FormattedMessage id="ui-finance.fund.save" />);
    return (
      <form id="form-fund">
        <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
          <FundForm {...this.props} {...this.props} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'FundPane',
  // validate,
  // asyncValidate,
  navigationCheck: true,
  enableReinitialize: true,
})(FundPane);
