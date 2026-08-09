import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import GradientBlob from '@components/common/GradientBlob';
import logoMark from '@assets/logos/logo-mark.png';
import { useAuthContext } from '@context/AuthContext';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    document.title = 'Admin Login — Abacus Digital Agency';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      const message = err.message || 'Invalid email or password';
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <GradientBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={600} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel relative w-full max-w-sm rounded-2xl p-8"
      >
        <Link to="/" className="mb-8 flex items-center gap-2 font-display text-lg font-semibold">
          <img src={logoMark} alt="Abacus" className="h-9 w-9 rounded-full" />
          Abacus
        </Link>

        <h1 className="mb-1 font-display text-xl font-semibold">Welcome back</h1>
        <p className="mb-8 text-sm text-text-secondary">Sign in to access the admin dashboard.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                {...register('email')}
                type="email"
                placeholder="admin@abacusdigital.agency"
                className="w-full rounded-lg border border-border bg-bg-surface/50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-accent"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-bg-surface/50 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent"
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>}
          </div>

          {serverError && <p className="text-sm text-danger">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
            {!isSubmitting && <FiArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
