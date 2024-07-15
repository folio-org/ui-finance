import {
  FUNDING_INFORMATION_LABELS,
  FINANCIAL_ACTIVITY_LABELS,
  OVERAGES_LABELS,
  FINANCIAL_SUMMARY,
} from './constants';

export const getFundingData = (data, isFiscalYear) => {
  const fundingData = [
    {
      label: FUNDING_INFORMATION_LABELS.initialAllocation,
      amount: data.initialAllocation,
      description: FINANCIAL_SUMMARY.initialAllocation,
    },
    {
      label: FUNDING_INFORMATION_LABELS.allocationTo,
      amount: data.allocationTo,
      description: FINANCIAL_SUMMARY.allocationTo,
    },
    {
      label: FUNDING_INFORMATION_LABELS.allocationFrom,
      amount: data.allocationFrom,
      description: FINANCIAL_SUMMARY.allocationFrom,
    },
    {
      label: FUNDING_INFORMATION_LABELS.allocated,
      amount: data.allocated,
      description: FINANCIAL_SUMMARY.allocated,
    },
    {
      label: FUNDING_INFORMATION_LABELS.netTransfers,
      amount: data.netTransfers,
      description: FINANCIAL_SUMMARY.netTransfers,
    },
    {
      label: FUNDING_INFORMATION_LABELS.totalFunding,
      amount: data.totalFunding,
      description: FINANCIAL_SUMMARY.totalFunding,

    },
  ];

  return isFiscalYear
    ? fundingData.filter(({ description }) => (
      description !== FINANCIAL_SUMMARY.allocationTo &&
      description !== FINANCIAL_SUMMARY.allocationFrom &&
      description !== FINANCIAL_SUMMARY.netTransfers
    ))
    : fundingData;
};

export const getFinacialActivityData = (data) => {
  return ([
    {
      label: FINANCIAL_ACTIVITY_LABELS.encumbered,
      amount: data.encumbered,
      description: FINANCIAL_SUMMARY.encumbered,
    },
    {
      label: FINANCIAL_ACTIVITY_LABELS.awaitingPayment,
      amount: data.awaitingPayment,
      description: FINANCIAL_SUMMARY.awaitingPayment,
    },
    {
      label: FINANCIAL_ACTIVITY_LABELS.expenditures,
      amount: data.expenditures,
      description: FINANCIAL_SUMMARY.expenditures,
    },
    {
      label: FINANCIAL_ACTIVITY_LABELS.credited,
      amount: data.credits,
      description: FINANCIAL_SUMMARY.expenditures,
    },
    {
      label: FINANCIAL_ACTIVITY_LABELS.unavailable,
      amount: data.unavailable,
      description: FINANCIAL_SUMMARY.unavailable,
    },
  ]);
};

export const getOveragesData = (data) => {
  return ([
    {
      label: OVERAGES_LABELS.overEncumbrance,
      amount: data.overEncumbrance,
      description: FINANCIAL_SUMMARY.overEncumbrance,
    },
    {
      label: OVERAGES_LABELS.overExpended,
      amount: data.overExpended,
      description: FINANCIAL_SUMMARY.overExpended,
    },
  ]);
};
