import { Alert } from '@mui/material';

const AlertMessage = ({ message }) => (
  message.text && (
    <Alert severity={message.type} sx={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', width: '80%' }}>
      {message.text}
    </Alert>
  )
);

export default AlertMessage;
