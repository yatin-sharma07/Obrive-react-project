'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check, Upload } from 'lucide-react';
import Image from 'next/image';
import CustomToast from '@/components/pages/resources/components/Toast';
import { apiFetch } from '@/lib/api';
import SkeletonLoading from '@/components/SkelitonLoading';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    jobTitle: '',
    phoneNumber: '',
    joinDate: '',
    biography: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/profile/${userId}`);
        const result = await response.json();

        if (response.ok && result?.success) {
          const profile = result.data;
          setFormData({
            fullName: profile.name || '',
            email: profile.email || '',
            jobTitle: profile.job_title || '',
            department: profile.department || '',
            phoneNumber: profile.phone_number || '',
            joinDate: profile.join_date ? new Date(profile.join_date).toISOString().split('T')[0] : '',
            biography: profile.biography || '',
          });
        } else {
          setToastMessage(result?.message || 'Profile not found');
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.joinDate.trim()) newErrors.joinDate = 'Join date is required';
    if (!formData.biography.trim()) newErrors.biography = 'Biography is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const response = await apiFetch(`/profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok && result?.success) {
        setToastMessage('Profile saved successfully!');
        setShowToast(true);
        setTimeout(() => {
          router.push('/dashboard/employee');
        }, 1500);
      } else {
        setToastMessage(result?.message || 'Error saving profile');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Save error:', error);
      setToastMessage('Connection error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
     <SkeletonLoading/>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
      <div className="mx-auto max-w-5xl p-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-600 mt-2">Please fill in all required fields to continue</p>
        </div>

        <div className="w-full grid grid-cols-1 gap-12 lg:grid-cols-3">
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
                Recommended min. dimension 410px or PNG max 2MB.
              </p>

              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className={`text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none ${
                    errors.fullName ? 'border-2 border-red-500' : ''
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className={`text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none ${
                    errors.email ? 'border-2 border-red-500' : ''
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl h-full bg-white p-8 shadow-sm">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Senior Strategy Lead"
                      className={`text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none ${
                        errors.jobTitle ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Product Design"
                      className={`text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none ${
                        errors.department ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+91 (555) 000-0000"
                      className={`text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none ${
                        errors.phoneNumber ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                      Join Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                      className={`text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none ${
                        errors.joinDate ? 'border-2 border-red-500' : ''
                      }`}
                    />
                    {errors.joinDate && <p className="text-red-500 text-xs mt-1">{errors.joinDate}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-3">
                    Biography & Focus <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your expertise and professional trajectory..."
                    rows={6}
                    className={`text-xs w-full rounded-lg bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 transition-colors focus:bg-slate-200 focus:outline-none resize-none ${
                      errors.biography ? 'border-2 border-red-500' : ''
                    }`}
                  />
                  {errors.biography && <p className="text-red-500 text-xs mt-1">{errors.biography}</p>}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomToast show={showToast} message={toastMessage} />
    </div>
  );
}
