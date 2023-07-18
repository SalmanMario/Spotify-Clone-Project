import {useRequestInterceptors} from './hooks';
import {ContextsProvider} from './contexts';
import {Router} from './routes';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {theme} from './theme';
import './App.css';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
  useRequestInterceptors();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ContextsProvider>
          <CssBaseline />
          <ToastContainer theme="dark" autoClose={2500} hideProgressBar />
          <Router />
        </ContextsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
