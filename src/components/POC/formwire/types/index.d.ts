/**
 * Type declarations for fast-form package (minimal).
 */

import React from 'react';

export as namespace FastForm;

export interface FormEngine {
  getValues(): any;
  get(path: string): any;
  set(path: string, value: any, opts?: { silent?: boolean }): void;
  subscribe(pathOrStar: string, cb: (...args: any[]) => void): () => void;
  subscribeMeta(path: string, cb: (...args: any[]) => void): () => void;
  registerValidator(path: string, fn: (value: any, values: any) => any): () => void;
  push(path: string, item: any): void;
  removeAt(path: string, index: number): void;
}

export function FormProvider(props: { engine: FormEngine, children?: React.ReactNode }): JSX.Element;
export function useFormEngine(): FormEngine;

export function useField(name: string, subscription?: any): {
  input: { name: string, value: any, onChange: (v:any)=>void, onBlur: ()=>void, onFocus: ()=>void },
  meta: { error:any, touched:boolean, active:boolean },
  value:any, error:any, touched:boolean, active:boolean
};

export function useFormState(selector?: (values:any)=>any): any;

export function Field(props: { name: string, children: (args:{ input:any, meta:any })=>React.ReactNode }): JSX.Element;
export function FieldArray(props: { name: string, children: (args:any)=>React.ReactNode }): JSX.Element;
