import React from 'react';
import { useIntl } from 'react-intl';

import css from './ExpenseClassSettings.css';

export const ExpenseClassHelper = () => {
  const { formatMessage } = useIntl();

  return (
    <div className={css.expenseClassHelper}>
      {formatMessage({ id: 'ui-finance.expenseClass.helper' })}
    </div>
  );
};
