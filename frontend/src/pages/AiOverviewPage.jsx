import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, Brain, Lightbulb, TrendingUp, AlertTriangle, Loader2, RefreshCw, Clock, Info } from "lucide-react";

const AiOverviewPage = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [nextRefreshTime, setNextRefreshTime] = useState(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Exponential backoff times in milliseconds
  const BACKOFF_TIMES = [
    2 * 60 * 1000,    // 2 minutes
    4 * 60 * 1000,    // 4 minutes
    10 * 60 * 1000,   // 10 minutes
    40 * 60 * 1000,   // 40 minutes
    24 * 60 * 60 * 1000 // 24 hours
  ];

  const formatTimeRemaining = (timestamp) => {
    if (!timestamp) return null;
    
    const now = Date.now();
    const timeLeft = timestamp - now;
    
    if (timeLeft <= 0) return "Ready to refresh";
    
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const formatLastRefresh = (timestamp) => {
    if (!timestamp) return "Never";
    
    const now = Date.now();
    const timeDiff = now - timestamp;
    
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    return "Just now";
  };

  const canRefresh = () => {
    if (!nextRefreshTime) return true;
    return Date.now() >= nextRefreshTime;
  };

  const getNextRefreshTime = () => {
    const attemptIndex = Math.min(refreshAttempts, BACKOFF_TIMES.length - 1);
    return Date.now() + BACKOFF_TIMES[attemptIndex];
  };

  const fetchAiOverview = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const res = await api.get("/diary/migranes/ai-overview");
      setInsights(res.data);
      setError(null);
      setLastRefresh(Date.now());
      setRefreshAttempts(0);
      setNextRefreshTime(null);
      
      if (isRefresh) {
        toast.success("AI insights refreshed successfully!");
      }
    } catch (error) {
      console.error("Error fetching AI overview:", error);
      
      if (error.response?.status === 429) {
        const newAttempts = refreshAttempts + 1;
        setRefreshAttempts(newAttempts);
        const nextTime = getNextRefreshTime();
        setNextRefreshTime(nextTime);
        
        setError(`Too many requests. Next refresh available in ${formatTimeRemaining(nextTime)}.`);
        toast.error("Rate limit exceeded. Please wait before trying again.");
      } else if (error.response?.status === 400) {
        setError("Not enough data for analysis. Please add more migraine entries.");
        toast.error("Not enough data for AI analysis");
      } else {
        setError("Failed to generate AI overview. Please try again.");
        toast.error("Failed to load AI insights");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (!canRefresh()) {
      toast.error(`Please wait ${formatTimeRemaining(nextRefreshTime)} before refreshing again.`);
      return;
    }
    fetchAiOverview(true);
  };

  useEffect(() => {
    fetchAiOverview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Analyzing Your Migraine Data</h2>
            <p className="text-base-content/70">Our AI is reviewing your entries to provide personalized insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4 mt-6">
          <div className="mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-base-content/70 hover:text-base-content mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Entries
            </button>
            <h1 className="text-3xl font-bold">AI Migraine Insights</h1>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-12">
              <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Unable to Generate Insights</h2>
              <p className="text-base-content/70 mb-6">{error}</p>
              
              {nextRefreshTime && (
                <div className="alert alert-info mb-6">
                  <Clock className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold">Next Refresh Available</h3>
                    <p className="text-sm">{formatTimeRemaining(nextRefreshTime)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate("/create")}
                  className="btn btn-primary"
                >
                  Add More Entries
                </button>
                {canRefresh() && (
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="btn btn-outline"
                  >
                    {isRefreshing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4 mt-6">
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-base-content/70 hover:text-base-content mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Entries
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">AI Migraine Insights</h1>
              </div>
              <p className="text-base-content/70">Personalized analysis based on your migraine diary</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleRefresh}
                disabled={!canRefresh() || isRefreshing}
                className={`btn ${canRefresh() ? 'btn-primary' : 'btn-disabled'} btn-sm`}
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </>
                )}
              </button>
              
              {!canRefresh() && nextRefreshTime && (
                <div className="text-xs text-base-content/60 text-right">
                  Next refresh: {formatTimeRemaining(nextRefreshTime)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cache Information */}
        <div className="card bg-info/10 border-info/20 mb-6">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-info" />
              <div className="flex-1">
                <h3 className="font-semibold text-base-content">AI Analysis Cache</h3>
                <p className="text-sm text-base-content/70">
                  Last updated: {formatLastRefresh(lastRefresh)} • 
                  {refreshAttempts > 0 && ` Refresh attempts: ${refreshAttempts}`}
                </p>
              </div>
              {nextRefreshTime && !canRefresh() && (
                <div className="badge badge-warning">
                  Wait {formatTimeRemaining(nextRefreshTime)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Summary</h2>
              </div>
              <p className="text-base-content/80 leading-relaxed">
                {insights.summary}
              </p>
            </div>
          </div>

          {/* Top Triggers Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-warning" />
                <h2 className="text-xl font-semibold">Top Triggers</h2>
              </div>
              {insights.topTriggers && insights.topTriggers.length > 0 ? (
                <div className="space-y-3">
                  {insights.topTriggers.map((trigger, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg">
                      <span className="badge badge-warning badge-sm mt-1">{index + 1}</span>
                      <p className="text-base-content/80">{trigger}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/70">No specific triggers identified yet.</p>
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-success" />
                <h2 className="text-xl font-semibold">Recommendations</h2>
              </div>
              {insights.recommendations && insights.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {insights.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                      <span className="badge badge-success badge-sm mt-1">{index + 1}</span>
                      <p className="text-base-content/80">{recommendation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base-content/70">No specific recommendations available yet.</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <button
              onClick={() => navigate("/create")}
              className="btn btn-primary"
            >
              Add New Entry
            </button>
            {canRefresh() && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn btn-outline"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Refresh Analysis
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiOverviewPage; 