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
import TextField from '@folio/stripes-components/lib/TextField';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
// Components and Pages
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
    parentMutator: PropTypes.object
  }
  
  constructor(props) {
    super(props);
    this.getFiscalYears = this.getFiscalYears.bind(this);
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
    // console.log(this.props);
    const { initialValues } = this.props;
    const firstMenu = this.getAddFirstMenu();
    const paneTitle = initialValues.id ? <span><Icon icon="edit" iconRootClass={css.UserFormEditIcon} />Edit: {getFullName(initialValues)}</span> : 'Create ledger';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updateledger', 'Update ledger') :
      this.getLastMenu('clickable-createnewledger', 'Create ledger');
    return (
      <form id="form-ledger">
        <Paneset>
          <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
            <LedgerForm dropdown_fiscalyears_array={this.getFiscalYears()} {...this.props} />
          </Pane>
        </Paneset>
      </form>
    )
  }
  
  getFiscalYears() {
    let newArr = [];
    const fiscalRecords = (this.props.parentResources || {}).fiscalYear.records || [];
    const arrLength = fiscalRecords.length - 1;
    if (fiscalRecords != null) {
      Object.keys(fiscalRecords).map((key) => {
        let name = `Code: ${fiscalRecords[key].code}, Name:${fiscalRecords[key].name}`;
        let val = fiscalRecords[key].id;
        newArr.push({
          label: name.toString(),
          value: val.toString()
        });
        if (Number(key) === arrLength) {
          return newArr;
        }
      });
    }
    return newArr;
  }
}

function asyncValidate(values, dispatch, props, blurredField) {
  console.log("asyc please disable");
  return new Promise(resolve => resolve());
}

export default stripesForm({
  form: 'ledgerForm',
  // validate,
  asyncValidate,
  navigationCheck: true,
  enableReinitialize: true,
})(LedgerPane);