import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const Field = ({
  dataKey,
  type,
  onChange,
  index,
  id,
  value,
  isReadOnly = false,
  preText = '',
}) => {
  if (isReadOnly) {
    return (
      <Typography variant="subtitle2">
        {preText}
        {value}
      </Typography>
    );
  }
  return (
    <Typography
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
      }}
    >
      {preText}
      <TextField
        onChange={(event) => onChange(event, dataKey, index)}
        id={id}
        size="small"
        type={type}
        align="center"
        autoComplete={false}
        {...(value >= 0 || type !== 'number'
          ? { value: value }
          : { value: undefined })}
        sx={{
          maxWidth: '100px',
          '& input': { padding: '3px 10px' },
        }}
      ></TextField>
    </Typography>
  );
};

export default Field;
