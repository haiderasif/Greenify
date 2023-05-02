import React from "react";

import { useFormikContext } from "formik";
import AppTextInput from "../AppTextInput.js";
import ErrorMessage from "../forms/ErrorMessage";

function AppFormField({ name, ...otherProps }) {
  const { handleBlur, handleChange, errors, touched, values } = useFormikContext();
  return (
    <>
      <AppTextInput
        value = {values[name]}
        onBlur={() => handleBlur(name)}
        onChangeText={handleChange(name)}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormField;
