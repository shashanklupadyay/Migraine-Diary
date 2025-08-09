import { Link } from "react-router-dom";
import { PlusIcon, Activity, Brain } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-base-content">Migraine Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/ai-overview" 
              className="btn btn-secondary btn-sm"
            >
              <Brain className="w-4 h-4" />
              AI Insights
            </Link>
            <Link 
              to="/create" 
              className="btn btn-primary btn-sm"
            >
              <PlusIcon className="w-4 h-4" />
              New Entry
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;