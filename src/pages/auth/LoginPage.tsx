import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Eye, EyeOff, Gift, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the intended destination from location state
  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
    } else {
      toast.success('Welcome back! Redirecting...');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white blur-3xl" />
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
              "The best gifts aren't things. They're experiences, moments, and the people you share them with."
            </p>
            <Separator className="my-6 bg-white/30" />
            <p className="text-sm text-white/70">
              Sign in to access your cart, track orders, and enjoy a personalized shopping experience.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-accent/30 to-white">
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
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Welcome back</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sign in to your account to continue shopping
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-xs sm:text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm sm:text-base"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-4 sm:mt-6">
                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 px-2 sm:px-3 text-xs text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>

              <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/auth/signup"
                  state={{ from }}
                  className="text-primary font-medium hover:underline"
                >
                  Create account
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
