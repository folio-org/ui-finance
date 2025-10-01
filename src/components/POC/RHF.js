import React, { useTransition, Suspense } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Button, Checkbox, Col, Datepicker, MultiSelection, Pane, Paneset, RadioButton, Row, Select, Selection, TextArea, TextField } from '@folio/stripes/components';

const selectOptions = [
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
  { label: 'Three', value: 3 },
];

const generateRow = () => ({
  text: '',
  number: 0,
  select: 1,
  selection: 1,
  multiselection: [1],
  textarea: '',
  datepicker: null,
});

const initialValues = {
  lines: Array.from({ length: 1150 }, () => generateRow()),
};

// Optimized field components with React.memo
const OptimizedTextField = React.memo(({ control, name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          error={fieldState.error?.message}
          onChange={(e) => field.onChange(e)}
        />
      )}
    />
  );
});

const OptimizedTextArea = React.memo(({ control, name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => (
        <TextArea
          {...field}
          {...props}
          onChange={(e) => field.onChange(e)}
        />
      )}
    />
  );
});

const OptimizedSelect = React.memo(({ control, name, rules, dataOptions, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          {...props}
          dataOptions={dataOptions}
          onChange={(e) => field.onChange(e)}
        />
      )}
    />
  );
});

const OptimizedSelection = React.memo(({ control, name, rules, dataOptions, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => (
        <Selection
          {...field}
          {...props}
          dataOptions={dataOptions}
          onChange={(value) => field.onChange(value)}
        />
      )}
    />
  );
});

const OptimizedMultiSelection = React.memo(({ control, name, rules, dataOptions, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => (
        <MultiSelection
          {...field}
          {...props}
          dataOptions={dataOptions}
          onChange={(value) => field.onChange(value)}
        />
      )}
    />
  );
});

const OptimizedDatepicker = React.memo(({ control, name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => (
        <Datepicker
          {...field}
          {...props}
          onChange={(e, value) => field.onChange(value)}
        />
      )}
    />
  );
});

// Optimized checkbox component
const OptimizedCheckbox = React.memo(({ control, name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => (
        <Checkbox
          {...field}
          {...props}
        />
      )}
    />
  );
});

// Optimized radio component
const OptimizedRadio = React.memo(({ control, name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => (
        <RadioButton
          {...field}
          {...props}
        />
      )}
    />
  );
});

// Memoized row component for better performance
const FormRow = React.memo(({ control, idx, selectOptions: options }) => {
  return (
    <Row key={idx}>
      <Col
        style={{
          width: '50px',
          fontWeight: 'bold',
          textAlign: 'center',
          paddingTop: '0.25rem',
        }}
      >
        {idx + 1}
      </Col>

      <Col xs>
        <OptimizedCheckbox
          name={`lines[${idx}].checkbox`}
          fullWidth
          control={control}
        />
      </Col>

      <Col xs>
        <OptimizedRadio
          name={`lines[${idx}].radio`}
          fullWidth
          control={control}
        />
      </Col>

      <Col xs>
        <OptimizedTextField
          name={`lines[${idx}].text`}
          rules={{
            validate: (value) => (value === 'bad' ? 'Text is incorrect and validation fails' : undefined),
          }}
          fullWidth
          control={control}
        />
      </Col>

      <Col xs>
        <OptimizedTextField
          name={`lines[${idx}].number`}
          rules={{
            validate: (value) => (value && Number(value) > 100 ? 'Number should be 100 or less' : undefined),
          }}
          fullWidth
          type="number"
          control={control}
        />
      </Col>

      <Col xs>
        <OptimizedSelect
          name={`lines[${idx}].select`}
          dataOptions={options}
          fullWidth
          control={control}
        />
      </Col>

      <Col xs>
        <OptimizedSelection
          name={`lines[${idx}].selection`}
          dataOptions={options}
          fullWidth
          control={control}
        />
      </Col>

      <Col xs>
        <OptimizedMultiSelection
          name={`lines[${idx}].multiselection`}
          dataOptions={options}
          fullWidth
          control={control}
        />
      </Col>

      <Col xs>
        <OptimizedTextArea
          name={`lines[${idx}].textarea`}
          fullWidth
          control={control}
        />
      </Col>

      <Col xs>
        <OptimizedDatepicker
          name={`lines[${idx}].datepicker`}
          fullWidth
          control={control}
        />
      </Col>
    </Row>
  );
});

export default function RHF() {
  const form = useForm({
    defaultValues: initialValues,
    mode: 'onBlur', // Smart validation on blur only
  });

  const { control, handleSubmit } = form;
  const [isPending] = useTransition();

  const onSubmit = (values) => {
    // eslint-disable-next-line no-console
    console.log('submit', values);
    // eslint-disable-next-line no-console
    console.log('submit lines count:', values?.lines?.length);
    // eslint-disable-next-line no-console
    console.log('first line sample:', values?.lines?.[0]);
  };

  return (
    <Paneset>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Pane
          defaultWidth="fill"
          padContent={false}
          lastMenu={(
            (
              <Button
                type="submit"
                buttonStyle="primary"
                marginBottom0
                disabled={isPending}
              >
                {isPending ? 'Processing...' : 'Submit'}
              </Button>
            )
          )}
        >
          <div
            id="form-container"
            style={{
              padding: '0 1rem',
            }}
          >
            <Row
              style={{
                position: 'sticky',
                top: 0,
                marginBottom: '0.5rem',
                padding: '0.5rem 0',
                backgroundColor: 'white',
                borderBottom: '1px solid var(--color-border)',
                zIndex: 1,
              }}
            >
              <Col
                style={{ width: '50px' }}
              >
                &nbsp;
              </Col>
              {Array.from({ length: 8 }).map((_, index) => (
                <Col
                  xs
                  key={index}
                  style={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                  <strong>{index + 1}</strong>
                </Col>
              ))}
            </Row>

            {/* Render 50 rows of form fields with Suspense */}
            <Suspense fallback={<div>Loading form fields...</div>}>
              {Array.from({ length: 1150 }).map((_, idx) => (
                <FormRow
                  key={idx}
                  idx={idx}
                  selectOptions={selectOptions}
                  control={control}
                />
              ))}
            </Suspense>
          </div>
        </Pane>
      </form>
    </Paneset>
  );
}
