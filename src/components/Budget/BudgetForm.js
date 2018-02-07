import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';
import Icon from '@folio/stripes-components/lib/Icon';
import stripesForm from '@folio/stripes-form';
import { ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
// Components and Pages
// import LedgerForm from './LedgerForm';
// import View from '../View';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

// const filterConfig = [
  // {
  //   label: 'Vendor Status',
  //   name: 'vendor_status',
  //   cql: 'vendor_status',
  //   values: [
  //     { name: 'Active', cql: 'active' },
  //     { name: 'Pending', cql: 'pending' },
  //     { name: 'Inactive', cql: 'inactive' },
  //   ]
  // }
// ];

class BudgetForm extends Component {
  constructor(props) {
    super(props);
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
    debugger;
    const { initialValues } = this.props;
    // const { sections } = this.state;
    const firstMenu = this.getAddFirstMenu();
    const paneTitle = initialValues.id ? <span><Icon icon="edit" iconRootClass={css.UserFormEditIcon} />Edit: <Icon icon="profile" iconRootClass={css.UserFormEditIcon} />{getFullName(initialValues)}</span> : 'Create user';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updateuser', 'Update user') :
      this.getLastMenu('clickable-createnewuser', 'Create user');

    return (
      <form id="form-ledger">
        <Paneset isRoot>
          <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
            <p>Testing</p>
          </Pane>
        </Paneset>
      </form>
    )
  }
}

export default stripesForm({
  form: 'BudgetForm',
  // validate,
  // asyncValidate,
  navigationCheck: true,
  enableReinitialize: true,
})(BudgetForm);