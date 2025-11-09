import { useState, useCallback, useRef } from 'react';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Store refs to avoid recreating callbacks
  const valuesRef = useRef(values);
  valuesRef.current = values;
  
  const validationRulesRef = useRef(validationRules);
  validationRulesRef.current = validationRules;

  // Handle input change - STABLE, no dependencies
  const handleChange = useCallback((nameOrEvent, value) => {
    let name, newValue;
    
    if (typeof nameOrEvent === 'object' && nameOrEvent?.target) {
      name = nameOrEvent.target.name;
      newValue = nameOrEvent.target.value;
    } else {
      name = nameOrEvent;
      newValue = value;
    }
    
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => {
      if (prev[name]) {
        const { [name]: _removed, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  // Handle input blur - STABLE, no dependencies
  const handleBlur = useCallback((nameOrEvent) => {
    let name;
    
    if (typeof nameOrEvent === 'object' && nameOrEvent?.target) {
      name = nameOrEvent.target.name;
    } else {
      name = nameOrEvent;
    }
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    const rules = validationRulesRef.current;
    const currentValues = valuesRef.current;
    
    if (rules[name]) {
      const error = rules[name](currentValues[name], currentValues);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    }
  }, []);

  // Validate all fields - STABLE, no dependencies
  const validate = useCallback(() => {
    const rules = validationRulesRef.current;
    const currentValues = valuesRef.current;
    const newErrors = {};
    
    Object.keys(rules).forEach((fieldName) => {
      const error = rules[fieldName](currentValues[fieldName], currentValues);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  // Handle form submit - STABLE, no dependencies
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      
      const currentValues = valuesRef.current;
      
      // Mark all fields as touched
      const allTouched = Object.keys(currentValues).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Validate
      const isValid = validate();
      if (!isValid) {
        return;
      }

      // Submit
      setIsSubmitting(true);
      try {
        await onSubmit(currentValues);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [validate]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set form values
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
  }, []);

  // Set field value
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Set field error
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  // Get field props - DO NOT use this in render, will cause infinite loop
  const getFieldProps = useCallback((name) => {
    return {
      name,
      value: values[name] ?? '',
      onChange: handleChange,
      onBlur: handleBlur,
    };
  }, [values, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFormValues,
    setFieldValue,
    setFieldError,
    getFieldProps,
    validate,
  };
};

export default useForm;
