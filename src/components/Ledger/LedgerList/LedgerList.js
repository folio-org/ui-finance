import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import {
  baseManifest,
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
  showToast,
} from '@folio/stripes-acq-components';

import packageInfo from '../../../../package';
import {
  FISCAL_YEAR_ROUTE,
  LEDGER_VIEW_ROUTE,
  LEDGERS_API,
  LEDGERS_ROUTE,
  NO_ID,
} from '../../../common/const';
import FinanceNavigation from '../../../common/FinanceNavigation';

import LedgerForm from '../LedgerForm';
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
    route: LEDGERS_ROUTE,
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
    stripes: PropTypes.object,
    intl: intlShape.isRequired,
    onSelectRow: PropTypes.func,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'name',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      ...baseManifest,
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
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  constructor(props) {
    super(props);

    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.changeSearchIndex = changeSearchIndex.bind(this);
    this.callout = React.createRef();
    this.showToast = showToast.bind(this);
  }

  create = async (ledgerdata) => {
    const { history, mutator } = this.props;

    try {
      const savedLedger = await mutator.records.POST(ledgerdata);

      this.showToast('ui-finance.ledger.actions.save.success');
      history.push(`${LEDGER_VIEW_ROUTE}${savedLedger.id}?layer=view`);

      return savedLedger;
    } catch (response) {
      this.showToast('ui-finance.ledger.actions.save.error', 'error');

      return { id: 'Unable to create ledger' };
    }
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

  goToCreateFY = () => {
    this.props.history.push({
      pathname: FISCAL_YEAR_ROUTE,
      search: `?layer=create&ledgerId=${NO_ID}`,
    });
  };

  render() {
    const {
      location,
      mutator,
      onSelectRow,
      resources,
      stripes,
    } = this.props;

    const fiscalYearOneId = get(location, 'state.fiscalYearOneId');
    const newLedgerValues = fiscalYearOneId ? { fiscalYearOneId } : {};

    return (
      <div data-test-ledgers-list>
        <SearchAndSort
          packageInfo={ledgerPackageInfo}
          objectName="ledger"
          baseRoute={ledgerPackageInfo.stripes.route}
          title={title}
          columnMapping={columnMapping}
          visibleColumns={visibleColumns}
          filterConfig={filterConfig}
          viewRecordComponent={LedgerView}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={LedgerForm}
          newRecordInitialValues={newLedgerValues}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          viewRecordPerms="finance.ledgers.item.get"
          newRecordPerms="finance.ledgers.item.post,login.item.post"
          parentResources={resources}
          parentMutator={mutator}
          detailProps={{ stripes, goToCreateFY: this.goToCreateFY }}
          renderFilters={this.renderFilters}
          onFilterChange={this.handleFilterChange}
          searchableIndexes={this.getTranslateSearchableIndexes()}
          selectedIndex={get(resources.query, 'qindex')}
          onChangeIndex={this.changeSearchIndex}
          renderNavigation={this.renderNavigation}
        />
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default stripesConnect(injectIntl(LedgerList));
