import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import { EXPENSE_CLASSES_API } from '@folio/stripes-acq-components';

const hiddenFields = ['numberOfObjects'];
const visibleFields = ['name', 'code', 'externalAccountNumberExt'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.expenseClass.name" />,
  code: <FormattedMessage id="ui-finance.expenseClass.code" />,
  externalAccountNumberExt: <FormattedMessage id="ui-finance.expenseClass.account" />,
};

const ConnectedControlledVocab = stripesConnect(ControlledVocab);

const ExpenseClassSettings = ({ stripes }) => {
  const intl = useIntl();

  return (
    <ConnectedControlledVocab
      baseUrl={EXPENSE_CLASSES_API}
      columnMapping={columnMapping}
      hiddenFields={hiddenFields}
      id="expenseClasses"
      label={intl.formatMessage({ id: 'ui-finance.expenseClass.label.plural' })}
      labelSingular={intl.formatMessage({ id: 'ui-finance.expenseClass.label' })}
      nameKey="name"
      objectLabel={intl.formatMessage({ id: 'ui-finance.expenseClass.label' })}
      records="expenseClasses"
      sortby="name"
      stripes={stripes}
      visibleFields={visibleFields}
    />
  );
};

ExpenseClassSettings.propTypes = {
  stripes: PropTypes.object.isRequired,
};

export default ExpenseClassSettings;
