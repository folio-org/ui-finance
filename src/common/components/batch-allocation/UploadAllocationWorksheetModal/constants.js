import { EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS } from '../../../const';

export const headersMap = new Map(
  Object
    .entries(EXPORT_ALLOCATION_WORKSHEET_FIELDS_LABELS)
    .map(([key, value]) => [value, key]),
);
