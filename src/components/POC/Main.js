import { Button, Col, Datepicker, MultiSelection, Pane, Paneset, Row, Select, Selection, TextArea, TextField } from '@folio/stripes/components';
import FormEngine from './formwire/src/core/FormEngine';
import { FormProvider } from './formwire/src/react/FormContext';
import Field from './formwire/src/react/adapters/FinalFormField';
import FieldArray from './formwire/src/react/adapters/FinalFormFieldArray';

const selectOptions = [
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
  { label: 'Three', value: 3 },
];

const generateRow = () => Array.from({ length: 10 }).reduce((acc, _, index) => {
  acc[`field${index + 1}`] = index + 1;

  return acc;
}, {});

const initialValues = {
  lines: Array.from({ length: 1150 }, () => generateRow()),
};

const engine = new FormEngine(initialValues);

export default function Main() {
  console.log('engine', engine);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit', engine.getValues());
  };

  return (
    <Paneset>
      <form
        onSubmit={handleSubmit}
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
            <FormProvider engine={engine}>
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
                            validate={(value) => value > 1 && 'Should be less than or equal to ' + 1}
                            fullWidth
                          />
                        </Col>
                        <Col xs>
                          <Field
                            component={TextField}
                            name={`lines[${idx}].number`}
                            validate={(value) => value > 2 && 'Should be less than or equal to ' + 2}
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
                            dataOptions={selectOptions}
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
            </FormProvider>
          </div>
        </Pane>
      </form>
    </Paneset>
  );
}
