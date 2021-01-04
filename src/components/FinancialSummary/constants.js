import React from 'react';
import { FormattedMessage } from 'react-intl';

export const FINANCIAL_SUMMARY = {
  initialAllocation: 'initialAllocation',
  allocationTo: 'allocationTo',
  allocationFrom: 'allocationFrom',
  allocated: 'allocated',
  netTransfers: 'netTransfers',
  totalFunding: 'totalFunding',
  encumbered: 'encumbered',
  awaitingPayment: 'awaitingPayment',
  expended: 'expended',
  unavailable: 'unavailable',
  overEncumbrance: 'overEncumbrance',
  overExpended: 'overExpended',
};

export const FUNDING_INFORMATION_LABELS = {
  initialAllocation: <FormattedMessage id="ui-finance.financialSummary.initialAllocation" />,
  allocationTo: <FormattedMessage id="ui-finance.financialSummary.allocationTo" />,
  allocationFrom: <FormattedMessage id="ui-finance.financialSummary.allocationFrom" />,
  allocated: <FormattedMessage id="ui-finance.financialSummary.allocated" />,
  netTransfers: <FormattedMessage id="ui-finance.financialSummary.netTransfers" />,
  totalFunding: <FormattedMessage id="ui-finance.financialSummary.totalFunding" />,
};

export const FINANCIAL_ACTIVITY_LABELS = {
  encumbered: <FormattedMessage id="ui-finance.financialSummary.encumbered" />,
  awaitingPayment: <FormattedMessage id="ui-finance.financialSummary.awaitingPayment" />,
  expended: <FormattedMessage id="ui-finance.financialSummary.expended" />,
  unavailable: <FormattedMessage id="ui-finance.financialSummary.unavailable" />,
};

export const OVERAGES_LABELS = {
  overEncumbrance: <FormattedMessage id="ui-finance.financialSummary.overEncumbrance" />,
  overExpended: <FormattedMessage id="ui-finance.financialSummary.overExpended" />,
};
