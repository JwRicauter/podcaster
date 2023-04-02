
import { Routes, Route } from 'react-router-dom';


import { Home } from './pages/Home';
import { Layout } from './Layout';
import { PodcastDetail } from './pages/PodcastDetail';
import { EpisodeDetail } from './pages/EpisodeDetail';

import './App.scss';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/podcast/:id" element={<PodcastDetail />} />
        <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodeDetail />} /> 
      </Route>
    </Routes>
  );
}

export default App;