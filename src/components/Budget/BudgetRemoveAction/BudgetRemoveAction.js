import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Icon,
} from '@folio/stripes/components';

const BudgetRemoveAction = ({ perm, onRemove, toggleActionMenu }) => {
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
        data-test-budget-remove-action
        onClick={remove}
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

BudgetRemoveAction.propTypes = {
  perm: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  toggleActionMenu: PropTypes.func.isRequired,
};

export default BudgetRemoveAction;
