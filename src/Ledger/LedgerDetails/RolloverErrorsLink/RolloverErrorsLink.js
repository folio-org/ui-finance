import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  TextLink,
} from '@folio/stripes/components';
import { exportCsv } from '@folio/stripes/util';

function RolloverErrorsLink({ errors, ledgerName, toYearCode }) {
  const exportErrorsFilename = `${ledgerName}-rollover-errors-${toYearCode}`;

  const exportErrors = useCallback(() => {
    exportCsv(
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
        filename: exportErrorsFilename,
        header: false,
      },
    );
  }, [errors, exportErrorsFilename]);

  return (
    <TextLink onClick={exportErrors}>
      {exportErrorsFilename}.csv
    </TextLink>
  );
}

RolloverErrorsLink.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
  ledgerName: PropTypes.string,
  toYearCode: PropTypes.string,
};

export default RolloverErrorsLink;
