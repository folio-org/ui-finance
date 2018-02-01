import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';
// Folio
import { filters2cql } from '@folio/stripes-components/lib/FilterGroups';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import packageInfo from '../../../package';
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
      { name: 'Active', cql: 'true' },
      { name: 'Pending', cql: 'false' },
      { name: 'Inactive', cql: 'false' },
    ]
  }
];

class Main extends Component {
  static manifest = Object.freeze({
    localRes: {},
    records: {
      type: 'okapi',
      records: 'vendors',
      path: 'vendor'
    }
  });

  // constructor(props) {
  //   super(props);
  // }

  componentWillMount() {}

  render() {
    const props = this.props;
    console.log(props);
    const initialPath = 'vendor';//(_.get(packageInfo, ['stripes', 'home']));
    console.log(initialPath);
    return (
    <div style={{width: '100%'}}>
      <SearchAndSort
        moduleName={packageInfo.name.replace(/.*\//, '')}
        moduleTitle={packageInfo.stripes.displayName}
        objectName="finance"
        baseRoute={'vendor'}
        baseRoute={packageInfo.stripes.route}
        initialPath={initialPath}
        filterConfig={filterConfig}
          visibleColumns={['name', 'vendor_status', 'payment_method']}
        // initialFilters={'vendor_status.Active'}
        viewRecordComponent={View}
        initialResultCount={INITIAL_RESULT_COUNT}
        resultCountIncrement={RESULT_COUNT_INCREMENT}
        parentResources={props.resources}
        parentMutator={props.mutator}
      />
      <p>Test</p>
    </div>
    )
  }
}

export default Main;