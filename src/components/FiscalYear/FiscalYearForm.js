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
import List from '@folio/stripes-components/lib/List';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import Badges from '@folio/stripes-components/lib/Badge/Badge.js'
// Components and Utils
import css from './css/FiscalYearForm.css';
import { Required } from '../../Utils/Validate';

class FiscalYearForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    deleteFiscalYear: PropTypes.func,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.checkLedger = this.checkLedger.bind(this);
    this.ledgerDataRender = this.ledgerDataRender.bind(this);
  }

  componentWillMount() {
    const { initialValues, parentMutator } = this.props;
    if (initialValues.id) {
      parentMutator.ledgerQuery.update({ query: `query=(fiscal_years="${initialValues.id}")`, resultCount:30 });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { initialValues, parentMutator, parentResources } = this.props;
    if (parentResources !== null) {
      if (parentResources.ledger !== null) {
        if(!_.isEqual(nextProps.parentResources.ledger.records, this.props.parentResources.ledger.records)) {
          parentMutator.ledgerQuery.update({ query: `query=(fiscal_years="${initialValues.id}")`, resultCount:20 });
        }
      }
    }
  }
  
  render() {
    const { initialValues } = this.props;
    const isEditPage = initialValues.id ? true : false;
    const showDeleteButton = this.checkLedger() !== null ? false : true;
    const ledgerData = this.checkLedger();
    const itemFormatter = (item) => (this.ledgerDataRender(item)); 
    const isEmptyMessage = "No items found";
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
        { isEditPage && (
          <IfPermission perm="fiscal_ year.item.delete">
            { showDeleteButton ? (
              <Row end="xs">
                <Col xs={12}>
                  <Button type="button" onClick={() => { this.props.deleteFiscalYear(initialValues.id) }}>Remove</Button>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col xs={12}>
                  <Badges color="red">This fiscal year is connected to a ledger. Please removed the connection before deleting this fiscal year</Badges>
                </Col>
                <Col xs={12}>
                  <div className={css.list}>
                    {
                      ledgerData &&
                      <List items={ledgerData} itemFormatter={itemFormatter} isEmptyMessage={isEmptyMessage} />
                    }
                  </div>
                </Col>
              </Row>
            )}
          </IfPermission>
        )}
      </div>
    ) 
  }

  checkLedger = () => {
    const { parentResources } = this.props;
    const data = (parentResources.ledger || {}).records || [];
    if (!data || data.length === 0) return null;
    return data;
  }

  ledgerDataRender(data) {
    return(<li>
      <a href={`/finance/ledger/view/${data.id}`}>{data.name}</a>
    </li>
    );
  }
}

export default FiscalYearForm;