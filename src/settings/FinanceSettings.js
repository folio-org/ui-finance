import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import React from 'react';

import { TitleManager } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import FundTypeSettings from './FundTypeSettings';
import { ExchangeRateSourceSettings } from './ExchangeRateSourceSettings';
import ExpenseClassSettings from './ExpenseClassSettings';
import ExportFundSettings from './ExportFundSettings';

class FinanceSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func,
    }).isRequired,
  };

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
    {
      component: ExchangeRateSourceSettings,
      label: <FormattedMessage id="ui-finance.settings.exchangeRateSource.title" />,
      route: 'exchange-rate-source',
      perm: 'ui-finance.settings.view',
    },
  ];

  render() {
    const { intl } = this.props;

    return (
      <TitleManager page={intl.formatMessage({ id: 'ui-finance.document.settings.title' })}>
        <Settings
          {...this.props}
          pages={this.pages}
          paneTitle={<FormattedMessage id="ui-finance.meta.title" />}
        />
      </TitleManager>
    );
  }
}

export default injectIntl(FinanceSettings);
