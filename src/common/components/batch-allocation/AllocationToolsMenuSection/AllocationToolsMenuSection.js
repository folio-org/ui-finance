import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';

export const AllocationToolsMenuSection = ({
  disabled,
  onBatchAllocate,
  onBatchAllocationLogs,
  onDownloadAllocationWorksheet,
  onUploadAllocationWorksheet,
}) => {
  const intl = useIntl();

  return (
    <MenuSection
      id="allocation-tools-menu-section"
      label={intl.formatMessage({ id: 'ui-finance.menuSection.allocationTools' })}
    >
      <IfPermission perm="ui-finance.allocations.create">
        <Button
          buttonStyle="dropdownItem"
          onClick={onBatchAllocate}
          disabled={disabled}
        >
          <Icon
            size="small"
            icon="edit"
          >
            <FormattedMessage id="ui-finance.actions.allocations.batch" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="finance.finance-data.collection.get">
        <Button
          buttonStyle="dropdownItem"
          onClick={onDownloadAllocationWorksheet}
          disabled={disabled}
        >
          <Icon
            size="small"
            icon="download"
          >
            <FormattedMessage id="ui-finance.actions.downloadAllocationWorksheet" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-finance.allocations.create">
        <Button
          buttonStyle="dropdownItem"
          onClick={onUploadAllocationWorksheet}
          disabled={disabled}
        >
          <Icon
            size="small"
            icon="report"
          >
            <FormattedMessage id="ui-finance.actions.uploadAllocationWorksheet" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-finance.fund-update-logs.view">
        <Button
          buttonStyle="dropdownItem"
          onClick={onBatchAllocationLogs}
          disabled={disabled}
        >
          <Icon
            size="small"
            icon="report"
          >
            <FormattedMessage id="ui-finance.actions.allocations.batch.logs" />
          </Icon>
        </Button>
      </IfPermission>

    </MenuSection>
  );
};

AllocationToolsMenuSection.propTypes = {
  disabled: PropTypes.bool,
  onBatchAllocate: PropTypes.func.isRequired,
  onBatchAllocationLogs: PropTypes.func.isRequired,
  onDownloadAllocationWorksheet: PropTypes.func.isRequired,
  onUploadAllocationWorksheet: PropTypes.func.isRequired,
};
