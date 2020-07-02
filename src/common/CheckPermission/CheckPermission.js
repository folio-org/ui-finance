import React from 'react';
import PropTypes from 'prop-types';

import { IfPermission } from '@folio/stripes/core';

import NoPermissionsMessage from '../NoPermissionsMessage';

const CheckPermission = ({ children, perm }) => (
  <IfPermission perm={perm}>
    {({ hasPermission }) => (hasPermission
      ? children
      : <NoPermissionsMessage />
    )}
  </IfPermission>
);

CheckPermission.propTypes = {
  children: PropTypes.node.isRequired,
  perm: PropTypes.string.isRequired,
};

export default CheckPermission;
