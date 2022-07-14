import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  Headline,
  TextLink,
} from '@folio/stripes/components';

import { exportRolloverErrors } from '../../../common/utils';

import css from './RolloverErrorsLink.css';

function RolloverErrorsLink({ errors, ledgerName, toYearCode }) {
  const exportErrorsFilename = `${ledgerName}-rollover-errors-${toYearCode}`;

  const exportErrors = useCallback(() => {
    exportRolloverErrors({
      errors,
      filename: exportErrorsFilename,
    });
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
