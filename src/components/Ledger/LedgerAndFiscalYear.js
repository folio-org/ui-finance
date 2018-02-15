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
// Components and Pages
import LedgerPane from './LedgerPane';
import { FiscalYear } from '../FiscalYear';

const renderLanguageField = ({ fields, field, fieldIndex, template, templateIndex }) => {
  const languageOptions = languages.selectOptions(field);
  return (
    <Field
      label={fieldIndex === 0 ? 'language' : null}
      name={`${field}`}
      component={Select}
      dataOptions={[{ label: 'Select language', value: '' }, ...languageOptions]}
    />
  );
}

class LedgerPaneCombi extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  }
  
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <LedgerPane {...this.props} />
        {/* <FiscalYear {...this.props} /> */}
      </div>
    )
  }
}

export default LedgerPaneCombi;