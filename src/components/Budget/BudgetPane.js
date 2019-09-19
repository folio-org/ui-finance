import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Pane, PaneMenu, IconButton } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import stripesForm from '@folio/stripes/form';
// Components and Pages
import BudgetForm from './BudgetForm';

class BudgetPane extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.getFiscalYears = this.getFiscalYears.bind(this);
    this.deleteBudget = this.deleteBudget.bind(this);
  }

  getAddFirstMenu() {
    const { onCancel, initialValues } = this.props;
    const ttl = initialValues.id ? 'Edit' : 'New';

    return (
      <PaneMenu>
        <IconButton
          icon="times"
          id="clickable-closedialog"
          onClick={onCancel}
          title="Close"
          aria-label={`Close ${ttl} Budget Dialog`}
        />
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

  getFiscalYears() {
    const newArr = [];
    const fiscalRecords = (this.props.parentResources || {}).fiscalyear.records || [];
    const arrLength = fiscalRecords.length - 1;

    if (fiscalRecords != null) {
      Object.keys(fiscalRecords).map((key) => {
        const name = `Code: ${fiscalRecords[key].code}, Name:${fiscalRecords[key].name}`;
        const val = fiscalRecords[key].id;

        newArr.push({
          label: name.toString(),
          value: val.toString(),
        });
        if (Number(key) === arrLength) {
          return newArr;
        }

        return newArr;
      });
    }

    return newArr;
  }

  deleteBudget(ID) {
    const { parentMutator } = this.props;

    parentMutator.records.DELETE({ id: ID }).then(() => {
      parentMutator.query.update({
        _path: '/finance/budget',
        layer: null,
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
    ) : 'Create budget';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updatebudget', <FormattedMessage id="ui-finance.budget.save" />) :
      this.getLastMenu('clickable-createnewbudget', <FormattedMessage id="ui-finance.budget.save" />);

    return (
      <form id="form-budget">
        <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
          <BudgetForm {...this.props} deleteBudget={this.deleteBudget} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'BudgetPane',
  // validate,
  // asyncValidate,
  navigationCheck: true,
  enableReinitialize: true,
})(BudgetPane);
