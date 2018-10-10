import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Pane, PaneMenu } from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import LedgerForm from './LedgerForm';

class LedgerPane extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
    dropdownFiscalyears: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }))
  }

  constructor(props) {
    super(props);
    this.deleteLedger = this.deleteLedger.bind(this);
  }

  getAddFirstMenu() {
    const { onCancel } = this.props;
    return (
      <PaneMenu>
        <button type="button" id="clickable-closenewfunddialog" onClick={onCancel} title="close" aria-label="Close New Ledger Dialog">
          <span style={{ fontSize: '30px', color: '#999', lineHeight: '18px' }}>&times;</span>
        </button>
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

  deleteLedger(ID) {
    const { parentMutator } = this.props;
    parentMutator.records.DELETE({ id: ID }).then(() => {
      parentMutator.query.update({
        _path: '/finance/ledger',
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
    ) : 'Create ledger';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updateledger', 'Update ledger') :
      this.getLastMenu('clickable-createnewledger', 'Create ledger');

    return (
      <form id="form-ledger">
        <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
          <LedgerForm {...this.props} deleteLedger={this.deleteLedger} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'ledgerForm',
  navigationCheck: true,
  enableReinitialize: true,
})(LedgerPane);
