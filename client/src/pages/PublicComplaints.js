import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Calendar, 
  Star, 
  Clock, 
  Eye,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';

const PublicComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    issueType: '',
    search: ''
  });

  useEffect(() => {
    fetchPublicComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, filters]);

  const fetchPublicComplaints = async () => {
    try {
      const response = await axios.get('/api/complaints/public');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching public complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (filters.issueType) {
      filtered = filtered.filter(c => c.issueType === filters.issueType);
    }

    if (filters.search) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.location.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueTypeLabel = (type) => {
    const labels = {
      garbage: 'Garbage Collection',
      pothole: 'Pothole',
      streetlight: 'Broken Streetlight',
      water: 'Water Issue',
      sewage: 'Sewage Problem',
      road: 'Road Condition',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysOpen = (submittedAt, resolvedAt) => {
    const end = resolvedAt ? new Date(resolvedAt) : new Date();
    const start = new Date(submittedAt);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading public complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Public Complaints & Reviews
          </h1>
          <p className="text-xl text-gray-600">
            See how officials are handling citizen complaints
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
              <select
                value={filters.issueType}
                onChange={(e) => setFilters(prev => ({ ...prev, issueType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="garbage">Garbage Collection</option>
                <option value="pothole">Pothole</option>
                <option value="streetlight">Broken Streetlight</option>
                <option value="water">Water Issue</option>
                <option value="sewage">Sewage Problem</option>
                <option value="road">Road Condition</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search complaints..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ issueType: '', search: '' })}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {complaint.imageUrl && (
                <img
                  src={`http://localhost:5000${complaint.imageUrl}`}
                  alt={complaint.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getIssueTypeLabel(complaint.issueType)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status === 'resolved' ? 'Resolved' : 'Delayed'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {complaint.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {complaint.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{complaint.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Reported: {formatDate(complaint.submittedAt)}</span>
                  </div>
                  {complaint.resolvedAt && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Resolved: {formatDate(complaint.resolvedAt)}</span>
                    </div>
                  )}
                </div>

                {complaint.assignedOfficial && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {complaint.assignedOfficial.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {complaint.assignedOfficial.department} • {complaint.assignedOfficial.ward}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                          {complaint.assignedOfficial.performanceScore || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Resolution time: {getDaysOpen(complaint.submittedAt, complaint.resolvedAt)} days
                    </span>
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No public complaints found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicComplaints;
