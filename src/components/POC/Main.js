import React, { useTransition, Suspense } from 'react';
import { Button, Checkbox, Col, Datepicker, MultiSelection, Pane, Paneset, RadioButton, Row, Select, Selection, TextArea, TextField } from '@folio/stripes/components';
import { useForm, Form, Controller } from './folio-form/src';

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
const OptimizedTextField = React.memo(({ name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
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

const OptimizedTextArea = React.memo(({ name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
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

const OptimizedSelect = React.memo(({ name, rules, dataOptions, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
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

const OptimizedSelection = React.memo(({ name, rules, dataOptions, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
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

const OptimizedMultiSelection = React.memo(({ name, rules, dataOptions, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
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

const OptimizedDatepicker = React.memo(({ name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
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
const OptimizedCheckbox = React.memo(({ name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
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
const OptimizedRadio = React.memo(({ name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
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
const FormRow = React.memo(({ idx, selectOptions: options }) => (
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
      />
    </Col>

    <Col xs>
      <OptimizedRadio
        name={`lines[${idx}].radio`}
        fullWidth
      />
    </Col>

    <Col xs>
      <OptimizedTextField
        name={`lines[${idx}].text`}
        rules={{
          validate: (value) => (value === 'bad' ? 'Text is incorrect and validation fails' : undefined),
        }}
        fullWidth
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
      />
    </Col>

    <Col xs>
      <OptimizedSelect
        name={`lines[${idx}].select`}
        dataOptions={options}
        fullWidth
      />
    </Col>

    <Col xs>
      <OptimizedSelection
        name={`lines[${idx}].selection`}
        dataOptions={options}
        fullWidth
      />
    </Col>

    <Col xs>
      <OptimizedMultiSelection
        name={`lines[${idx}].multiselection`}
        dataOptions={options}
        fullWidth
      />
    </Col>

    <Col xs>
      <OptimizedTextArea
        name={`lines[${idx}].textarea`}
        fullWidth
      />
    </Col>

    <Col xs>
      <OptimizedDatepicker
        name={`lines[${idx}].datepicker`}
        fullWidth
      />
    </Col>
  </Row>
));

export default function Main() {
  const form = useForm({
    defaultValues: initialValues,
    mode: 'onBlur', // Smart validation on blur only
  });

  const { handleSubmit } = form;
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
      <Form
        form={form}
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '100%' }}
      >
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
                <FormRow key={idx} idx={idx} selectOptions={selectOptions} />
              ))}
            </Suspense>
          </div>
        </Pane>
      </Form>
    </Paneset>
  );
}
