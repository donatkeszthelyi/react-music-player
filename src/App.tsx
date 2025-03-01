import { Box } from '@mui/material';
import Player from './components/Player/Player';
import './index.scss';

function App() {
  return (
    <Box>
      <div className="wrapper">
        <div className="gradient gradient-1"></div>
        <div className="gradient gradient-2"></div>
        <div className="gradient gradient-3"></div>
      </div>
      <Player />
    </Box>
  );
}

export default App;
