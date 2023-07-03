import {Box} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useNavigate} from 'react-router-dom';

export function NavigationLeftRight() {
  const navigate = useNavigate();
  return (
    <Box my={4}>
      <ArrowBackIosIcon
        sx={{
          cursor: 'pointer',
        }}
        onClick={() => navigate(-1)}
      ></ArrowBackIosIcon>
      <ArrowForwardIosIcon
        sx={{cursor: 'pointer'}}
        onClick={() => navigate(1)}
      ></ArrowForwardIosIcon>
    </Box>
  );
}
