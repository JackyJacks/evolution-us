import { Box } from '@mui/material';
import PopulationGraph from './component/graph/graph';

function App() {
  return (
    <div className="App">
      <Box 
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
        <PopulationGraph />
      </Box>
    </div>
  );
}

export default App;
