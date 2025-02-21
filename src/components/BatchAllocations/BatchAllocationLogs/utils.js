import { FormattedMessage } from 'react-intl';

import {
  Button,
  Checkbox,
  Icon,
  NoValue,
  TextLink,
} from '@folio/stripes/components';

import { getFullName } from '@folio/stripes/util';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import { BATCH_ALLOCATION_LOG_STATUSES } from '../constants';
import { exportCsvBatchAllocationLog } from '../utils';
import { BATCH_ALLOCATION_LOG_FIELDS } from './constants';

export const getLogsListColumnMapping = ({
  intl,
  isAllSelected,
  selectAll,
  disabled,
}) => {
  const mapping = Object.keys(BATCH_ALLOCATION_LOG_FIELDS).reduce((acc, column) => {
    return { ...acc, [column]: intl.formatMessage({ id: `ui-finance.allocation.batch.logs.columns.${column}` }) };
  }, {});

  return {
    select: (
      <Checkbox
        aria-label={intl.formatMessage({ id: 'ui-finance.allocation.batch.logs.columns.selectAll' })}
        checked={isAllSelected}
        onChange={selectAll}
        type="checkbox"
        disabled={disabled}
      />
    ),
    ...mapping,
  };
};

export const getResultsListFormatter = ({
  intl,
  path,
  locationSearch,
  locationState,
  disabled,
  selectRecord,
  selectedRecordsMap,
}) => {
  return {
    select: (item) => (
      <Checkbox
        aria-label={intl.formatMessage({ id: 'ui-finance.allocation.batch.logs.columns.select' }, { id: item.id })}
        type="checkbox"
        checked={Boolean(selectedRecordsMap[item.id])}
        onChange={() => selectRecord(item)}
        disabled={disabled}
      />
    ),
    [BATCH_ALLOCATION_LOG_FIELDS.jobName]: (item) => (
      <>
        <TextLink
          to={{
            pathname: `${path}/${item.id}/view${locationSearch}`,
            state: locationState,
          }}
        >
          {item.jobName}
        </TextLink>

        <Button
          onClick={() => exportCsvBatchAllocationLog(item, intl)}
          buttonStyle="none"
          bottomMargin0
          title={intl.formatMessage({ id: 'actions.allocations.download' })}
        >
          <Icon size="small" icon="download" />
        </Button>
      </>
    ),
    [BATCH_ALLOCATION_LOG_FIELDS.status]: (item) => (
      <FormattedMessage id={`ui-finance.allocation.batch.logs.columns.status.${BATCH_ALLOCATION_LOG_STATUSES[item.status]}`} />
    ),
    [BATCH_ALLOCATION_LOG_FIELDS.recordsCount]: (item) => item.recordsCount || <NoValue />,
    [BATCH_ALLOCATION_LOG_FIELDS.createdDate]: (item) => <FolioFormattedTime dateString={item.metadata.createdDate} />,
    [BATCH_ALLOCATION_LOG_FIELDS.updatedDate]: (item) => <FolioFormattedTime dateString={item.metadata.updatedDate} />,
    createdByUsername: (item) => (
      <TextLink to={`/users/preview/${item.createdByUser?.id}`}>{getFullName(item.createdByUser)}</TextLink>
    ),
    [BATCH_ALLOCATION_LOG_FIELDS.jobNumber]: (item) => (item.jobNumber || <NoValue />),
  };
};
