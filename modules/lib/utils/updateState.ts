// utils/updateState.ts
import { Dispatch, SetStateAction } from 'react';

export const updateState = <T>(
  setState: Dispatch<SetStateAction<T>>,
  key: keyof T,
  value: any
) => {
  setState((prevState) => ({
    ...prevState,
    [key]: value,
  }));
};