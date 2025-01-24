import React, { useCallback, useMemo } from 'react';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import {
  Col,
  Pane,
  Paneset,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  LEDGERS_ROUTE,
  GROUPS_ROUTE,
} from '../../../const';
import { useBatchAllocation } from '../useBatchAllocation';
import { BATCH_ALLOCATION_COLUMNS } from '../constants';
import {
  getBatchAllocationColumnMapping,
  useBatchAllocationColumnValues,
} from '../utils';

export const CreateBatchAllocations = () => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { id, fiscalyear } = useParams();
  const type = location.pathname.includes(LEDGERS_ROUTE) ? 'ledgerId' : 'groupId';
  // const params = { query: `fiscalYearId=="${fiscalyear}" and ${type}=="${id}"` };
  const { budgetsFunds } = useBatchAllocation();

  const columnMapping = useMemo(() => {
    return getBatchAllocationColumnMapping({ intl });
  }, [intl]);

  const columnValues = useBatchAllocationColumnValues({ budgetsFunds, intl });

  const close = useCallback(
    () => {
      history.push({
        pathname: `${type === 'ledgerId' ? LEDGERS_ROUTE : GROUPS_ROUTE}/${id}/view`,
        search: location.search,
      });
    },
    [history, location.search, id, type],
  );

  return (
    <>
      <TitleManager record="paneLedgerName" />
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-ledger-rollover-form"
          onClose={close}
          paneTitle="FY2024"
          paneSub="One-time"
        >
          <Row>
            <Col
              xs={12}
              md={10}
              mdOffset={1}
            >
              <MultiColumnList
                visibleColumns={BATCH_ALLOCATION_COLUMNS}
                columnMapping={columnMapping}
                contentData={columnValues}
                id="list-item-funds"
                interactive={false}
              />
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </>
  );
};
