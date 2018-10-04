import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Pane, PaneMenu } from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
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

  constructor(props) {
    super(props);
    this.deleteFund = this.deleteFund.bind(this);
  }

  getAddFirstMenu() {
    const { onCancel } = this.props;
    return (
      <PaneMenu>
        <button type="button" id="clickable-closenewfunddialog" onClick={onCancel} title="close" aria-label="Close New Fund Dialog">
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

  deleteFund(ID) {
    const { parentMutator } = this.props;
    parentMutator.records.DELETE({ id: ID }).then(() => {
      parentMutator.query.update({
        _path: '/finance/fund',
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
    ) : 'Create fund';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updatefund', 'Update fund') :
      this.getLastMenu('clickable-createnewfund', 'Create fund');
    return (
      <form id="form-fund">
        <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
          <FundForm {...this.props} {...this.props} deleteFund={this.deleteFund} />
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
