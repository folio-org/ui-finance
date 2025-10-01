/**
 * FormContext - React context for FormEngine
 */

import React, { createContext, useContext } from 'react';

const FormContext = createContext(null);

export const FormProvider = ({ children, engine, defaultValidateOn = 'blur' }) => {
  return (
    <FormContext.Provider value={{ engine, defaultValidateOn }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormEngine = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormEngine must be used within a FormProvider');
  }
  return context.engine;
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
