import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Star, MapPin, Briefcase, Clock, User } from "lucide-react";

export default function LawyerList() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minRating, setMinRating] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Practice areas for dropdown
  const practiceAreas = [
    "Property Law", "Contract Law", "Family Law",
    "Criminal Law", "Corporate Law"
  ];

  // Locations for dropdown
  const locations = [
    "Addis Ababa", "Dire Dawa", "Bahir Dar", "Hawassa", "Adama", "Asosa",
    "Gambela", "Jigjiga", "Mekele", "Semera", "Dessie", "Bonga",
    "Wolaita Sodo", "Hossana"
  ];

  useEffect(() => {
    // Set initial search/filter values from URL parameters
    const urlQuery = queryParams.get("q") || "";
    const urlCategory = queryParams.get("category") || "";
    const urlLocation = queryParams.get("location") || "";
    const urlMinRating = queryParams.get("minRating") || "";
    const urlAvailable = queryParams.get("available") === "true";

    setSearchQuery(urlQuery);
    setSelectedCategory(urlCategory);
    setSelectedLocation(urlLocation);
    setMinRating(urlMinRating);
    setAvailableOnly(urlAvailable);

    fetchLawyers({
      search: urlQuery,
      specialization: urlCategory,
      location: urlLocation,
      minRating: urlMinRating,
      available: urlAvailable,
    });
    // eslint-disable-next-line
  }, [location.search]);

  const fetchLawyers = async ({
    search,
    specialization,
    location,
    minRating,
    available,
  }) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      // Build API URL with all filter/search parameters
      let url = "http://localhost:5000/api/lawyers";
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (specialization) params.append("specialization", specialization);
      if (location) params.append("location", location);
      if (minRating) params.append("minRating", minRating);
      if (available) params.append("available", "true");

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch lawyers.");
      }

      const data = await response.json();
      setLawyers(data.lawyers || []);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("log in")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Update URL with all filter/search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedLocation) params.append("location", selectedLocation);
    if (minRating) params.append("minRating", minRating);
    if (availableOnly) params.append("available", "true");

    navigate(`${window.location.pathname}?${params.toString()}`);
    // fetchLawyers will be called by useEffect due to location.search change
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Find a Lawyer</h1>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Discover experienced lawyers to assist with your legal needs
        </p>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/50"
          />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-4">
            <select
              name="specialization"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded border"
              aria-label="Filter by specialization"
            >
              <option value="">All Specializations</option>
              {practiceAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <select
              name="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 rounded border"
              aria-label="Filter by location"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              name="minRating"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full p-2 rounded border"
              aria-label="Filter by rating"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="available"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="h-4 w-4 text-primary rounded"
              />
              <label htmlFor="available" className="ml-2 text-sm">
                Available Only
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center mt-8 p-6 bg-red-50 rounded-lg max-w-xl mx-auto">
          <p className="text-red-600 mb-2">{error}</p>
        </div>
      ) : lawyers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 p-4 transition-all"
            >
              <div className="flex items-start mb-3">
                <img
                  src={
                    lawyer.profile_photo
                      ? `http://localhost:5000/Uploads/profiles/${lawyer.profile_photo}`
                      : "/assets/default-avatar.png"
                  }
                  alt={lawyer.username}
                  className="h-14 w-14 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-semibold">{lawyer.username || "Unknown"}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < (lawyer.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({lawyer.ratingCount || 0})
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Briefcase size={14} className="mr-2 text-primary" />
                  <span>{lawyer.specialization?.join(", ") || "Not specified"}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2 text-primary" />
                  <span>{lawyer.location || "Not specified"}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-2 text-primary" />
                  <span className={lawyer.isAvailable ? "text-green-600" : "text-red-500"}>
                    {lawyer.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
              <a
                href={`/client/lawyer/${lawyer._id}`}
                className="block w-full text-center py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
              >
                View Profile
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No lawyers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}