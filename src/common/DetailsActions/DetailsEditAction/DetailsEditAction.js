import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Icon,
  Button,
} from '@folio/stripes/components';

const DetailsEditAction = ({ disabled, perm, onEdit, toggleActionMenu }) => {
  return (
    <IfPermission perm={perm}>
      <Button
        buttonStyle="dropdownItem"
        data-test-details-edit-action
        onClick={() => {
          onEdit();
          toggleActionMenu();
        }}
        disabled={disabled}
      >
        <Icon
          size="small"
          icon="edit"
        >
          <FormattedMessage id="ui-finance.actions.edit" />
        </Icon>
      </Button>
    </IfPermission>
  );
};

DetailsEditAction.propTypes = {
  perm: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  toggleActionMenu: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default DetailsEditAction;
