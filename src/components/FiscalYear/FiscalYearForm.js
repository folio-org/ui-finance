import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';
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
import TextArea from '@folio/stripes-components/lib/TextArea';
import Select from '@folio/stripes-components/lib/Select';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
// Components and Utils
import css from './css/FiscalYearForm.css';
import { Required } from '../../Utils/Validate';

class FiscalYearForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    deleteFiscalYear: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  render() {
    const showDeleteButton = initialValues.id ? true : false;
    
    return (
      <div className={css.FiscalYearForm}>
        <Row>
          <Col xs={12}>
            <Field label="Name" name="name" id="name" validate={[Required]} component={TextField} fullWidth />
          </Col>
          <Col xs={12}>
            <Field label="Code" name="code" id="code" validate={[Required]} component={TextField} fullWidth />
          </Col>
          <Col xs={12}>
            <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
          </Col>
        </Row>
        <IfPermission perm="ledger.item.delete">
          <Row end="xs">
            <Col xs={12}>
              {
                showDeleteButton &&
                <Button type="button" onClick={() => { this.props.deleteFiscalYear(initialValues.id) }}>Remove</Button>
              }
            </Col>
          </Row>
        </IfPermission>
      </div>
    ) 
  }
}

export default FiscalYearForm;