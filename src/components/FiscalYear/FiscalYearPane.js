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
    this.transitionToParams = transitionToParams.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  render() {
    const { pristine, submitting, handleSubmit } = this.props;
    return (
      <form id="form-fiscal-year">
        <Button id={'fiscal year'} type="submit" title={'label'} disabled={pristine || submitting} onClick={handleSubmit(this.onCreate)}>+ Add</Button>
        <FiscalYearForm {...this.props} />
      </form>
    )
  }

  onCreate(records) {
    console.log(records);
    const { parentMutator } = this.props;
    // parentMutator.fiscalYear.POST(records);
  }

  onEdit(records) {
    const { parentMutator } = this.props;
    parentMutator.fiscalYear.PUT(ledgerdata);
  }
}

function asyncValidate(values, dispatch, props, blurredField) {
  return new Promise(resolve => resolve());
}

export default stripesForm({
  form: 'FiscalYearPane',
  // validate,
  asyncValidate,
})(FiscalYearPane);