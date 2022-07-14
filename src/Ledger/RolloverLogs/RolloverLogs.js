import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import { noop } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  FiltersPane,
  ResetButton,
  ResultsPane,
  NoResultsMessage,
  useFiltersToogle,
  useLocationFilters,
  usePagination,
  RESULT_COUNT_INCREMENT,
  PrevNextPagination,
} from '@folio/stripes-acq-components';

import {
  ROLLOVER_LOGS_COLUMNS_MAPPING,
  ROLLOVER_LOGS_RESULTS_FORMATTER,
  ROLLOVER_LOGS_VISIBLE_COLUMNS,
} from './constants';
import { useRolloverLogs } from './hooks';
import { RolloverLogsFilters } from './RolloverLogsFilters/RolloverLogsFilters';

const resultsPaneTitle = <FormattedMessage id="ui-finance.actions.rolloverLogs" />;

export const RolloverLogs = () => {
  const history = useHistory();
  const location = useLocation();
  const { id: ledgerId } = useParams();

  const { pagination, changePage } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-finance/rollover-logs/filters');
  const [
    filters,,
    applyFilters,,,
    resetFilters,
  ] = useLocationFilters(location, history, noop);
  const {
    isFetching,
    isLoading,
    rolloverLogs,
    totalRecords,
  } = useRolloverLogs({ ledgerId, pagination });

  const resultsStatusMessage = useMemo(() => (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  ), [filters, isFiltersOpened, isLoading, toggleFilters]);

  return (
    <PersistedPaneset
      appId="ui-finance"
      id="rollover-logs"
      isRoot
    >
      {isFiltersOpened && (
        <FiltersPane toggleFilters={toggleFilters}>
          <ResetButton
            id="reset-rollover-logs-filters"
            reset={resetFilters}
            disabled={!location.search || isLoading}
          />
          <RolloverLogsFilters
            activeFilters={filters}
            applyFilters={applyFilters}
            disabled={isLoading}
          />
        </FiltersPane>
      )}

      <ResultsPane
        id="rollover-logs-results-pane"
        autosize
        title={resultsPaneTitle}
        count={totalRecords}
        toggleFiltersPane={toggleFilters}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
        isLoading={isLoading}
      >
        {(({ height, width }) => (
          <>
            <MultiColumnList
              id="rollover-logs-list"
              columnIdPrefix="rollover-logs"
              columnMapping={ROLLOVER_LOGS_COLUMNS_MAPPING}
              contentData={rolloverLogs}
              formatter={ROLLOVER_LOGS_RESULTS_FORMATTER}
              hasMargin
              interactive={false}
              isEmptyMessage={resultsStatusMessage}
              loading={isFetching}
              onNeedMoreData={changePage}
              pageAmount={RESULT_COUNT_INCREMENT}
              pagingType="none"
              totalCount={totalRecords}
              visibleColumns={ROLLOVER_LOGS_VISIBLE_COLUMNS}
              height={height - PrevNextPagination.HEIGHT}
              width={width}
            />
            {rolloverLogs.length > 0 && (
              <PrevNextPagination
                {...pagination}
                totalCount={totalRecords}
                disabled={isFetching}
                onChange={changePage}
              />
            )}
          </>
        ))}
      </ResultsPane>
    </PersistedPaneset>
  );
};
