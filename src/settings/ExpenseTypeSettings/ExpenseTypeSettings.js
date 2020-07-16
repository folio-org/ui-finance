import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import { EXPENSE_CLASSES_API } from '../../common/const';

const hiddenFields = ['numberOfObjects'];
const visibleFields = ['name', 'code', 'externalAccountNumberExt'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.expenseType.name" />,
  code: <FormattedMessage id="ui-finance.expenseType.code" />,
  externalAccountNumberExt: <FormattedMessage id="ui-finance.expenseType.account" />,
};

const ConnectedControlledVocab = stripesConnect(ControlledVocab);

const ExpenseTypeSettings = ({ stripes }) => {
  const intl = useIntl();

  return (
    <ConnectedControlledVocab
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
};

ExpenseTypeSettings.propTypes = {
  stripes: PropTypes.object.isRequired,
};

export default ExpenseTypeSettings;
