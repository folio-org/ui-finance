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
} from '../../../const';
import { useBatchAllocations } from '../useBatchAllocations';

export const BatchAllocationView = () => {
  const ky = useOkapiKy();
  const history = useHistory();
  const location = useLocation();
  const { id: ledgerId } = useParams();

  const funds = useBatchAllocations({ id: ledgerId });

  useEffect(() => {
    console.log("data");
    console.log(funds);
  }, [funds]);

  const close = useCallback(
    () => {
      history.push({
        pathname: `${LEDGERS_ROUTE}/${ledgerId}/view`,
        search: location.search,
      });
    },
    [history, location.search, ledgerId],
  );

  const columnMapping = {
    'fundStatus': 'Fund Status', // editable, sortable
    // 'budgetName': 'Budget Name', // not editable, sortable
    // 'totalAllocatedBefore': 'Total allocated (before)', // not editable
    // 'budgetStatus': 'Budget status', // editable
    // 'allocationIncreaseDecrease': 'Allocation increase/decrease', // editable
    // 'totalAllocatedAfter': 'Total allocated (after)', // editable
    // 'allowableEncumbrance': 'Allowable encumbrance %', // editable
    // 'allowableExpenditure': 'Allowable expenditure %', // editable
    // 'transactionDescription': 'Transaction description', // editable
    // 'transactionTags': 'Transaction tags', // editable
  };

  const visibleColumns = [
    // 'name',
    'fundStatus',
    // 'description',
    // 'tags',
    // 'budgetName',
    // 'totalAllocatedBefore',
    // 'budgetStatus',
    // 'allocationIncreaseDecrease',
    // 'totalAllocatedAfter',
    // 'allowableEncumbrance',
    // 'allowableExpenditure',
  ];

  // const funds = [{
  //   'name': 'General Fund',
  //   'description': 'General fund description',
  //   'tags': 'general, fund',
  //   'budgetName': 'General Budget',
  //   'totalAllocatedBefore': '1000',
  //   'budgetStatus': 'Active',
  //   'allocationIncreaseDecrease': '200',
  //   'totalAllocatedAfter': '1200',
  //   'allowableEncumbrance': '10',
  //   'allowableExpenditure': '20',
  // },
  // {
  //   'name': 'Library Fund',
  //   'description': 'Library fund description',
  //   'tags': 'library, fund',
  //   'budgetName': 'Library Budget',
  //   'totalAllocatedBefore': '2000',
  //   'budgetStatus': 'Active',
  //   'allocationIncreaseDecrease': '300',
  //   'totalAllocatedAfter': '2300',
  //   'allowableEncumbrance': '15',
  //   'allowableExpenditure': '25',
  // },
  // {
  //   'name': 'Technology Fund',
  //   'description': 'Technology fund description',
  //   'tags': 'technology, fund',
  //   'budgetName': 'Technology Budget',
  //   'totalAllocatedBefore': '3000',
  //   'budgetStatus': 'Active',
  //   'allocationIncreaseDecrease': '400',
  //   'totalAllocatedAfter': '3400',
  //   'allowableEncumbrance': '20',
  //   'allowableExpenditure': '30',
  // }];

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
                contentData={funds}
                id="list-item-funds"
                interactive={false}
              />
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </>);
};
