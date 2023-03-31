
import { Routes, Route } from 'react-router-dom';


import { Home } from './pages/Home';
import { Layout } from './Layout';
import { PodcastDetail } from './pages/PodcastDetail';

import './App.scss';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/podcast/:id" element={<PodcastDetail />} />
      </Route>
    </Routes>
  );
}

export default App;