import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './componant/scroll';
import Layout from './componant/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  );
}
