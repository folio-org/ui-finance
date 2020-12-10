import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Label,
} from '@folio/stripes/components';

const HeadLabel = ({ translationId, size = 2 }) => (
  <Col xs={size}>
    <Label>
      <FormattedMessage id={translationId} />
    </Label>
  </Col>
);

HeadLabel.propTypes = {
  size: PropTypes.number,
  translationId: PropTypes.string.isRequired,
};

HeadLabel.defaultProps = {
  size: 2,
};

export default HeadLabel;
