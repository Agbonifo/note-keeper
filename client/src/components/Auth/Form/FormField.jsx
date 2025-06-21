
// client/src/components/Auth/Form/FormField.jsx
import { TextField } from "@mui/material";

const FormField = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoFocus = false,
  required = true,
  inputProps = {},
  FormHelperTextProps = {},
  InputLabelProps = {},
}) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      size="small"
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      autoFocus={autoFocus}
      required={required}
      variant="outlined"
      slotProps={{
        input: inputProps,
        helperText: FormHelperTextProps,
        label: {
          shrink: true,
          ...InputLabelProps,
        },
      }}
    />
  );
};

export default FormField;
