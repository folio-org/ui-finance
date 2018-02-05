import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';
// Folio
import uuid from 'uuid';
import { filters2cql } from '@folio/stripes-components/lib/FilterGroups';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import packageInfo from '../../../package';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
// Components and Pages
import View from '../View';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = [
  {
    label: 'Vendor Status',
    name: 'vendor_status',
    cql: 'vendor_status',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Pending', cql: 'pending' },
      { name: 'Inactive', cql: 'inactive' },
    ]
  }
];

class Main extends Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'Name',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'vendors',
      recordsRequired: '%{resultCount}',
      path: 'vendor',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            /*
              This code is not DRY as it is copied from makeQueryFunction in stripes-components.
              This is necessary, as makeQueryFunction only referneces query paramaters as a data source.
              STRIPES-480 is intended to correct this and allow this query function to be replace with a call
              to makeQueryFunction.
              https://issues.folio.org/browse/STRIPES-480
            */
            const resourceData = args[2];
            console.log(resourceData);
            const sortMap = {
              'Vendor Status': 'vendor_status',
              Name: 'name',
            };

            let cql = `(name="${resourceData.query.query}*")`;
            console.log(cql);
            const filterCql = filters2cql(filterConfig, resourceData.query.filters);
            if (filterCql) {
              if (cql) {
                cql = `(${cql}) and ${filterCql}`;
              } else {
                cql = filterCql;
              }
            }
            console.log(cql);

            const { sort } = resourceData.query;
            if (sort) {
              const sortIndexes = sort.split(',').map((sort1) => {
                let reverse = false;
                if (sort1.startsWith('-')) {
                  // eslint-disable-next-line no-param-reassign
                  sort1 = sort1.substr(1);
                  reverse = true;
                }
                let sortIndex = sortMap[sort1] || sort1;
                if (reverse) {
                  sortIndex = `${sortIndex.replace(' ', '/sort.descending ')}/sort.descending`;
                }
                return sortIndex;
              });

              cql += ` sortby ${sortIndexes.join(' ')}`;
            }
            console.log(cql);
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    }
  });

  constructor(props) {
    super(props);
  }
 
  componentWillMount() {
  }

  render() {
    const props = this.props;
    // console.log(props);
    const initialPath = (_.get(packageInfo, ['stripes', 'home']));
    // console.log(initialPath);
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Vendor Status': data => _.get(data, ['vendor_status'], '')
    }
    return (
      <div style={{width: '100%'}}>
        <SearchAndSort
          moduleName={packageInfo.name.replace(/.*\//, '')}
          moduleTitle={packageInfo.stripes.displayName}
          objectName="finance"
          baseRoute={'vendor'}
          baseRoute={packageInfo.stripes.route}
          filterConfig={filterConfig}
          visibleColumns={['Name', 'Vendor Status']}
          resultsFormatter={resultsFormatter}
          initialFilters={this.constructor.manifest.query.initialValue.filters}
          viewRecordComponent={View}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          parentResources={props.resources}
          parentMutator={props.mutator}
        />
      </div>
    )
  }
}

export default Main;