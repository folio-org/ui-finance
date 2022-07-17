export const EXPORT_EXPENSE_CLASSES_VALUES = {
  all: 'all',
  active: 'active',
  inactive: 'inactive',
  none: 'none',
};

export const EXPORT_EXPENSE_CLASS_STATUSES_MAP = {
  [EXPORT_EXPENSE_CLASSES_VALUES.all]: ['Active', 'Inactive'],
  [EXPORT_EXPENSE_CLASSES_VALUES.active]: ['Active'],
  [EXPORT_EXPENSE_CLASSES_VALUES.inactive]: ['Inactive'],
  [EXPORT_EXPENSE_CLASSES_VALUES.none]: null,
};
