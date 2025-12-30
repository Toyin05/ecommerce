import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Eye, EyeOff, Gift, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, loading: authLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the intended destination from location state
  const from = (location.state as { from?: string })?.from || '/';

  // Password validation requirements
  const passwordRequirements = [
    { label: 'At least 8 characters', check: (p: string) => p.length >= 8 },
    { label: 'At least 1 uppercase letter', check: (p: string) => /[A-Z]/.test(p) },
    { label: 'At least 1 number', check: (p: string) => /\d/.test(p) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.check(password));
  const doPasswordsMatch = password && password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Please ensure your password meets all requirements');
      return;
    }

    if (!doPasswordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    // Show success message
    toast.success('Account created successfully! Welcome to Gifted & Co.');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary via-secondary/90 to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Gift className="h-9 w-9" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Gifted & Co.</h1>
              <p className="text-white/80 text-sm">Gift easy. Gift smart.</p>
            </div>
          </div>
          <div className="text-center max-w-md">
            <p className="text-lg text-white/90 leading-relaxed">
              "A gift is universal; it speaks to every heart. Find the perfect gift for your loved ones today."
            </p>
            <Separator className="my-6 bg-white/30" />
            <p className="text-sm text-white/70">
              Create an account to save your cart, track orders, and enjoy exclusive offers on personalized gifts.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-secondary/10 to-white">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Gift className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Gifted & Co.</h1>
              <p className="text-xs text-muted-foreground">Gift easy. Gift smart.</p>
            </div>
          </div>

          {/* Glassmorphism Card */}
          <div className="relative">
            {/* Glass effect background */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/50" />
            
            <div className="relative z-10 p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Create your account</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Join Gifted & Co. and start gifting today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="fullName" className="text-sm">Full Name (optional)</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-xl bg-white/80 h-10"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl bg-white/80 h-10"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl bg-white/80 pr-10 h-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="space-y-1 pt-1 sm:pt-2">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-1 sm:gap-2 text-xs transition-colors ${
                          password && req.check(password)
                            ? 'text-green-600'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {password && req.check(password) ? (
                          <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                        ) : (
                          <Circle className="h-3 w-3 flex-shrink-0" />
                        )}
                        <span className="text-xs">{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`rounded-xl bg-white/80 pr-10 h-10 ${
                        confirmPassword && !doPasswordsMatch ? 'border-red-500' : ''
                      }`}
                    />
                    {confirmPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                  {confirmPassword && !doPasswordsMatch && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 mt-2 text-sm sm:text-base"
                  disabled={isSubmitting || authLoading || (confirmPassword && !doPasswordsMatch)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  state={{ from }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Continue Shopping Link */}
          <div className="mt-4 sm:mt-6 text-center">
            <Link
              to="/"
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Continue shopping as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
