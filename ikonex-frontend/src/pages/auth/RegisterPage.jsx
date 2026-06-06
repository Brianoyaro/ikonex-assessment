import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import FormField from '../../components/forms/FormField';
import FormInput from '../../components/forms/FormInput';
import Alert from '../../components/common/Alert';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [localError, setLocalError] = useState('');

  React.useEffect(() => {
    logout();
  }, [logout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setLocalError('All fields are required');
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        'STUDENT'
      );
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Register
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Create your account
        </p>

        {(error || localError) && (
          <Alert
            type="error"
            message={error || localError}
            onClose={() => setLocalError('')}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="First Name" required>
            <FormInput
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Last Name" required>
            <FormInput
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Email" required>
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </FormField>

          <FormField label="Password" required>
            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </FormField>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
