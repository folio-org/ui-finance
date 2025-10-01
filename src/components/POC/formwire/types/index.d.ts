import React from 'react';

// Core Types
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, any>;
  touched: string[];
  active: string | null;
  submitting: boolean;
  submitFailed: boolean;
  submitSucceeded: boolean;
  valid: boolean;
}

export interface FieldSubscription {
  value?: boolean;
  error?: boolean;
  touched?: boolean;
  active?: boolean;
}

export interface ValidationOptions {
  runOnSet?: boolean;
  validateOn?: 'change' | 'blur' | 'submit';
}

export interface SelectorOptions {
  deep?: boolean;
  equalityFn?: (a: any, b: any) => boolean;
}

export interface SubmitResult {
  ok: boolean;
  errors: Record<string, any>;
  values: Record<string, any>;
}

export interface PatchItem {
  path: string;
  value: any;
}

export interface BatchOptions {
  silent?: boolean;
  immediate?: boolean;
  transaction?: boolean;
}

// FormEngine Interface
export interface FormEngine {
  // Value Management
  getValues(): Record<string, any>;
  get(path: string): any;
  set(path: string, value: any, opts?: BatchOptions): void;
  setMany(patchList: PatchItem[], opts?: BatchOptions): void;

  // Form State
  getFormState(): FormState;
  getErrors(): Record<string, any>;

  // Field State
  touch(path: string): void;
  isTouched(path: string): boolean;
  focus(path: string): void;
  blur(): void;

  // Validation
  registerValidator(path: string, fn: (value: any, allValues: any) => any, opts?: ValidationOptions): void;
  runValidators(opts?: { paths?: string[] }): Promise<Record<string, any>>;
  setFieldError(path: string, error: any): void;

  // Array Operations
  push(path: string, item: any): void;
  removeAt(path: string, index: number): void;

  // Event System
  subscribe(pathOrStar: string, cb: (value: any, allValues: any) => void): () => void;
  subscribeMeta(path: string, cb: (error: any) => void): () => void;
  subscribeSelector(selector: (values: any) => any, cb: (selected: any, meta: any) => void, opts?: SelectorOptions): () => void;

  // Batching & Transactions
  batch(fn: () => void): void;
  transaction(fn: () => void): void;
  flush(): void;

  // WeakMap Optimizations
  setComponentMetadata(component: any, metadata: any): void;
  getComponentMetadata(component: any): any;
  setFieldSubscriptions(component: any, subscriptions: (() => void)[]): void;
  getFieldSubscriptions(component: any): (() => void)[];
  cleanupFieldSubscriptions(component: any): void;
  setFieldValidators(component: any, validators: any[]): void;
  cleanupComponent(component: any): void;
  cacheFieldValue(component: any, key: string, value: any, ttl?: number): void;
  getCachedFieldValue(component: any, key: string, maxAge?: number): any;
  addEventListener(component: any, event: string, handler: Function, target?: any): () => void;
  getOptimizationStats(): any;

  // Utility Methods
  getPerformanceMetrics(): any;
  clearAllErrors(): void;
  clearErrors(paths: string | string[]): void;
  submit(): Promise<SubmitResult>;
}

// React Context
export interface FormContextValue {
  engine: FormEngine;
  defaultValidateOn: string;
}

export const FormProvider: React.FC<{ 
  engine: FormEngine; 
  defaultValidateOn?: string;
  children: React.ReactNode;
}>;

export function useFormContext(): FormContextValue;
export function useFormEngine(): FormEngine;

// React Hooks
export interface FieldInput {
  name: string;
  value: any;
  onChange: (event: any) => void;
  onBlur: (event: any) => void;
  onFocus: (event: any) => void;
}

export interface FieldMeta {
  error: any;
  touched: boolean;
  active: boolean;
  dirty: boolean;
  valid: boolean;
}

export interface FieldResult {
  input: FieldInput;
  meta: FieldMeta;
}

export function useField(name: string, subscription?: FieldSubscription): FieldResult;
export function useFormState(selector?: (formState: FormState) => any, opts?: SelectorOptions): any;
export function useWatch(pathOrSelector: string | ((values: any) => any), cb: (value: any) => void, opts?: SelectorOptions): void;
export function useWatchState(selector: (values: any) => any, opts?: SelectorOptions): any;
export function useDebouncedValidation(validate: (value: any, allValues: any) => any, delay?: number): {
  error: any;
  debouncedValidate: (value: any, allValues: any) => void;
};

// React Components
export interface FieldProps {
  name: string;
  component?: React.ComponentType<any>;
  render?: (props: FieldResult) => React.ReactNode;
  subscription?: FieldSubscription;
  validate?: (value: any, allValues: any) => any;
  debounceDelay?: number;
  [key: string]: any;
}

export interface FieldArrayProps {
  name: string;
  children: (props: { fields: any[] }) => React.ReactNode;
}

export interface FormProps {
  onSubmit: (values: any) => void | Promise<void>;
  children: React.ReactNode;
  initialValues?: Record<string, any>;
}

export const Field: React.FC<FieldProps>;
export const FieldArray: React.FC<FieldArrayProps>;
export const Form: React.FC<FormProps>;

// Optimized Components
export const OptimizedFinalFormField: React.FC<FieldProps>;
export const VirtualizedTable: React.FC<{
  fields: any[];
  height: number;
  itemHeight: number;
  overscanCount?: number;
}>;
export const OptimizedTableRow: React.FC<{
  field: any;
  index: number;
}>;

// WeakMap Utilities
export function useWeakMapOptimizations(componentName: string, additionalProps?: any): {
  componentRef: any;
  createRef: (name: string, props?: any) => any;
  isRefValid: (ref: any) => boolean;
};

export function createComponentRef(componentName: string, additionalProps?: any): any;

// Store Classes
export class ComponentMetadataStore {
  set(component: any, metadata: any): void;
  get(component: any): any;
  has(component: any): boolean;
  delete(component: any): boolean;
  getStats(): any;
}

export class FieldValueCache {
  set(component: any, key: string, value: any, ttl?: number): void;
  get(component: any, key: string, maxAge?: number): any;
  has(component: any, key: string, maxAge?: number): boolean;
  delete(component: any, key: string): boolean;
  clearComponent(component: any): boolean;
  getKeys(component: any): string[];
  getStats(): any;
}

export class EventListenerStore {
  addListener(component: any, event: string, handler: Function, target?: any): () => void;
  removeListener(component: any, listenerId: string): boolean;
  removeAllListeners(component: any): number;
  getListeners(component: any): any[];
  hasListeners(component: any): boolean;
  getStats(): any;
}
