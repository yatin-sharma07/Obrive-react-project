'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Check, Upload } from 'lucide-react';
import Image from 'next/image';
import CustomToast from '@/components/pages/resources/components/Toast';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string; // Get [id] from URL
  
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
        jobTitle: '',
    phoneNumber: '',
    joinDate: '',
    biography: '',
  });

  // ── Load Profile Data on Page Load ────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        console.log(`Fetching profile for: ${userId}`);
        
        const response = await fetch(
          `http://localhost:5000/api/profile/${userId}`
        );

        if (response.ok) {
          const profile = await response.json();
          console.log('Profile loaded:', profile);
          
          setFormData({
            fullName: profile.name || '',
            email: profile.email || '',
            jobTitle: profile.jobTitle || '',
            department: profile.department || '',
            phoneNumber: profile.phoneNumber || '',
            joinDate: profile.joinDate 
              ? new Date(profile.joinDate).toISOString().split('T')[0]
              : '',
            biography: profile.biography || '',
          });
        } else {
          setToastMessage('Profile not found');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        setToastMessage('Error loading profile');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  // ── Avatar Handler ────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setIsUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // ── Form Input Handler ────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ── Save Profile ────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/profile`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setToastMessage('Profile saved successfully!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setToastMessage('Error saving profile');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Save error:', error);
      setToastMessage('Connection error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-slate-900">Professional Dossier</h1>
        </div>

        <div className="w-full grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex flex-col items-center">
                <div
                  onClick={handleAvatarClick}
                  className="group relative mb-4 cursor-pointer"
                >
                  <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg
                          className="h-20 w-20 text-slate-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {isUploaded && (
                    <div className="absolute bottom-2 right-2 rounded-full bg-blue-600 p-2 shadow-lg">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div className="absolute inset-0 rounded-2xl bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/png,image/jpeg"
                  className="hidden"
                />

                <h3 className="text-center text-sm font-semibold text-slate-900">
                  Avatar Upload
                </h3>
              </div>

              <p className="mb-6 text-center text-xs text-slate-500">
                Recommended min. dimension<br/>
                410 or PNG max 2MB.
              </p>

              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                  className="text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email"
                  className="text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl h-full bg-white p-8 shadow-sm">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Senior Strategy Lead"
                      className="text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Product Design"
                      className="text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+91 (555) 000-0000"
                      className="text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                      Join Date
                    </label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                      className="text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                    Biography & Focus
                  </label>
                  <textarea
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    placeholder="Briefly describe the expertise and professional trajectory..."
                    rows={6}
                    className="text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="w-50 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
                >
                  Save Profile
                </button>
                {/* <button className="flex-1 rounded-lg border-2 border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                  Cancel
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomToast show={showToast} message={toastMessage} />
    </div>
  );
}