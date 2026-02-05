import get from 'lodash/get';
import PropTypes from 'prop-types';
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

import { BATCH_ALLOCATION_FIELDS } from '../../constants';

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
      const tag = inputValue.replaceAll(/\s|\|/g, '').toLowerCase();
      const updatedTags = get(formValues, name, []).concat(tag).filter(Boolean);

      if (tag) {
        engine.set(name, updatedTags);
        onAdd(tag);
      }
    });
  }, [engine, name, onAdd]);

  const addAction = useMemo(() => ({ onSelect: addTag, render: renderTag }), [addTag]);
  const actions = useMemo(() => [addAction], [addAction]);

  const dataOptions = useMemo(() => {
    return allTags.map(tag => tag.label.toLowerCase()).sort((a, b) => a.localeCompare(b));
  }, [allTags]);

  const formatter = useCallback(({ option }) => {
    const item = allTags.find(tag => tag.label.toLowerCase() === option);

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

FieldTagsComponent.propTypes = {
  allTags: PropTypes.arrayOf(PropTypes.object),
  engine: PropTypes.object.isRequired,
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  labelless: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export const BatchAllocationFieldTags = ({
  engine,
  isLoading,
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
        {...props}
      />
    </div>
  );
};

BatchAllocationFieldTags.propTypes = {
  allTags: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  engine: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
};
