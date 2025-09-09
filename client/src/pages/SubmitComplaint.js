import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, MapPin, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issueType: '',
    citizenEmail: '',
    citizenPhone: '',
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 },
      ward: ''
    }
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  const issueTypes = [
    { value: 'garbage', label: 'Garbage Collection' },
    { value: 'pothole', label: 'Pothole' },
    { value: 'streetlight', label: 'Broken Streetlight' },
    { value: 'water', label: 'Water Issue' },
    { value: 'sewage', label: 'Sewage Problem' },
    { value: 'road', label: 'Road Condition' },
    { value: 'other', label: 'Other' }
  ];

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }

    toast.loading('Detecting your location...');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Using a simple geocoding service (you can replace with Google Maps API)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          setFormData(prev => ({
            ...prev,
            location: {
              address: data.locality || 'Location detected',
              coordinates: { lat: latitude, lng: longitude },
              ward: data.principalSubdivision || 'Unknown Ward'
            }
          }));
          
          setLocationDetected(true);
          toast.success('Location detected successfully!');
        } catch (error) {
          console.error('Error getting address:', error);
          setFormData(prev => ({
            ...prev,
            location: {
              address: 'Location detected',
              coordinates: { lat: latitude, lng: longitude },
              ward: 'Ward ' + Math.floor(Math.random() * 10) + 1
            }
          }));
          setLocationDetected(true);
          toast.success('Location detected (approximate address)');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to detect location. Please enter manually.');
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      toast.error('Please upload an image');
      return;
    }

    if (!formData.title || !formData.description || !formData.issueType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!locationDetected && !formData.location.address) {
      toast.error('Please detect location or enter address manually');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('image', image);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('issueType', formData.issueType);
      submitData.append('citizenEmail', formData.citizenEmail);
      submitData.append('citizenPhone', formData.citizenPhone);
      submitData.append('location', JSON.stringify(formData.location));

      const response = await axios.post('/api/complaints', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Complaint submitted successfully!');
      setFormData({
        title: '',
        description: '',
        issueType: '',
        citizenEmail: '',
        citizenPhone: '',
        location: {
          address: '',
          coordinates: { lat: 0, lng: 0 },
          ward: ''
        }
      });
      setImage(null);
      setLocationDetected(false);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Report a Local Issue
            </h1>
            <p className="text-gray-600">
              Help make your community better by reporting issues that need attention
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo *
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                {image ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-green-600 font-medium">{image.name}</p>
                    <p className="text-sm text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">
                      {isDragActive
                        ? 'Drop the image here...'
                        : 'Drag & drop an image here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the issue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Provide more details about the issue..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Issue Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type *
              </label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select issue type</option>
                {issueTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={detectLocation}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Detect My Location</span>
                </button>
                
                {locationDetected && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Location detected successfully!</span>
                  </div>
                )}

                <input
                  type="text"
                  name="address"
                  value={formData.location.address}
                  onChange={handleLocationChange}
                  placeholder="Enter address manually if needed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="citizenEmail"
                  value={formData.citizenEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="citizenPhone"
                  value={formData.citizenPhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Your complaint will be sent to the responsible official</li>
                  <li>• You'll receive updates on the status</li>
                  <li>• If not resolved in 3 days, it becomes public for review</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
