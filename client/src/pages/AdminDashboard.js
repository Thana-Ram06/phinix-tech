import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Filter,
  Search,
  Eye,
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    issueType: '',
    search: ''
  });
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    delayedComplaints: 0,
    averageResolutionTime: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchComplaints();
  }, [navigate]);

  useEffect(() => {
    filterComplaints();
  }, [complaints, filters]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComplaints(response.data.complaints);
      calculateStats(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (complaintsData) => {
    const total = complaintsData.length;
    const pending = complaintsData.filter(c => c.status === 'pending').length;
    const resolved = complaintsData.filter(c => c.status === 'resolved').length;
    const delayed = complaintsData.filter(c => c.status === 'delayed').length;
    
    const resolvedWithTime = complaintsData.filter(c => c.resolvedAt);
    const totalTime = resolvedWithTime.reduce((sum, c) => {
      const resolutionTime = (new Date(c.resolvedAt) - new Date(c.submittedAt)) / (1000 * 60 * 60);
      return sum + resolutionTime;
    }, 0);
    const avgTime = resolvedWithTime.length > 0 ? totalTime / resolvedWithTime.length : 0;

    setStats({
      totalComplaints: total,
      pendingComplaints: pending,
      resolvedComplaints: resolved,
      delayedComplaints: delayed,
      averageResolutionTime: Math.round(avgTime * 100) / 100
    });
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

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

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/complaints/${complaintId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Complaint marked as ${newStatus}`);
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'delayed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysOpen = (submittedAt) => {
    const now = new Date();
    const submitted = new Date(submittedAt);
    const diffTime = Math.abs(now - submitted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.name} • {user?.ward}
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/admin/login');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolvedComplaints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delayed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delayedComplaints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageResolutionTime}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
              <select
                value={filters.issueType}
                onChange={(e) => setFilters(prev => ({ ...prev, issueType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="garbage">Garbage</option>
                <option value="pothole">Pothole</option>
                <option value="streetlight">Streetlight</option>
                <option value="water">Water</option>
                <option value="sewage">Sewage</option>
                <option value="road">Road</option>
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
                onClick={() => setFilters({ status: '', issueType: '', search: '' })}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Complaints ({filteredComplaints.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => (
              <div key={complaint._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{complaint.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        <span className="ml-1 capitalize">{complaint.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{complaint.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{complaint.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(complaint.submittedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{getDaysOpen(complaint.submittedAt)} days open</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {complaint.imageUrl && (
                      <img
                        src={`http://localhost:5000${complaint.imageUrl}`}
                        alt="Complaint"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex flex-col space-y-2">
                      {complaint.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateComplaintStatus(complaint._id, 'in-progress')}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            Start Work
                          </button>
                          <button
                            onClick={() => updateComplaintStatus(complaint._id, 'resolved')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Mark Resolved
                          </button>
                        </>
                      )}
                      
                      {complaint.status === 'in-progress' && (
                        <button
                          onClick={() => updateComplaintStatus(complaint._id, 'resolved')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredComplaints.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No complaints found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
