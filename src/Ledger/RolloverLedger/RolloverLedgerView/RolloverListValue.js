import PropTypes from 'prop-types';

import { NoValue } from '@folio/stripes/components';

export const RolloverListValue = ({
  children,
  value,
  ...props
}) => {
  const content = (children ?? value) ?? <NoValue />;

  return (
    <span {...props}>
      {content}
    </span>
  );
};

RolloverListValue.propTypes = {
  children: PropTypes.node,
  value: PropTypes.node,
};
