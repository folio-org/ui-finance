import React from 'react';
import { FormattedMessage } from 'react-intl';

export const FISCAL_YEAR_ACCORDION = {
  information: 'information',
  ledger: 'ledger',
  group: 'group',
  fund: 'fund',
};

export const FISCAL_YEAR_ACCORDION_LABELS = {
  [FISCAL_YEAR_ACCORDION.information]: <FormattedMessage id="ui-finance.fiscalYear.details.information" />,
  [FISCAL_YEAR_ACCORDION.ledger]: <FormattedMessage id="ui-finance.fiscalYear.details.ledger" />,
  [FISCAL_YEAR_ACCORDION.group]: <FormattedMessage id="ui-finance.fiscalYear.details.group" />,
  [FISCAL_YEAR_ACCORDION.fund]: <FormattedMessage id="ui-finance.fiscalYear.details.fund" />,
};

export const FISCAL_YEAR_FILTERS = {
  ACQUISITIONS_UNIT: 'acqUnitIds',
};
