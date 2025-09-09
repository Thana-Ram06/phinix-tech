import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Shield, Star, MapPin, Clock, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Make Your Voice Heard
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Report local issues, hold officials accountable, and build better communities together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/submit"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Report an Issue</span>
              </Link>
              <Link
                to="/complaints"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>View Public Issues</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How CivicPulse Works
            </h2>
            <p className="text-xl text-gray-600">
              A simple 3-step process to make your community better
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Report Issues</h3>
              <p className="text-gray-600">
                Upload a photo of local problems like potholes, garbage, or broken streetlights. 
                Our app automatically detects your location.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Track Progress</h3>
              <p className="text-gray-600">
                Officials receive your complaint and work to fix it. You can track the status 
                and see how long it takes to resolve.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Rate Performance</h3>
              <p className="text-gray-600">
                If issues aren't fixed in time, they become public and you can rate how well 
                officials handled your complaint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1,247</div>
              <div className="text-gray-600">Issues Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-600 mb-2">89%</div>
              <div className="text-gray-600">Resolution Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">2.3</div>
              <div className="text-gray-600">Days Average</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">156</div>
              <div className="text-gray-600">Active Officials</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of citizens who are already making their communities better
          </p>
          <Link
            to="/submit"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <MapPin className="w-5 h-5" />
            <span>Start Reporting Issues</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CivicPulse</span>
              </div>
              <p className="text-gray-400">
                Making local officials accountable and giving citizens a voice.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Citizens</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/submit" className="hover:text-white">Report Issues</Link></li>
                <li><Link to="/complaints" className="hover:text-white">View Public Issues</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Officials</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/admin/login" className="hover:text-white">Admin Login</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: support@civicpulse.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CivicPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
