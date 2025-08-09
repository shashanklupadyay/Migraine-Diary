import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import EntryCard from "../components/EntryCard";
import EntryNotFound from "../components/EntryNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        console.log("Attempting to fetch entries...");
        const res = await api.get("/diary/migranes");
        console.log("Fetched entries:", res.data);
        setEntries(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching entries:", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          console.log("Setting empty entries due to error");
          setEntries([]);
          toast.error("Failed to load migraine entries");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleDeleteEntry = (deletedId) => {
    setEntries(prev => prev.filter(entry => entry._id !== deletedId));
  };

  console.log("HomePage rendering, loading:", loading, "entries:", entries.length);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-base-content mb-2">Migraine Diary</h1>
          <p className="text-base-content/70">Track and manage your migraine episodes</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="ml-3 text-base-content/70">Loading entries...</span>
          </div>
        )}

        {!loading && entries.length === 0 && !isRateLimited && <EntryNotFound />}

        {!loading && entries.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {entries.map((entry) => (
              <EntryCard 
                key={entry._id} 
                entry={entry} 
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;