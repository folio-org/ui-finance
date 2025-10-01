import { Button, Col, Datepicker, MultiSelection, Pane, Paneset, Row, Select, Selection, TextArea, TextField } from '@folio/stripes/components';
import { Form, Field, FieldArray } from './formwire/src';

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
  lines: Array.from({ length: 150 }, () => generateRow()),
};

export default function Main() {
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
        onSubmit={onSubmit}
        style={{ width: '100%' }}
        defaultValidateOn="blur"
        initialValues={initialValues}
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
              >
                Submit
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
              {Array.from({ length: 6 }).map((_, index) => (
                <Col
                  xs
                  key={index}
                  style={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                  <strong>{index + 1}</strong>
                </Col>
              ))}
            </Row>
            <FieldArray name="lines">
              {({ fields }) => (
                <>
                  {fields.map((line, idx) => (
                    <Row key={line.__id}>
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
                        <Field
                          component={TextField}
                          name={`lines[${idx}].text`}
                          validate={(value) => (value === 'bad' ? 'Text is incorrect and validation fails' : undefined)}
                          validateOn="change"
                          fullWidth
                        />
                      </Col>
                      <Col xs>
                        <Field
                          component={TextField}
                          name={`lines[${idx}].number`}
                          validate={(value) => (value && Number(value) > 100 ? 'Number should be 100 or less' : undefined)}
                          fullWidth
                          type="number"
                        />
                      </Col>
                      <Col xs>
                        <Field
                          component={Select}
                          dataOptions={selectOptions}
                          name={`lines[${idx}].select`}
                          fullWidth
                        />
                      </Col>
                      <Col xs>
                        <Field
                          component={Selection}
                          dataOptions={selectOptions}
                          name={`lines[${idx}].selection`}
                          fullWidth
                        />
                      </Col>
                      <Col xs>
                        <Field
                          component={MultiSelection}
                          dataOptions={selectOptions}
                          name={`lines[${idx}].multiselection`}
                          fullWidth
                        />
                      </Col>
                      <Col xs>
                        <Field
                          component={TextArea}
                          name={`lines[${idx}].textarea`}
                          fullWidth
                        />
                      </Col>
                      <Col xs>
                        <Field
                          component={Datepicker}
                          name={`lines[${idx}].datepicker`}
                          fullWidth
                        />
                      </Col>
                    </Row>

                  ))}
                </>
              )}
            </FieldArray>
          </div>
        </Pane>
      </Form>
    </Paneset>
  );
}
