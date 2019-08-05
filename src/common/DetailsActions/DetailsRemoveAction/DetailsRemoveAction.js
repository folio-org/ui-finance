import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Icon,
} from '@folio/stripes/components';

const DetailsRemoveAction = ({ disabled, perm, onRemove, toggleActionMenu }) => {
  const remove = useCallback(
    () => {
      onRemove();
      toggleActionMenu();
    },
    [onRemove, toggleActionMenu]
  );

  return (
    <IfPermission perm={perm}>
      <Button
        buttonStyle="dropdownItem"
        data-test-details-remove-action
        onClick={remove}
        disabled={disabled}
      >
        <Icon
          size="small"
          icon="trash"
        >
          <FormattedMessage id="ui-finance.actions.remove" />
        </Icon>
      </Button>
    </IfPermission>
  );
};

DetailsRemoveAction.propTypes = {
  perm: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  toggleActionMenu: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

DetailsRemoveAction.defaultProps = {
  disabled: false,
};

export default DetailsRemoveAction;
