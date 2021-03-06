import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import FundTypeSettings from './FundTypeSettings';
import ExpenseClassSettings from './ExpenseClassSettings';

export default class FinanceSettings extends React.Component {
  pages = [
    {
      component: FundTypeSettings,
      label: <FormattedMessage id="ui-finance.settings.fundTypes.title" />,
      route: 'fund-types',
    },
    {
      component: ExpenseClassSettings,
      label: <FormattedMessage id="ui-finance.settings.expenseClasses.title" />,
      route: 'expense-classes',
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
