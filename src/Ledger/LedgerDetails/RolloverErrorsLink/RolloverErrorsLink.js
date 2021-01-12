import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  TextLink,
} from '@folio/stripes/components';
import { exportCsv } from '@folio/stripes/util';

function RolloverErrorsLink({ errors, ledgerName, toYearCode }) {
  const exportErrorsFilename = `${ledgerName}-rollover-errors-${toYearCode}`;

  const exportErrors = useCallback(() => {
    exportCsv(errors, {
      filename: exportErrorsFilename,
    });
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
