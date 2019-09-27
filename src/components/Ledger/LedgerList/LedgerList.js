import React, { Component } from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get, toString } from 'lodash';

import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import {
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
} from '@folio/stripes-acq-components';

import packageInfo from '../../../../package';
import {
  FISCAL_YEARS_API,
  LEDGERS_API,
  FUNDS_API,
} from '../../../common/const';
import FinanceNavigation from '../../../common/FinanceNavigation';

import LedgerPane from '../LedgerPane';
import LedgerView from '../LedgerView';

import LedgerListFilters from './LedgerListFilters';
import { filterConfig } from './LedgerListFilterConfig';
import {
  searchableIndexes,
  ledgersSearchTemplate,
} from './LedgerListSearchConfig';

const ledgerPackageInfo = {
  ...packageInfo,
  stripes: {
    ...packageInfo.stripes,
    route: '/finance/ledger',
    home: '/finance/ledger',
  },
};

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const title = <FormattedMessage id="ui-finance.ledger" />;
const visibleColumns = ['name', 'code'];
const columnMapping = {
  'name': <FormattedMessage id="ui-finance.ledger.name" />,
  'code': <FormattedMessage id="ui-finance.ledger.code" />,
};

class LedgerList extends Component {
  static propTypes = {
    match: PropTypes.object,
    stripes: PropTypes.object,
    intl: intlShape.isRequired,
    onSelectRow: PropTypes.func,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
  };

  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: '',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'ledgers',
      recordsRequired: '%{resultCount}',
      path: LEDGERS_API,
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            ledgersSearchTemplate,
            {},
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    queryCustom: {
      initialValue: {
        ledgerIDQuery: 'query=(id="null")',
        fundQuery: 'query=(ledgerId="null")',
        fiscalyearIDQuery: 'query=(id="null")',
      },
    },
    ledgerID: {
      type: 'okapi',
      records: 'ledgers',
      path: LEDGERS_API,
      resourceShouldRefresh: true,
      recordsRequired: 1,
      params: {
        query: (...args) => {
          const data = args[2];

          if (`${data.queryCustom.ledgerIDQuery}` === 'undefined') return undefined;
          const cql = `${data.queryCustom.ledgerIDQuery} sortby name`;

          return cql;
        },
      },
    },
    fiscalyear: {
      type: 'okapi',
      records: 'fiscalYears',
      path: FISCAL_YEARS_API,
      resourceShouldRefresh: true,
      params: {
        query: () => {
          const cql = 'query=(id="*") sortby id';

          return cql;
        },
      },
    },
    fiscalyearID: {
      type: 'okapi',
      records: 'fiscalYears',
      path: FISCAL_YEARS_API,
      resourceShouldRefresh: true,
      params: {
        query: (...args) => {
          const data = args[2];

          if (`${data.queryCustom.fiscalyearIDQuery}` === 'undefined') return undefined;
          const cql = `${data.queryCustom.fiscalyearIDQuery} sortby name`;

          return cql;
        },
      },
    },
    fund: {
      type: 'okapi',
      records: 'funds',
      resourceShouldRefresh: true,
      path: FUNDS_API,
      params: {
        query: (...args) => {
          const data = args[2];

          if (`${data.queryCustom.fundQuery}` === 'undefined') return undefined;
          const cql = `${data.queryCustom.fundQuery} sortby name`;

          return cql;
        },
      },
    },
  });

  constructor(props) {
    super(props);

    this.getFiscalYears = this.getFiscalYears.bind(this);

    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.changeSearchIndex = changeSearchIndex.bind(this);
  }

  create = (ledgerdata) => {
    const { mutator } = this.props;

    mutator.records.POST(ledgerdata).then(newLedger => {
      mutator.query.update({
        _path: `/finance/ledger/view/${newLedger.id}`,
        layer: null,
      });
    });
  }

  getFiscalYears() {
    const newArr = [];
    const fiscalRecords = (this.props.resources.fiscalyear || {}).records || [];

    if (!fiscalRecords || fiscalRecords.length === 0) return null;
    const arrLength = fiscalRecords.length - 1;

    if (fiscalRecords != null) {
      // Loop through records
      const preObj = { label: 'Select a Fiscal Year', value: '' };

      newArr.push(preObj);
      // Loop through records
      Object.keys(fiscalRecords).map((key) => {
        const name = `${fiscalRecords[key].name}`;
        const val = fiscalRecords[key].id;
        const obj = {
          label: toString(name),
          value: toString(val),
        };

        newArr.push(obj);
        if (Number(key) === arrLength) {
          return newArr;
        }

        return newArr;
      });
    }

    return newArr;
  }

  renderNavigation = () => (
    <FinanceNavigation />
  );

  renderFilters = (onChange) => {
    return (
      <LedgerListFilters
        activeFilters={this.getActiveFilters()}
        onChange={onChange}
      />
    );
  };

  getTranslateSearchableIndexes() {
    const { intl: { formatMessage } } = this.props;

    return searchableIndexes.map(index => {
      const label = formatMessage({ id: `ui-finance.ledger.search.${index.label}` });

      return { ...index, label };
    });
  }

  render() {
    const {
      onSelectRow,
      resources,
      mutator,
      match,
      stripes,
    } = this.props;
    const getFiscalYearsRecords = this.getFiscalYears();

    return (
      <div data-test-ledgers-list>
        <SearchAndSort
          packageInfo={ledgerPackageInfo}
          objectName="ledger"
          baseRoute={`${match.path}`}
          title={title}
          columnMapping={columnMapping}
          visibleColumns={visibleColumns}
          filterConfig={filterConfig}
          viewRecordComponent={LedgerView}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={LedgerPane}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          viewRecordPerms="finance-storage.ledgers.item.get"
          newRecordPerms="finance-storage.ledgers.item.post,login.item.post"
          parentResources={resources}
          parentMutator={mutator}
          detailProps={{ stripes, dropdownFiscalyears: getFiscalYearsRecords }}
          renderFilters={this.renderFilters}
          onFilterChange={this.handleFilterChange}
          searchableIndexes={this.getTranslateSearchableIndexes()}
          selectedIndex={get(resources.query, 'qindex')}
          onChangeIndex={this.changeSearchIndex}
          renderNavigation={this.renderNavigation}
        />
      </div>
    );
  }
}

export default stripesConnect(injectIntl(LedgerList));
