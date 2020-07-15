import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

import { EXPENSE_CLASSES_API } from '../../common/const';

const hiddenFields = ['numberOfObjects', 'lastUpdated'];
const visibleFields = ['name', 'code', 'externalAccountNumberExt'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.expenseType.name" />,
  code: <FormattedMessage id="ui-finance.expenseType.code" />,
  externalAccountNumberExt: <FormattedMessage id="ui-finance.expenseType.account" />,
};

class ExpenseTypeSettings extends Component {
  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;

    return (
      <this.connectedControlledVocab
        baseUrl={EXPENSE_CLASSES_API}
        columnMapping={columnMapping}
        hiddenFields={hiddenFields}
        id="expenseTypes"
        label={intl.formatMessage({ id: 'ui-finance.expenseType.label.plural' })}
        labelSingular={intl.formatMessage({ id: 'ui-finance.expenseType.label' })}
        nameKey="name"
        objectLabel={intl.formatMessage({ id: 'ui-finance.expenseType.label' })}
        records="expenseClasses"
        sortby="name"
        stripes={stripes}
        visibleFields={visibleFields}
      />
    );
  }
}

ExpenseTypeSettings.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default injectIntl(ExpenseTypeSettings);
