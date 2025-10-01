/**
 * Folio Form - Example Usage
 * 
 * Demonstrates the enhanced React Hook Form implementation
 */

import React from 'react';
import { useForm, Form, commonRules } from './src';

// Example form data type
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  bio: string;
  newsletter: boolean;
  country: string;
}

// Example component
export function FolioFormExample() {
  const form = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
      bio: '',
      newsletter: false,
      country: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Folio Form Example</h1>
      
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="firstName">First Name:</label>
          <input
            {...form.register('firstName', commonRules.required('First name is required'))}
            type="text"
            id="firstName"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {form.formState.errors.firstName && (
            <p style={{ color: 'red', fontSize: '14px', margin: '4px 0 0 0' }}>
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="lastName">Last Name:</label>
          <input
            {...form.register('lastName', commonRules.required('Last name is required'))}
            type="text"
            id="lastName"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {form.formState.errors.lastName && (
            <p style={{ color: 'red', fontSize: '14px', margin: '4px 0 0 0' }}>
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Email:</label>
          <input
            {...form.register('email', {
              ...commonRules.required('Email is required'),
              ...commonRules.email('Invalid email address'),
            })}
            type="email"
            id="email"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {form.formState.errors.email && (
            <p style={{ color: 'red', fontSize: '14px', margin: '4px 0 0 0' }}>
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="age">Age:</label>
          <input
            {...form.register('age', {
              ...commonRules.required('Age is required'),
              ...commonRules.min(18, 'Must be at least 18 years old'),
              ...commonRules.max(120, 'Must be at most 120 years old'),
            })}
            type="number"
            id="age"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {form.formState.errors.age && (
            <p style={{ color: 'red', fontSize: '14px', margin: '4px 0 0 0' }}>
              {form.formState.errors.age.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="bio">Bio:</label>
          <textarea
            {...form.register('bio', {
              ...commonRules.maxLength(500, 'Bio must be at most 500 characters'),
            })}
            id="bio"
            rows={4}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {form.formState.errors.bio && (
            <p style={{ color: 'red', fontSize: '14px', margin: '4px 0 0 0' }}>
              {form.formState.errors.bio.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            <input
              {...form.register('newsletter')}
              type="checkbox"
              style={{ marginRight: '8px' }}
            />
            Subscribe to newsletter
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="country">Country:</label>
          <select
            {...form.register('country', commonRules.required('Country is required'))}
            id="country"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
          </select>
          {form.formState.errors.country && (
            <p style={{ color: 'red', fontSize: '14px', margin: '4px 0 0 0' }}>
              {form.formState.errors.country.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: form.formState.isSubmitting ? 'not-allowed' : 'pointer',
              opacity: form.formState.isSubmitting ? 0.6 : 1,
            }}
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>Form State:</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(form.formState, null, 2)}
          </pre>
        </div>
      </Form>
    </div>
  );
}
