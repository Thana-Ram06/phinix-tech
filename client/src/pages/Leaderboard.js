import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Medal, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Clock,
  Award
} from 'lucide-react';
import axios from 'axios';

const Leaderboard = () => {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/reviews/leaderboard');
      setOfficials(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">
          {index + 1}
        </span>;
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 2:
        return 'bg-gradient-to-r from-amber-500 to-amber-700';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  const getPerformanceLevel = (score) => {
    if (score >= 4.5) return { level: 'Excellent', color: 'text-green-600' };
    if (score >= 4.0) return { level: 'Very Good', color: 'text-green-500' };
    if (score >= 3.5) return { level: 'Good', color: 'text-yellow-500' };
    if (score >= 3.0) return { level: 'Average', color: 'text-orange-500' };
    return { level: 'Needs Improvement', color: 'text-red-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Official Performance Leaderboard
          </h1>
          <p className="text-xl text-gray-600">
            See how local officials are performing based on citizen feedback
          </p>
        </div>

        {/* Top 3 Podium */}
        {officials.length >= 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Top Performers</h2>
            <div className="flex justify-center items-end space-x-8">
              {/* 2nd Place */}
              {officials[1] && (
                <div className="text-center">
                  <div className={`w-24 h-24 ${getRankColor(1)} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    <Medal className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{officials[1].name}</h3>
                  <p className="text-gray-600">{officials[1].ward}</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-900">{officials[1].performanceScore}</span>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {officials[0] && (
                <div className="text-center">
                  <div className={`w-32 h-32 ${getRankColor(0)} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{officials[0].name}</h3>
                  <p className="text-gray-600">{officials[0].ward}</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-bold text-gray-900">{officials[0].performanceScore}</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {officials[2] && (
                <div className="text-center">
                  <div className={`w-24 h-24 ${getRankColor(2)} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{officials[2].name}</h3>
                  <p className="text-gray-600">{officials[2].ward}</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-900">{officials[2].performanceScore}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Complete Rankings</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {officials.map((official, index) => {
              const performance = getPerformanceLevel(official.performanceScore);
              const resolutionRate = official.totalComplaints > 0 
                ? Math.round((official.resolvedComplaints / official.totalComplaints) * 100)
                : 0;

              return (
                <div key={official._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(index)}
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {official.name}
                        </h4>
                        <p className="text-gray-600">
                          {official.department} • {official.ward}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium text-gray-900">
                              {official.performanceScore || 0}
                            </span>
                            <span className={`text-sm ${performance.color}`}>
                              ({performance.level})
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4" />
                            <span>{resolutionRate}% resolved</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{official.totalComplaints} total</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {official.performanceScore || 0}
                      </div>
                      <div className="text-sm text-gray-500">Performance Score</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Performance</span>
                      <span>{official.performanceScore || 0}/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          official.performanceScore >= 4.5 ? 'bg-green-500' :
                          official.performanceScore >= 4.0 ? 'bg-green-400' :
                          official.performanceScore >= 3.5 ? 'bg-yellow-400' :
                          official.performanceScore >= 3.0 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${((official.performanceScore || 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {officials.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No performance data available yet.</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {officials.length > 0 
                    ? (officials.reduce((sum, o) => sum + (o.performanceScore || 0), 0) / officials.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Officials</p>
                <p className="text-2xl font-bold text-gray-900">{officials.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Performers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {officials.filter(o => o.performanceScore >= 4.0).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
