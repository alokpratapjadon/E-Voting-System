import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Vote, Info, UserPlus, ArrowLeft, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';
import { isValidPhoneNumber } from 'libphonenumber-js';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [voterId, setVoterId] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();
  const { login, signUp, requestPhoneVerification, verifyPhone, resetPassword } = useAuthStore();

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateVoterId = (voterId: string) => {
    return voterId.length >= 5;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Signup validation
        if (!email || !password || !confirmPassword || !name || !voterId || !phone) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }

        if (!validateEmail(email)) {
          setError('Please enter a valid email address');
          setIsLoading(false);
          return;
        }

        if (!validatePassword(password)) {
          setError('Password must be at least 8 characters long');
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (!validateVoterId(voterId)) {
          setError('Voter ID must be at least 5 characters long');
          setIsLoading(false);
          return;
        }

        if (!isValidPhoneNumber(phone)) {
          setError('Please enter a valid phone number');
          setIsLoading(false);
          return;
        }

        // Attempt signup
        const success = await signUp({ email, password, name, voterId, phone });
        
        if (success) {
          navigate('/voting');
        } else {
          setError('Failed to create account. Email, phone, or voter ID might already be in use.');
        }
      } else {
        if (loginMethod === 'email') {
          if (!email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
          }

          if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
          }

          // Attempt email login
          const success = await login({ email, password });
          
          if (success) {
            navigate('/voting');
          } else {
            setError('Invalid email or password');
          }
        } else {
          if (!phone) {
            setError('Please enter your phone number');
            setIsLoading(false);
            return;
          }

          if (!isValidPhoneNumber(phone)) {
            setError('Please enter a valid phone number');
            setIsLoading(false);
            return;
          }

          if (!showVerification) {
            // Request phone verification
            const success = await requestPhoneVerification(phone);
            if (success) {
              setShowVerification(true);
            } else {
              setError('Failed to send verification code');
            }
          } else {
            // Verify phone code
            if (!verificationCode) {
              setError('Please enter the verification code');
              setIsLoading(false);
              return;
            }

            const success = await verifyPhone(phone, verificationCode);
            if (success) {
              navigate('/voting');
            } else {
              setError('Invalid verification code');
            }
          }
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!resetEmail) {
        setError('Please enter your email address');
        setIsLoading(false);
        return;
      }

      if (!validateEmail(resetEmail)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const success = await resetPassword(resetEmail);
      
      if (success) {
        setError('Password reset link sent to your email');
        setTimeout(() => {
          setShowResetForm(false);
          setError('');
        }, 3000);
      } else {
        setError('Failed to send reset email. Please check your email address.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setShowVerification(false);
    setVerificationCode('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setVoterId('');
    setPhone('');
  };

  const generateVoterId = () => {
    const randomId = 'VOTER' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setVoterId(randomId);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Vote className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">
              {showResetForm 
                ? 'Reset Password'
                : isSignUp 
                  ? 'Create Account' 
                  : 'Voter Login'}
            </h1>
            <p className="text-neutral-600 mt-2">
              {showResetForm
                ? 'Enter your email to receive a password reset link'
                : isSignUp 
                  ? 'Sign up to participate in the election'
                  : 'Login to cast your vote in the current election'}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {showResetForm 
                  ? 'Reset Password'
                  : isSignUp 
                    ? 'Sign up to vote' 
                    : 'Sign in to vote'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showResetForm ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <Input
                    id="resetEmail"
                    type="email"
                    label="Email Address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    fullWidth
                  />
                  
                  {error && (
                    <div className={`p-3 rounded-md text-sm flex items-start ${
                      error.includes('sent') 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-error-50 text-error-700'
                    }`}>
                      <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowResetForm(false)}
                      fullWidth
                    >
                      Back to Login
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      isLoading={isLoading}
                      fullWidth
                    >
                      Send Reset Link
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isSignUp && !showVerification && (
                    <div className="flex gap-2 mb-4">
                      <Button
                        type="button"
                        variant={loginMethod === 'email' ? 'primary' : 'outline'}
                        onClick={() => setLoginMethod('email')}
                        fullWidth
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        type="button"
                        variant={loginMethod === 'phone' ? 'primary' : 'outline'}
                        onClick={() => setLoginMethod('phone')}
                        fullWidth
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Phone
                      </Button>
                    </div>
                  )}

                  {isSignUp && (
                    <>
                      <Input
                        id="name"
                        type="text"
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        fullWidth
                      />
                      
                      <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        fullWidth
                      />

                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          label="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          fullWidth
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-8 text-neutral-500 hover:text-neutral-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          label="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          fullWidth
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-8 text-neutral-500 hover:text-neutral-700"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <Input
                          id="voterId"
                          type="text"
                          label="Voter ID"
                          value={voterId}
                          onChange={(e) => setVoterId(e.target.value)}
                          placeholder="Enter your voter ID"
                          fullWidth
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateVoterId}
                          className="mt-6 px-3"
                        >
                          Generate
                        </Button>
                      </div>

                      <Input
                        id="phone"
                        type="tel"
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1234567890"
                        fullWidth
                      />

                      <div className="text-xs text-neutral-500 space-y-1">
                        <p>Password requirements:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li className={password.length >= 8 ? 'text-green-600' : ''}>
                            At least 8 characters
                          </li>
                          <li className={password === confirmPassword && password ? 'text-green-600' : ''}>
                            Passwords match
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {(!isSignUp && loginMethod === 'email') && (
                    <>
                      <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voter@example.com"
                        fullWidth
                      />
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          label="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          fullWidth
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-8 text-neutral-500 hover:text-neutral-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </>
                  )}

                  {(!isSignUp && loginMethod === 'phone') && (
                    <>
                      <Input
                        id="phone"
                        type="tel"
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1234567890"
                        fullWidth
                      />
                      {showVerification && (
                        <Input
                          id="verificationCode"
                          type="text"
                          label="Verification Code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          fullWidth
                        />
                      )}
                    </>
                  )}

                  {error && (
                    <div className="p-3 bg-error-50 text-error-700 rounded-md text-sm flex items-start">
                      <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {(!isSignUp && loginMethod === 'email' && !showVerification) && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="text-sm text-primary-600 hover:text-primary-500"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isLoading}
                    fullWidth
                  >
                    {isSignUp ? (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Account
                      </>
                    ) : showVerification ? (
                      'Verify Code'
                    ) : loginMethod === 'phone' ? (
                      'Send Code'
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              )}

              {!showResetForm && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                  </button>
                </div>
              )}

              {isSignUp && (
                <div className="mt-4 text-center text-xs text-neutral-500">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to="/" className="text-sm text-neutral-600 hover:text-primary-600">
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                Back to Home
              </Link>
              <Link to="/admin/login" className="text-sm text-neutral-600 hover:text-primary-600">
                Admin Login
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;