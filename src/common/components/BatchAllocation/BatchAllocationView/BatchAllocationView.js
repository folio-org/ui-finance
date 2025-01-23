import React, { useCallback, useEffect, useState } from 'react';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import { TitleManager, useOkapiKy } from '@folio/stripes/core';
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

export const BatchAllocationView = () => {
  const history = useHistory();
  const location = useLocation();
  const { id, fiscalyear } = useParams();
  const type = location.pathname.includes(LEDGERS_ROUTE) ? 'ledgerId' : 'groupId';
  // const params = { query: `fiscalYearId=="${fiscalyear}" and ${type}=="${id}"` };
  const { budgetsFunds } = useBatchAllocation();

  const close = useCallback(
    () => {
      history.push({
        pathname: `${type === 'ledgerId' ? LEDGERS_ROUTE : GROUPS_ROUTE}/${id}/view`,
        search: location.search,
      });
    },
    [history, location.search, id, type],
  );

  const columnMapping = {
    'fundName': 'Fund name', // not editable, sortable
    'fundStatus': 'Fund status', // editable
    'budgetName': 'Budget Name', // not editable, sortable
    // 'totalAllocatedBefore': 'Total allocated (before)', // not editable
    'budgetStatus': 'Budget status', // editable
    // 'allocationIncreaseDecrease': 'Allocation increase/decrease', // editable
    // 'totalAllocatedAfter': 'Total allocated (after)', // editable
    'budgetAllowableEncumbrance': 'Allowable encumbrance %', // editable
    'budgetAllowableExpenditure': 'Allowable expenditure %', // editable
    // 'transactionDescription': 'Transaction description', // editable
    // 'fundTags': 'Transaction tags', // editable
  };

  const visibleColumns = [
    'fundName',
    'fundStatus',
    'budgetName',
    // 'totalAllocatedBefore',
    'budgetStatus',
    // 'allocationIncreaseDecrease',
    // 'totalAllocatedAfter',
    'budgetAllowableEncumbrance',
    'budgetAllowableExpenditure',
    // 'transactionDescription',
    // 'fundTags',
  ];

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
                visibleColumns={visibleColumns}
                columnMapping={columnMapping}
                contentData={budgetsFunds}
                id="list-item-funds"
                interactive={false}
              />
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </>);
};
