import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import FundTypeSettings from './FundTypeSettings';
import ExpenseClassSettings from './ExpenseClassSettings';
import ExportFundSettings from './ExportFundSettings';

export default class FinanceSettings extends React.Component {
  pages = [
    {
      component: FundTypeSettings,
      label: <FormattedMessage id="ui-finance.settings.fundTypes.title" />,
      route: 'fund-types',
      perm: 'ui-finance.settings.view',
    },
    {
      component: ExpenseClassSettings,
      label: <FormattedMessage id="ui-finance.settings.expenseClasses.title" />,
      route: 'expense-classes',
      perm: 'ui-finance.settings.view',
    },
    {
      component: ExportFundSettings,
      label: <FormattedMessage id="ui-finance.settings.exportFund.title" />,
      route: 'export-fund',
      perm: 'ui-finance.settings.exportFundAndExpenseClassCodes',
    },
  ];

  render() {
    return (
      <Settings
        {...this.props}
        pages={this.pages}
        paneTitle={<FormattedMessage id="ui-finance.meta.title" />}
      />
    );
  }
}
