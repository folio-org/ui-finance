import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  IfPermission,
  Row,
  Select,
  TextArea,
  TextField
} from '@folio/stripes/components';
import { Required } from '../../Utils/Validate';
// Components and Pages
import ConnectionListing from '../ConnectionListing';

class LedgerForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    deleteLedger: PropTypes.func,
    dropdownFiscalyears: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })),
    parentMutator: PropTypes.object,
    fundData: PropTypes.arrayOf(PropTypes.object)
  }

  constructor(props) {
    super(props);
    this.state = {
      fiscalYearDD: false,
      status_dd: [
        { label: '-- Select --', value: '' },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Pending', value: 'Pending' },
      ],
    };
    this.onToggleAddFiscalYearDD = this.onToggleAddFiscalYearDD.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderSubFields = this.renderSubFields.bind(this);
  }

  componentDidMount() {
    const { parentMutator } = this.props;
    parentMutator.queryCustom.update({ fiscalyearsQuery: 'query=(name="*")' });
  }

  renderList = ({ fields }) => {
    return (
      <Row>
        <Col xs={12} md={6}>
          <h6 style={{ marginTop: '0' }}>Fiscal Years</h6>
        </Col>
        <Col xs={12}>
          {fields.length === 0 &&
            <div><em>- Please add fiscal year -</em></div>
          }
          {fields.map(this.renderSubFields)}
        </Col>
        <Col xs={12} style={{ paddingTop: '10px' }}>
          <Button onClick={() => fields.push({})}>+ Add</Button>
        </Col>
      </Row>
    );
  }

  renderSubFields = (elem, index, fields) => {
    return (
      <Row key={index}>
        <Col xs={5}>
          <Field name={`${elem}`} id={`${elem}.value`} component={Select} validate={[Required]} dataOptions={this.props.dropdownFiscalyears} />
        </Col>
        <Col xs={2}>
          <Button onClick={() => fields.remove(index)} buttonStyle="danger">
            Remove
          </Button>
        </Col>
      </Row>
    );
  }

  onToggleAddFiscalYearDD() {
    if (this.state.fiscalYearDD === true) {
      this.setState({ fiscalYearDD: false });
    } else {
      this.setState({ fiscalYearDD: true });
    }
  }

  render() {
    const { initialValues, fundData } = this.props;
    const isEditPage = initialValues.id || false;
    const isFundData = fundData !== null ? fundData : false;
    return (
      <div>
        <Row>
          <Col xs={8} style={{ margin: '0 auto', padding: '0' }}>
            <Row>
              <Col xs={12} md={4}>
                <Field label="Name*" name="name" id="name" component={TextField} validate={[Required]} fullWidth />
              </Col>
              <Col xs={12} md={4}>
                <Field label="Code" name="code" id="code" component={TextField} fullWidth />
              </Col>
              <Col xs={12} md={4}>
                <Field label="Status" name="ledger_status" id="ledger_status" component={Select} fullWidth dataOptions={this.state.status_dd} />
              </Col>
              <Col xs={12}>
                <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
              </Col>
              <Col xs={12}>
                <FieldArray label="Fiscal Year" name="fiscal_years" id="fiscal_years" component={this.renderList} />
              </Col>
            </Row>
            { isEditPage && (
              <IfPermission perm="ledger.item.delete">
                { isFundData ? (
                  <Row>
                    <Col xs={12}>
                      <hr />
                      <ConnectionListing
                        title="Fund Connection"
                        isEmptyMessage="No items found"
                        items={fundData}
                        path="/finance/fund/view/"
                        isView
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row end="xs">
                    <Col xs={12}>
                      <Button type="button" onClick={() => { this.props.deleteLedger(initialValues.id); }}>Remove</Button>
                    </Col>
                  </Row>
                )}
              </IfPermission>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default LedgerForm;
