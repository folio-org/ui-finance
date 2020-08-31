import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { SelectionFilter } from '@folio/stripes-acq-components';

import { getExpenseClassesForSelect } from '../../../../common/utils';

const ExpenseClassFilter = ({ expenseClasses, ...rest }) => {
  const options = useMemo(
    () => getExpenseClassesForSelect(expenseClasses),
    [expenseClasses],
  );

  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

ExpenseClassFilter.propTypes = {
  expenseClasses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ExpenseClassFilter;
