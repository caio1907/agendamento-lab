import { Backdrop } from '@mui/material';
import { CircularProgress } from "@mui/material";
import { useSelector } from 'react-redux';
import { getLoader } from '../../store/Loader.store';

const Loader: React.FC = () => {
  const loading = useSelector(getLoader).show;
  return (
    <Backdrop
      open={loading}
      sx={{
        color: '#FFF',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  )
}
export default Loader;
