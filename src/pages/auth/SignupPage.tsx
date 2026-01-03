import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
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

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation requirements
  const passwordRequirements = [
    { 
      label: 'At least 8 characters', 
      check: (p: string) => p.length >= 8,
      regex: /.{8,}/
    },
    { 
      label: 'At least 1 uppercase letter', 
      check: (p: string) => /[A-Z]/.test(p),
      regex: /[A-Z]/
    },
    { 
      label: 'At least 1 lowercase letter', 
      check: (p: string) => /[a-z]/.test(p),
      regex: /[a-z]/
    },
    { 
      label: 'At least 1 number', 
      check: (p: string) => /\d/.test(p),
      regex: /\d/
    },
    { 
      label: 'At least 1 special character', 
      check: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
      regex: /[!@#$%^&*(),.?":{}|<>]/
    }
  ];

  const isPasswordValid = passwordRequirements.every(req => req.check(formData.password));
  const completedRequirements = passwordRequirements.filter(req => req.check(formData.password)).length;

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
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!formData.password) {
      toast.error('Please enter a password');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please ensure your password meets all security requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsSubmitting(true);

    const { error } = await signUp(formData.email, formData.password, formData.fullName);

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    // Show success message
    toast.success('Account created successfully! Welcome to Product Name.');
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
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">Create Account</h1>
          <p className="text-sm text-[#FF8C42] leading-relaxed">
            Sign up to access your cart, track orders, and enjoy a personalized shopping experience.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-1">
            <Label htmlFor="fullName" className="text-sm font-medium text-[#1A1A1A]">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full h-12 border-[#E5E7EB] rounded-lg text-[#1A1A1A] px-3"
              style={{
                backgroundColor: '#F6F6F6'
              }}
            />
          </div>

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

          {/* Phone Number Field */}
          <div className="space-y-1">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-[#1A1A1A]">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="081234567890"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182] hover:text-[#1A1A1A] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#1A1A1A]">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full h-12 border-[#E5E7EB] rounded-lg text-[#1A1A1A] px-3 pr-10"
                style={{
                  backgroundColor: '#F6F6F6'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182] hover:text-[#1A1A1A] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="space-y-2 pt-2">
              <div className="text-xs text-[#717182] mb-2">
                Password strength: {completedRequirements}/5 requirements met
              </div>
              <div className="grid grid-cols-1 gap-1">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      formData.password && req.check(formData.password)
                        ? 'text-green-600'
                        : 'text-[#717182]'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      formData.password && req.check(formData.password)
                        ? 'bg-green-600'
                        : 'bg-[#D1D5DB]'
                    }`} />
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
              className="border-[#D1D5DB] data-[state=checked]:bg-[#FF8C42] data-[state=checked]:border-[#FF8C42] data-[state=checked]:text-white cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-[#717182] leading-relaxed">
              I agree to the Terms of Service and Privacy Policy
            </label>
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
              disabled={isSubmitting || !agreedToTerms}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Social Login Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-[#E5E7EB]"></div>
          <span className="px-4 text-sm text-[#6B7280]">Or</span>
          <div className="flex-1 h-px bg-[#E5E7EB]"></div>
        </div>

        {/* Social Sign Up */}
        <button
          type="button"
          className="transition-all cursor-pointer flex items-center justify-center"
          style={{
            width: '342px',
            height: '40px',
            gap: '8px',
            borderRadius: '24px',
            border: '0.5px solid #FF8C42',
            padding: '0 16px',
            backgroundColor: 'white',
            color: '#FF8C42'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white';
          }}
          onClick={() => toast.info('Google sign up coming soon!')}
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
            Sign Up with Google
          </span>
        </button>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-[#717182]">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              state={{ from }}
              className="text-[#FF8C42] font-medium underline hover:underline cursor-pointer" 
              style={{ color: '#FF8C42', textDecorationColor: '#FF8C42' }}
              onMouseEnter={(e) => e.target.style.textDecorationColor = '#FF8C42'}
              onMouseLeave={(e) => e.target.style.textDecorationColor = '#FF8C42'}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

