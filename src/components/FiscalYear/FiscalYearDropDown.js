import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';
import { Field, FieldArray } from 'redux-form';
// Folio
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Select from '@folio/stripes-components/lib/Select';
import { Dropdown } from '@folio/stripes-components/lib/Dropdown';
import DropdownMenu from '@folio/stripes-components/lib/DropdownMenu';
// Components and Pages

class FiscalYearDropDown extends Component {
  static propTypes = {
    // parentMutator: PropTypes.object.isRequired,
    // parentResources: PropTypes.object.isRequired,
  }
  
  constructor(props) {
    super(props);
    this.state = {
      fiscalYearDD: false
    };
   this.renderSubForm = this.renderSubForm.bind(this);
  }

  onToggleAddFiscalYearDD() {
    return this.setState({ fiscalYearDD: true });
  }

  render() {
    const { fields } = this.props;
    return (
      <Row>
        <Dropdown id="AddFiscalYearDropdown" open={this.props.fiscalYearDD} onToggle={this.onToggleAddFiscalYearDD} group style={{ float: 'right' }} pullRight>
          <Button data-role="toggle" align="end" bottomMargin0 aria-haspopup="true">
            &#43; Add Fiscal Year
                </Button>
          <DropdownMenu data-role="menu" aria-label="available permissions" onToggle={this.onToggleAddFiscalYearDD}>
            <ul>
              <li><a href="#">Example Link 1</a></li>
              <li><a href="#">Example Link 2</a></li>
            </ul>
          </DropdownMenu>
        </Dropdown>

        <Col xs={12}>
          <span style={{ textAlign: 'right', display: 'block' }}>
            <Button onClick={() => fields.push({ name: "test" })}>+ Add</Button>
          </span>
        </Col>
        <Col xs={12}>
          {fields.map(this.renderSubForm)}
        </Col>
        <br />
      </Row>
    )
  }

  renderSubForm = (elem, index, fields) => {
    return (
      <Row key={index}>
        <Col xs={12} md={4}>
          <Field label="Name" name={`${elem}.name`} id={`${elem}.name`} component={TextField} fullWidth />
        </Col>
        <Col xs={12} md={2}>
          <Button onClick={() => fields.remove(index)} buttonStyle="error" style={{ width: '100%', marginTop: '18px' }}>
            Remove
          </Button>
        </Col>
      </Row>
    );
  }
}

export default FiscalYearDropDown;