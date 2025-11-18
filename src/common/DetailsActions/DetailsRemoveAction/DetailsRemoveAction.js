import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Icon,
} from '@folio/stripes/components';

const DetailsRemoveAction = ({
  disabled = false,
  onRemove,
  perm,
  toggleActionMenu,
}) => {
  const remove = useCallback(
    () => {
      onRemove();
      toggleActionMenu();
    },
    [onRemove, toggleActionMenu],
  );

  return (
    <IfPermission perm={perm}>
      <Button
        buttonStyle="dropdownItem"
        data-test-details-remove-action
        data-testid="details-remove-action"
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
  disabled: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  perm: PropTypes.string.isRequired,
  toggleActionMenu: PropTypes.func.isRequired,
};

export default DetailsRemoveAction;
