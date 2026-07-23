import { TextField } from './TextField';

type DateFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
};

export function DateField(props: DateFieldProps) {
  return <TextField {...props} placeholder="YYYY-MM-DD" />;
}
