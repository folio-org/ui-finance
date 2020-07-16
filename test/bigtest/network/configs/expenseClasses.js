import {
  createGetAll,
  createGetById,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { EXPENSE_CLASSES_API } from '../../../../src/common/const';

const SCHEMA_NAME = 'expenseClasses';

const configExpenseCLasses = server => {
  server.get(EXPENSE_CLASSES_API, createGetAll(SCHEMA_NAME));
  server.get(`${EXPENSE_CLASSES_API}/:id`, createGetById(SCHEMA_NAME));
};

export default configExpenseCLasses;
