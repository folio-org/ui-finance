import { exportToCsv } from '@folio/stripes/components';

export const exportRolloverErrors = ({ errors, filename }) => {
  return exportToCsv(
    [
      {
        ledgerRolloverId: 'Ledger rollover ID',
        errorType: 'Error type',
        failedAction: 'Failed action',
        errorMessage: 'Error message',
        'details.amount': 'Amount',
        'details.fundId': 'Fund ID',
        'details.fundCode': 'Fund code',
        'details.purchaseOrderId': 'Purchase order ID',
        'details.polNumber': 'Purchase order line number',
        'details.poLineId': 'Purchase order line ID',
      },
      ...errors,
    ],
    {
      excludeFields: ['id', 'metadata'],
      filename,
      header: false,
    },
  );
};
