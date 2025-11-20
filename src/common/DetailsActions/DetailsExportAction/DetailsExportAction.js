import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Icon,
} from '@folio/stripes/components';

export const DetailsExportAction = ({
  disabled = false,
  onExportCSV,
  perm,
  toggleActionMenu,
}) => {
  const exportToCSV = useCallback(
    () => {
      onExportCSV();
      toggleActionMenu();
    },
    [onExportCSV, toggleActionMenu],
  );

  return (
    <IfPermission perm={perm}>
      <Button
        data-testid="action-export-csv"
        buttonStyle="dropdownItem"
        onClick={exportToCSV}
        disabled={disabled}
      >
        <Icon
          size="small"
          icon="download"
        >
          <FormattedMessage id="ui-finance.actions.exportCSV" />
        </Icon>
      </Button>
    </IfPermission>
  );
};

DetailsExportAction.propTypes = {
  perm: PropTypes.string.isRequired,
  onExportCSV: PropTypes.func.isRequired,
  toggleActionMenu: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
