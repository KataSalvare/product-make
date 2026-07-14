/**
 * @name EditProfile Page
 * @description User profile editing page
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

interface FormField {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  maxLength?: number;
  required?: boolean;
  editable?: boolean;
}

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({
    displayName: 'John Doe',
    username: 'johndoe',
    bio: 'Living life one day at a time 🌟',
    phone: '+234 801 234 5678',
    email: 'john@example.com',
    location: 'Lagos, Nigeria',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fields: FormField[] = [
    { id: 'displayName', label: 'Display Name', value: formData.displayName, placeholder: 'Enter your name', maxLength: 50, required: true },
    { id: 'username', label: 'Username', value: formData.username, placeholder: '@username', maxLength: 20, required: true },
    { id: 'bio', label: 'Bio', value: formData.bio, placeholder: 'Tell us about yourself', maxLength: 150 },
    { id: 'phone', label: 'Phone', value: formData.phone, placeholder: 'Phone number', type: 'tel', required: true, editable: false },
    { id: 'email', label: 'Email', value: formData.email, placeholder: 'Email address', type: 'email', required: true, editable: false },
    { id: 'location', label: 'Location', value: formData.location, placeholder: 'Your location' },
  ];

  const validateField = (id: string, value: string): string => {
    switch (id) {
      case 'displayName':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) return 'Name can only contain letters, numbers and spaces';
        return '';
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers and underscores';
        return '';
      case 'bio':
        if (value.length > 150) return 'Bio must be less than 150 characters';
        return '';
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    setHasChanges(true);
    
    const error = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: error }));

    if (id === 'username' && value.length >= 3) {
      setUsernameAvailable(value.toLowerCase() !== 'kata');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required || formData[field.id]) {
        const error = validateField(field.id, formData[field.id]);
        if (error) newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!usernameAvailable) {
      setErrors(prev => ({ ...prev, username: 'This username is already taken' }));
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowSuccess(true);
    setHasChanges(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBack = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Discard them?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const getBioCharCount = () => formData.bio?.length || 0;

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-[var(--surface-container)] rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--on-surface)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-headline-md text-[var(--primary)]">Edit Profile</h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              hasChanges && !isLoading
                ? 'bg-[var(--secondary)] text-[var(--on-secondary)]'
                : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Avatar Section */}
      <div className="px-4 py-6 flex flex-col items-center">
        <div 
          onClick={handleAvatarClick}
          className="relative w-24 h-24 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--on-primary)] text-3xl font-bold cursor-pointer group overflow-hidden border-4 border-[var(--surface-container-lowest)] shadow-ambient-md"
        >
          JD
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <button 
          onClick={handleAvatarClick}
          className="mt-3 text-sm text-[var(--secondary)] font-medium hover:underline"
        >
          Change Photo
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      {/* Form Fields */}
      <div className="flex-1 px-4 pb-24">
        <div className="bg-[var(--surface-container-lowest)] rounded-2xl overflow-hidden shadow-ambient-sm">
          {fields.map((field, index) => (
            <div 
              key={field.id}
              className={`px-4 py-4 ${index !== fields.length - 1 ? 'border-b border-[var(--outline-variant)]/50' : ''}`}
            >
              <label className="block text-label-sm text-[var(--on-surface-variant)] mb-1.5">
                {field.label}
                {field.required && <span className="text-[var(--error)] ml-0.5">*</span>}
              </label>
              <div className="relative">
                <input
                  type={field.type || 'text'}
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  disabled={field.editable === false}
                  maxLength={field.maxLength}
                  className={`w-full bg-transparent text-body-lg text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ${
                    field.editable === false ? 'opacity-60' : ''
                  } ${errors[field.id] ? 'text-[var(--error)]' : ''}`}
                />
                {field.id === 'username' && formData.username.length >= 3 && (
                  <span className={`absolute right-0 top-1/2 -translate-y-1/2 text-xs ${
                    usernameAvailable ? 'text-green-500' : 'text-[var(--error)]'
                  }`}>
                    {usernameAvailable ? '✓ Available' : '✗ Taken'}
                  </span>
                )}
              </div>
              {field.id === 'bio' && (
                <div className="flex justify-end mt-1">
                  <span className={`text-label-sm ${getBioCharCount() > 140 ? 'text-[var(--error)]' : 'text-[var(--on-surface-variant)]'}`}>
                    {getBioCharCount()}/{field.maxLength}
                  </span>
                </div>
              )}
              {errors[field.id] && (
                <p className="text-label-sm text-[var(--error)] mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Info Text */}
        <p className="text-label-sm text-[var(--on-surface-variant)] mt-4 px-2">
          Your username must be unique. Phone and email can be updated in Security settings.
        </p>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-full shadow-ambient-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Profile updated successfully!</span>
          </div>
        </div>
      )}

      {/* Save Button (Fixed Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--outline-variant)] px-4 py-4 safe-area-pb">
        <button
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
          className={`w-full py-3.5 rounded-xl text-body-lg font-semibold transition-all ${
            hasChanges && !isLoading
              ? 'bg-[var(--secondary)] text-[var(--on-secondary)] shadow-ambient-sm'
              : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

const Component = EditProfilePage;
export default Component;
