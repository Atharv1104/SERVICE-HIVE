import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Sales User']),
});

type RegisterForm = z.infer<typeof registerSchema>;

interface ApiErrorResponse {
  message?: string;
}

export function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Sales User'
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setErrorMsg(null);
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        setAuth(res.data.data, res.data.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setErrorMsg(error.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            SH
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h2>
        </div>
        
        {errorMsg && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center border border-red-100 dark:bg-red-900/20 dark:border-red-800">
            {errorMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Email address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                {...register('role')}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-primary-500"
              >
                <option value="Sales User">Sales User</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Register
          </Button>
          
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
