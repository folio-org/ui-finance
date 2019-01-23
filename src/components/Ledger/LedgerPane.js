import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Pane, PaneMenu, IconButton } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
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
    const { onCancel, initialValues } = this.props;
    const ttl = initialValues.id ? <FormattedMessage id="ui-finance.ledger.edit" /> : <FormattedMessage id="ui-finance.ledger.new" />;
    return (
      <PaneMenu>
        <IconButton
          icon="times"
          id="clickable-closedialog"
          onClick={onCancel}
          title={<FormattedMessage id="ui-finance.ledger.close" />}
          aria-label={`Close ${ttl} Ledger Dialog`}
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
        {(
          <FormattedMessage id="ui-finance.ledger.edit">
            { item => `${item}: ${_.get(initialValues, ['name'], '')}` }
          </FormattedMessage>
        )}
      </span>
    ) : 'Create ledger';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updateledger', <FormattedMessage id="ui-finance.ledger.updateLedger" />) :
      this.getLastMenu('clickable-createnewledger', <FormattedMessage id="ui-finance.ledger.createLedger" />);

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
