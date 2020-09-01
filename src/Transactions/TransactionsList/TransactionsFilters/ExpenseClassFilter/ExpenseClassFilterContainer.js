import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { expenseClassesManifest } from '@folio/stripes-acq-components';

import ExpenseClassFilter from './ExpenseClassFilter';

const ExpenseClassFilterContainer = ({ resources, ...rest }) => {
  const expenseClasses = resources.expenseClasses?.records;

  if (!expenseClasses) {
    return null;
  }

  return (
    <ExpenseClassFilter
      {...rest}
      expenseClasses={expenseClasses}
    />
  );
};

ExpenseClassFilterContainer.manifest = Object.freeze({
  expenseClasses: expenseClassesManifest,
});

ExpenseClassFilterContainer.propTypes = {
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(ExpenseClassFilterContainer);
