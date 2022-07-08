"use strict";
// export function isEquivalent(obj1: any, obj2: any) {
//   if (obj1 === obj2) {
//     return true;
//   }
//   const typeOfObject = typeof obj1;
//   if (typeOfObject !== typeof obj2) return false;
//   if (typeOfObject === 'undefined') return true;
//   if (obj1 instanceof Array) {
//     if (obj1.length !== obj2.length) return false;
//     const length = obj1.length;
//     for (let i = 0; i < length; i++) {
//       if (!isEquivalent(obj1[i], obj2[i])) {
//         return false;
//       }
//     }
//     return true;
//   } else if (obj1 instanceof Date) {
//     return obj1.getTime() === obj2.getTime();
//   } else if (typeOfObject === 'object') {
//     const obj1Props = Object.keys(obj1);
//     const obj2Props = Object.keys(obj2);
//     if (obj1Props.length !== obj2Props.length) return false;
//     for (let i = 0; i < obj1Props.length; i++) {
//       const propName = obj1Props[i];
//       if (!isEquivalent(obj1[propName], obj2[propName])) {
//         return false;
//       }
//     }
//     return true;
//   }
//   return false;
// }
// import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
// import { Input } from 'react-native-elements';
// import { isEquivalent } from '../common/isEquivalent';
// type RefDictionary<T> = {
//   [key in keyof T]?: RefObject<any>;
// };
// export default <T extends {} = any>(initialValues: T, defaultValueGetter?: () => T) => {
//   const [values, setValues] = useState(initialValues);
//   const [canSubmit, setCanSubmit] = useState(false);
//   const [canReset, setCanReset] = useState(false);
//   const defaultValue = useRef(defaultValueGetter?.());
//   const inputRefs = useRef<RefDictionary<T>>(
//     Object.keys(initialValues).reduce((refs: RefDictionary<T>, cur) => {
//       (refs as any)[cur] = useRef(null);
//       return refs;
//     }, {}),
//   );
//   const getInputRef = <U extends ReactNode = Input>(fieldKey: keyof T) => (inputRefs.current[fieldKey] as RefObject<U>).current;
//   const focusInput = (fieldKey: keyof T) => () => {
//     getInputRef(fieldKey)?.focus();
//   };
//   useEffect(() => {
//     const formValueToCompare = defaultValue.current || initialValues;
//     setCanSubmit(!isEquivalent(values, formValueToCompare));
//     setCanReset(!isEquivalent(initialValues, formValueToCompare));
//   }, [values, initialValues]);
//   return {
//     formValue: values,
//     setFormValue: <K extends keyof T>(key: K) => (value: T[K]) => {
//       setValues({ ...values, [key]: value });
//     },
//     resetFormValue: () => {
//       setValues(initialValues);
//     },
//     inputRefs: inputRefs.current,
//     getInputRef,
//     focusInput,
//     canSubmit,
//     canReset,
//   };
// };
