import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  KeyValue,
  Loading,
} from '@folio/stripes/components';
import {
  baseManifest,
  EXPENSE_CLASSES_API,
} from '@folio/stripes-acq-components';

const ExpenseClassValue = ({ id, label, mutator }) => {
  const [expenseClass, setExpenseClass] = useState();

  useEffect(
    () => {
      setExpenseClass();

      if (id) {
        mutator.expenseClass.GET({
          path: `${EXPENSE_CLASSES_API}/${id}`,
        })
          .then(setExpenseClass)
          .catch(() => setExpenseClass({}));
      } else setExpenseClass({});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  if (!expenseClass) {
    return <Loading />;
  }

  return (
    <KeyValue
      label={label}
      value={expenseClass.name}
    />
  );
};

ExpenseClassValue.manifest = Object.freeze({
  expenseClass: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
});

ExpenseClassValue.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(ExpenseClassValue);
