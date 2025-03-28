import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  stripesConnect,
  TitleManager,
} from '@folio/stripes/core';
import {
  EXPENSE_CLASSES_API,
  getControlledVocabTranslations,
} from '@folio/stripes-acq-components';

import { ExpenseClassHelper } from './ExpenseClassHelper';

const hiddenFields = ['numberOfObjects'];
const visibleFields = ['name', 'code', 'externalAccountNumberExt'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.expenseClass.name" />,
  code: <FormattedMessage id="ui-finance.expenseClass.code" />,
  externalAccountNumberExt: <FormattedMessage id="ui-finance.expenseClass.account" />,
};
const validate = (item) => {
  if (!item.code) return ({ code: <FormattedMessage id="stripes-acq-components.validation.required" /> });

  return ({
    code: item.code?.includes(':')
      ? <FormattedMessage id="ui-finance.validation.mustNotIncludeColon" />
      : undefined,
  });
};

const ConnectedControlledVocab = stripesConnect(ControlledVocab);

const ExpenseClassSettings = ({ stripes }) => {
  const intl = useIntl();
  const hasCreatePerms = stripes.hasPerm('finance.expense-classes.item.post');
  const hasEditPerms = stripes.hasPerm('finance.expense-classes.item.put');
  const hasDeletePerms = stripes.hasPerm('finance.fund-types.item.delete');

  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-finance.settings.expenseClasses.title' })}>
      <ConnectedControlledVocab
        baseUrl={EXPENSE_CLASSES_API}
        columnMapping={columnMapping}
        hiddenFields={hiddenFields}
        id="expenseClasses"
        label={intl.formatMessage({ id: 'ui-finance.expenseClass.label.plural' })}
        translations={getControlledVocabTranslations('ui-finance.settings.expenseClasses')}
        nameKey="name"
        objectLabel={intl.formatMessage({ id: 'ui-finance.expenseClass.label' })}
        records="expenseClasses"
        sortby="name"
        stripes={stripes}
        visibleFields={visibleFields}
        rowFilter={<ExpenseClassHelper />}
        validate={validate}
        canCreate={hasCreatePerms}
        actionSuppressor={{
          edit: () => !hasEditPerms,
          delete: () => !hasDeletePerms,
        }}
      />
    </TitleManager>
  );
};

ExpenseClassSettings.propTypes = {
  stripes: PropTypes.object.isRequired,
};

export default ExpenseClassSettings;
