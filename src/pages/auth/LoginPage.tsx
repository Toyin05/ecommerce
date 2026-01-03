import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Google Logo SVG Component
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M17.64 9.2045c0-.6381-.0573-1.2513-.1636-1.8387H9v3.4768h4.8445c-.2096 1.1281-.8463 2.0836-1.8057 2.7217v2.2589h2.9104c1.7079-1.5726 2.6779-3.8893 2.6779-6.6398z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.4673-.8067 5.9564-2.1733l-2.9104-2.2589c-.8067.5436-1.8371.8654-3.0458.8654-2.338 0-4.3227-1.5791-5.0349-3.7013H.9578v2.3324C2.4382 15.9832 5.4818 18 9 18z"/>
    <path fill="#4A90E2" d="M3.964 10.7067C3.7848 10.2373 3.6818 9.7211 3.6818 9.1867c0-.5344.103-1.0506.2822-1.52V4.9578H.9578C.3477 6.1732 0 7.5489 0 9c0 .5511.0661 1.0879.1899 1.6104l3.7741-1.9037z"/>
    <path fill="#FBBC05" d="M9 3.5795c1.3227 0 2.5147.4552 3.452 1.2013l2.5549-2.5549C13.4588.8886 11.3927 0 9 0 5.4818 0 2.4382 2.0168.9578 4.9578l3.7741 2.3324C5.6779 4.1586 7.322 3.5795 9 3.5795z"/>
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the intended destination from location state
  const from = (location.state as { from?: string })?.from || '/';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!formData.password) {
      toast.error('Please enter your password');
      return;
    }

    setIsSubmitting(true);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    // Show success message
    toast.success('Welcome back! Redirecting...');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-sm px-4 py-6">
        {/* Header & Navigation */}
        <div className="mb-8">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#6B7280] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Branding */}
          <div className="flex items-center gap-3">
            {/* Logo Placeholder */}
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium">Logo</span>
            </div>
            
            {/* Brand Text */}
            <div>
              <h1 className="text-lg font-semibold text-[#1A1A1A]">Product Name</h1>
              <p className="text-sm text-[#6B7280]">Tag line</p>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">Welcome Back</h1>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Sign in to access your cart, track orders, and enjoy a personalized shopping experience.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-[#1A1A1A]">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@mail.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full h-12 border-[#E5E7EB] rounded-lg text-[#1A1A1A] px-3"
              style={{
                backgroundColor: '#F6F6F6'
              }}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium text-[#1A1A1A]">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full h-12 border-[#E5E7EB] rounded-lg text-[#1A1A1A] px-3 pr-10"
                style={{
                  backgroundColor: '#F6F6F6'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Forgot Password & Remember Me */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="border-[#D1D5DB] data-[state=checked]:bg-[#FF8C42] data-[state=checked]:border-[#FF8C42] data-[state=checked]:text-white cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-[#6B7280]">
                Remember me
              </label>
            </div>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Primary Action Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="flex items-center justify-center transition-colors"
              style={{
                width: '160px',
                height: '40px',
                gap: '8px',
                borderRadius: '24px',
                backgroundColor: '#FF8C42',
                color: '#FBFBFB',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins',
                fontWeight: '500',
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
                verticalAlign: 'middle'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E67E36'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FF8C42'}
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        {/* Social Login Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-[#E5E7EB]"></div>
          <span className="px-4 text-sm text-[#6B7280]">Or continue with</span>
          <div className="flex-1 h-px bg-[#E5E7EB]"></div>
        </div>

        {/* Social Sign Up */}
        <button
          type="button"
          className="transition-all cursor-pointer flex items-center justify-center w-full"
          style={{
            height: '40px',
            borderRadius: '24px',
            border: '0.5px solid #FF8C42',
            padding: '0 16px',
            gap: '8px',
            backgroundColor: 'white',
            color: '#FF8C42'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white';
          }}
          onClick={() => toast.info('Google sign in coming soon!')}
        >
          <GoogleLogo />
          <span 
            className="font-medium"
            style={{ 
              color: '#FF8C42',
              fontFamily: 'Poppins',
              fontWeight: '500',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
              e.target.style.textDecorationColor = '#FF8C42';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            Log in with Google
          </span>
        </button>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-[#6B7280]">
            Don't have an account?{' '}
            <Link
              to="/auth/signup"
              state={{ from }}
              className="font-medium cursor-pointer" 
              style={{ color: '#FF8C42' }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
                e.target.style.textDecorationColor = '#FF8C42';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
              }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
