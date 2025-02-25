import React, { useCallback, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import {
  TitleManager,
} from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  Button,
  checkScope,
  ConfirmationModal,
  HasCommand,
  Icon,
  MultiColumnList,
  MenuSection,
  Pane,
  NoValue,
} from '@folio/stripes/components';
import {
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  DetailsRemoveAction,
} from '../../../common/DetailsActions';
import {
  BATCH_ALLOCATION_COLUMNS,
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_LOG_COLUMN_WIDTHS,
} from '../constants';
import {
  getBatchAllocationColumnMapping,
  exportCsvBatchAllocationLog,
} from '../utils';

const DEFAULT_LOG_DETAILS = [];
const shortcuts = [];

export const BatchAllocationLogDetails = ({
  batchAllocationLog,
  onClose,
  onRemove,
}) => {
  const intl = useIntl();
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();

  const renderActionMenu = useCallback(
    ({ onToggle }) => {
      return (
        <>
          <MenuSection id="batch-log-details-actions">
            <Button
              buttonStyle="dropdownItem"
              data-test-details-download-action
              data-testid="details-remove-action"
              onClick={() => {
                exportCsvBatchAllocationLog(batchAllocationLog, intl);
                onToggle();
              }}
            >
              <Icon
                size="small"
                icon="download"
              >
                <FormattedMessage id="ui-finance.actions.allocations.download" />
              </Icon>
            </Button>

            <DetailsRemoveAction
              perm="ui-finance.fund-update-logs.delete"
              onRemove={toggleRemoveConfirmation}
              toggleActionMenu={onToggle}
            />
          </MenuSection>
        </>
      );
    },
    [intl, batchAllocationLog, toggleRemoveConfirmation],
  );

  const columnMapping = useMemo(() => {
    return getBatchAllocationColumnMapping({ intl });
  }, [intl]);

  const formatter = useMemo(() => ({
    [BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation]: item => item.budgetCurrentAllocation ?? <NoValue />,
    [BATCH_ALLOCATION_FIELDS.fundStatus]: item => (item.fundStatus
      ? <FormattedMessage id={`ui-finance.fund.status.${item.fundStatus.toLowerCase()}`} />
      : <FormattedMessage id="stripes-acq-components.invalidReference" />),
    [BATCH_ALLOCATION_FIELDS.budgetStatus]: item => (item.budgetStatus
      ? <FormattedMessage id={`ui-finance.budget.status.${item.budgetStatus.toLowerCase()}`} />
      : <FormattedMessage id="stripes-acq-components.invalidReference" />),
    [BATCH_ALLOCATION_FIELDS.transactionTag]: item => item.transactionTag?.tagList?.join(', '),
  }), []);

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <TitleManager record={batchAllocationLog.jobName} />

      <Pane
        id="pane-batch-log-details"
        defaultWidth="fill"
        dismissible
        actionMenu={renderActionMenu}
        paneTitle={batchAllocationLog.jobName}
        onClose={onClose}
      >
        <ViewMetaData metadata={batchAllocationLog.metadata} />

        <MultiColumnList
          contentData={batchAllocationLog.financeData || DEFAULT_LOG_DETAILS}
          columnMapping={columnMapping}
          columnWidths={BATCH_ALLOCATION_LOG_COLUMN_WIDTHS}
          formatter={formatter}
          sortedColumn={BATCH_ALLOCATION_FIELDS.fundName}
          visibleColumns={BATCH_ALLOCATION_COLUMNS}
        />

        {isRemoveConfirmation && (
          <ConfirmationModal
            id="batch-allocation-log-remove-confirmation"
            confirmLabel={<FormattedMessage id="ui-finance.actions.remove.confirm" />}
            heading={<FormattedMessage id="ui-finance.allocation.batch.logs.actions.remove.heading" />}
            message={<FormattedMessage id="ui-finance.allocation.batch.logs.actions.remove.message" />}
            onCancel={toggleRemoveConfirmation}
            onConfirm={onRemove}
            open
          />
        )}
      </Pane>
    </HasCommand>
  );
};
