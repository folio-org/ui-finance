import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import FundTypeSettings from './FundTypeSettings';
import ExpenseTypeSettings from './ExpenseTypeSettings';

export default class FinanceSettings extends React.Component {
  pages = [
    {
      component: FundTypeSettings,
      label: <FormattedMessage id="ui-finance.settings.fundTypes.title" />,
      route: 'fund-types',
    },
    {
      component: ExpenseTypeSettings,
      label: <FormattedMessage id="ui-finance.settings.expenseTypes.title" />,
      route: 'expense-types',
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
