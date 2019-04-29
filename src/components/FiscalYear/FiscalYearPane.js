import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Pane, PaneMenu, IconButton } from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { FormattedMessage } from 'react-intl';
// Components and Pages
import FiscalYearForm from './FiscalYearForm';

class FiscalYearPane extends Component {
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

  constructor(props) {
    super(props);
    this.deleteFiscalYear = this.deleteFiscalYear.bind(this);
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
          aria-label={`Close ${ttl} Fiscal Year Dialog`}
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

  deleteFiscalYear(ID) {
    const { parentMutator } = this.props;
    parentMutator.records.DELETE({ id: ID }).then(() => {
      parentMutator.query.update({
        _path: '/finance/fiscalyear',
        layer: null
      });
    });
  }

  render() {
    const { initialValues } = this.props;
    const firstMenu = this.getAddFirstMenu();
    const paneTitle = initialValues.id ? (
      <span>
        {`Edit: ${_.get(initialValues, ['name'], '')}`}
      </span>
    ) : 'Create fiscal year';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updatefiscalyear', <FormattedMessage id="ui-finance.fiscalYear.save" />) :
      this.getLastMenu('clickable-createnewfiscalyear', <FormattedMessage id="ui-finance.fiscalYear.save" />);
    return (
      <form id="form-fiscalyear">
        <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
          <FiscalYearForm {...this.props} deleteFiscalYear={this.deleteFiscalYear} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'FiscalYearPane',
  // validate,
  navigationCheck: true,
  enableReinitialize: true,
})(FiscalYearPane);
