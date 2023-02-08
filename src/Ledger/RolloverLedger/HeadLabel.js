import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Label,
} from '@folio/stripes/components';

const HeadLabel = ({ required, translationId, size = 2 }) => (
  <Col xs={size}>
    <Label required={required}>
      <FormattedMessage id={translationId} />
    </Label>
  </Col>
);

HeadLabel.propTypes = {
  required: PropTypes.bool,
  size: PropTypes.number,
  translationId: PropTypes.string.isRequired,
};

HeadLabel.defaultProps = {
  required: false,
  size: 2,
};

export default HeadLabel;
