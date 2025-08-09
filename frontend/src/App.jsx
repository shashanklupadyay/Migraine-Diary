import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import EntryDetailPage from './pages/EntryDetailPage';
import EditPage from './pages/EditPage';
import AiOverviewPage from './pages/AiOverviewPage';
import { Toaster } from 'react-hot-toast';

export const App = () => {
  return (
    <div data-theme="retro">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/entry/:id" element={<EntryDetailPage />} />
        <Route path="/entry/:id/edit" element={<EditPage />} />
        <Route path="/ai-overview" element={<AiOverviewPage />} />
      </Routes>
    </div>
  );
};

export default App;