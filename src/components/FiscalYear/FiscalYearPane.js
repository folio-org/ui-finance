import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';
import Icon from '@folio/stripes-components/lib/Icon';
import stripesForm from '@folio/stripes-form';
import { ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';

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
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object.isRequired,
  }
  
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.transitionToParams = transitionToParams.bind(this);
  }

  getAddFirstMenu() {
    const { onCancel } = this.props;
    return (
      <PaneMenu>
        <button id="clickable-closenewuserdialog" onClick={onCancel} title="close" aria-label="Close New User Dialog">
          <span style={{ fontSize: '30px', color: '#999', lineHeight: '18px' }} >&times;</span>
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
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  render() {
    // const { initialValues } = this.props;
    // const firstMenu = this.getAddFirstMenu();
    // const paneTitle = initialValues.id ? <span><Icon icon="edit" iconRootClass={css.UserFormEditIcon} />Edit: {getFullName(initialValues)}</span> : 'Create Fiscal Year';
    // const lastMenu = initialValues.id ?
      // this.getLastMenu('clickable-update-fiscal-year', 'Update Fiscal Year') :
      // this.getLastMenu('clickable-createnew-fiscal-year', 'Create Fiscal Year');
    // <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
    return (
      <form id="form-fiscal-year">
        <Paneset>
          <Pane defaultWidth="100%">
            <FiscalYearForm {...this.props} />
            <button onClick={this.onClick}>Go Back</button>
          </Pane>
        </Paneset>
        
      </form>
    )
  }

  onClick() {
    this.transitionToParams({ layer: 'create' });
  }
}

function asyncValidate(values, dispatch, props, blurredField) {
  return new Promise(resolve => resolve());
}

export default stripesForm({
  form: 'FiscalYearPane',
  // validate,
  asyncValidate,
  navigationCheck: true,
  enableReinitialize: true,
})(FiscalYearPane);