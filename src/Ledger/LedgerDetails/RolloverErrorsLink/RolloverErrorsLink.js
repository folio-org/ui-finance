import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  Headline,
  TextLink,
  exportToCsv,
} from '@folio/stripes/components';
import css from './RolloverErrorsLink.css';

function RolloverErrorsLink({ errors, ledgerName, toYearCode }) {
  const exportErrorsFilename = `${ledgerName}-rollover-errors-${toYearCode}`;

  const exportErrors = useCallback(() => {
    exportToCsv(
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
    <TextLink
      className={css.hoveredLink}
      onClick={exportErrors}
    >
      <Headline tag="span">
        {exportErrorsFilename}.csv
      </Headline>
    </TextLink>
  );
}

RolloverErrorsLink.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
  ledgerName: PropTypes.string,
  toYearCode: PropTypes.string,
};

export default RolloverErrorsLink;
