import { useState, useEffect, useMemo } from "react";
import { DataService } from "../dataService";
import AdCard from "./AdCard";

const AdDashboard = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const standardizedAds = await DataService.getStandardizedAds();
        setAds(standardizedAds);
        setError(null);
      } catch (err) {
        setError(
          "Failed to load ad data. Please ensure the JSON server is running."
        );
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processedAds = useMemo(() => {
    let filtered = DataService.filterAdsByCampaign(ads, searchTerm);
    let sorted = DataService.sortAdsBySpend(filtered, sortDirection);
    return sorted;
  }, [ads, searchTerm, sortDirection]);

  const handleSort = (direction) => {
    setSortDirection((current) => (current === direction ? null : direction));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortDirection(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ad data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-3xl font-bold mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Blueprint Take Home Assessment
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search by Campaign Name
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Enter campaign name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by Spend
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort("asc")}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    sortDirection === "asc"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Low to High
                </button>
                <button
                  onClick={() => handleSort("desc")}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    sortDirection === "desc"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  High to Low
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {processedAds.length} of {ads.length} ads
              {searchTerm && (
                <span className="ml-2">(filtered by "{searchTerm}")</span>
              )}
              {sortDirection && (
                <span className="ml-2">
                  (sorted by spend{" "}
                  {sortDirection === "asc" ? "ascending" : "descending"})
                </span>
              )}
            </p>
          </div>
        </div>

        {processedAds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">📭</div>
            <p className="text-gray-600">
              {searchTerm
                ? "No ads found matching your search."
                : "No ads available."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-blue-600 hover:text-blue-800 underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdDashboard;
