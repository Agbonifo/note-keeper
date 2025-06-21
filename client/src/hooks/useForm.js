//client/src/hooks/useForm.js
import { useState } from "react";

export default function useForm(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (validationRules && validationRules[name]) {
      const error = validationRules[name](value, values);
      setErrors(prev => ({ ...prev, [name]: error }));
      return error;
    }
    return "";
  };


const handleChange = (e) => {
  const { name, type, checked, value } = e.target;
  const val = type === "checkbox" ? checked : value;

  setValues(prev => ({ ...prev, [name]: val }));
  if (touched[name]) {
    validateField(name, val);
  }
};


const handleBlur = (e) => {
  const { name, value, type, checked } = e.target;
  const val = type === "checkbox" ? checked : value;
  
  setTouched(prev => ({ ...prev, [name]: true }));
  validateField(name, val);
};


  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    Object.keys(validationRules).forEach(name => {
      const error = validationRules[name](values[name], values);
      newErrors[name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
    return isValid;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setValues,
    setErrors
  };
}
