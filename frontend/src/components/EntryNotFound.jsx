import { BookOpenIcon } from "lucide-react";
import { Link } from "react-router-dom";

const EntryNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-blue-100 rounded-full p-8">
        <BookOpenIcon className="w-12 h-12 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">No migraine entries yet</h3>
      <p className="text-gray-600">
        Having a migraine? Create your first entry to get started on your migraine management journey.
      </p>
      <Link 
        to="/create" 
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Your First Entry
      </Link>
    </div>
  );
};

export default EntryNotFound;