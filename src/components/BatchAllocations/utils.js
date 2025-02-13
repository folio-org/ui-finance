import {
  Button,
  Checkbox,
  Icon,
  NoValue,
  TextLink,
} from '@folio/stripes/components';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import { BATCH_ALLOCATION_ROUTES_DICT } from '../../common/const';
import { BATCH_ALLOCATION_LOG_FIELDS } from './BatchAllocationLogs/constants';

export const resolveDefaultBackPathname = (sourceType, sourceId) => {
  const pathname = `${BATCH_ALLOCATION_ROUTES_DICT[sourceType]}/${sourceId}/view`;

  return pathname;
};

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
  disabled,
  intl,
  selectRecord,
  selectedRecordsMap,
}) => {
  return {
    select: (item) => (
      <Checkbox
        aria-label={intl.formatMessage({ id: 'ui-finance.allocation.batch.logs.columns.select' }, { term: item.id })}
        type="checkbox"
        checked={Boolean(selectedRecordsMap[item.id])}
        onChange={() => selectRecord(item)}
        disabled={disabled}
      />
    ),
    [BATCH_ALLOCATION_LOG_FIELDS.jobName]: (item) => (
      <>
        <TextLink to="#"> {item.jobName} </TextLink>
        <Button
          onClick={() => {}}
          buttonStyle="none"
          bottomMargin0
        >
          <Icon size="small" icon="download" />
        </Button>
      </>
    ),
    [BATCH_ALLOCATION_LOG_FIELDS.status]: (item) => item.status || <NoValue />,
    [BATCH_ALLOCATION_LOG_FIELDS.recordsCount]: (item) => item.recordsCount || <NoValue />,
    [BATCH_ALLOCATION_LOG_FIELDS.createdDate]: (item) => <FolioFormattedTime dateString={item.metadata.createdDate} />,
    [BATCH_ALLOCATION_LOG_FIELDS.updatedDate]: (item) => <FolioFormattedTime dateString={item.metadata.updatedDate} />,
    createdByUsername: ({ createdByUser: { personal: { firstName, lastName } } }) => (
      <TextLink to="#"> {lastName}, {firstName} </TextLink>
    ),
    [BATCH_ALLOCATION_LOG_FIELDS.jobNumber]: (item) => (item.jobNumber || <NoValue />),
  };
};
