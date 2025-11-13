import get from 'lodash/get';
import {
  memo,
  startTransition,
  useCallback,
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { MultiSelection } from '@folio/stripes/components';
import { filterArrayValues } from '@folio/stripes-acq-components';
import { Field } from '@folio/stripes-acq-components/experimental';

import { FINANCE_DATA_API } from '../../../../common/const';
import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../../constants';

import css from './styles.css';

const itemToString = (item) => item;

const renderTag = ({ exactMatch, filterValue }) => {
  if (exactMatch || !filterValue) {
    return null;
  } else {
    return (
      <FormattedMessage
        id="stripes-acq-components.addTagFor"
        values={{ filterValue }}
      />
    );
  }
};

const onBlurDefault = e => { e.preventDefault(); };

const DEFAULT_TAGS = [];

const FieldTagsComponent = memo(({
  allTags = DEFAULT_TAGS,
  engine,
  fullWidth,
  isLoading = false,
  labelless = false,
  marginBottom0,
  name,
  onAdd,
  ...props
}) => {
  const addTag = useCallback(({ inputValue }) => {
    startTransition(() => {
      const formValues = engine.getFormState()?.values;
      const tag = inputValue.replace(/\s|\|/g, '').toLowerCase();
      const updatedTags = get(formValues, name, []).concat(tag).filter(Boolean);

      if (tag) {
        engine.set(name, updatedTags);
        onAdd(tag);
      }
    });
  }, [engine, name, onAdd]);

  const addAction = useMemo(() => ({ onSelect: addTag, render: renderTag }), [addTag]);
  const actions = useMemo(() => [addAction], [addAction]);

  const dataOptions = useMemo(() => allTags.map(tag => tag.label.toLowerCase()).sort(), [allTags]);

  const formatter = useCallback(({ option }) => {
    const item = allTags.filter(tag => tag.label.toLowerCase() === option)[0];

    if (!item) return option;

    return item.label;
  }, [allTags]);

  return (
    <Field
      actions={actions}
      component={MultiSelection}
      dataOptions={dataOptions}
      emptyMessage=" "
      filter={filterArrayValues}
      formatter={formatter}
      fullWidth={fullWidth}
      itemToString={itemToString}
      label={!labelless && <FormattedMessage id="stripes-acq-components.label.tags" />}
      marginBottom0={marginBottom0}
      name={name}
      onBlur={onBlurDefault}
      showLoading={isLoading}
      {...props}
    />
  );
});

export const BatchAllocationFieldTags = ({
  engine,
  isLoading,
  field,
  ...props
}) => {
  return (
    <div className={css.tagsField}>
      <FieldTagsComponent
        aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.transactionTag.toLocaleLowerCase()}`}
        component={FieldTagsComponent}
        engine={engine}
        fullWidth
        isLoading={isLoading}
        labelless
        marginBottom0
        name={`${FINANCE_DATA_API}[${field[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.index]}].${BATCH_ALLOCATION_FIELDS.transactionTag}.tagList`}
        {...props}
      />
    </div>
  );
};
