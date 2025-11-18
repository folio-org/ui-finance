import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Label,
} from '@folio/stripes/components';

const HeadLabel = ({
  required = false,
  size = 2,
  translationId,
}) => (
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

export default HeadLabel;
