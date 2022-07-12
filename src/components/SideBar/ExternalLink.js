import { Typography } from '@mui/material';
import { ExternalLinkA } from './styles';

const ExternalLink = ({ text, to }) => {
  return (
    <ExternalLinkA href={to} target="_blank" rel="noreferrer">
      <Typography
        variant="bodyS1"
        sx={{ color: (theme) => theme.palette.M500 }}
      >
        {text}
      </Typography>
    </ExternalLinkA>
  );
};

export default ExternalLink;
