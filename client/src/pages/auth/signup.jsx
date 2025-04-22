import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import {
  FormContainer,
  AuthCard,
  LogoContainer,
  Logo,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  InputWrapper,
  Input,
  InputIcon,
  Select,
  Button,
  ErrorMessage,
  SuccessMessage,
  LinkText,
  LoadingSpinner,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  FormRow,
  PasswordToggle
} from './styledComponents';

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!agreedToTerms) {
      setError('You must agree to the Terms and Privacy Policy');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { name, email, password, role } = formData;
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/auth/signup`, {
        name,
        email,
        password,
        role
      });

      setSuccess(response.data.message || "Account created successfully!");

      // Clear the form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
      });
      setAgreedToTerms(false);

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <AuthCard>
        <LogoContainer>
          <Logo>
            <FiUser />
          </Logo>
        </LogoContainer>
        <Title>Create Account</Title>
        <Subtitle>Join us to start shopping and tracking orders</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <InputWrapper>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                hasIcon
              />
              <InputIcon>
                <FiUser />
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                hasIcon
              />
              <InputIcon>
                <FiMail />
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                  hasIcon
                />
                <InputIcon>
                  <FiLock />
                </InputIcon>
                <PasswordToggle
                  type="button"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </PasswordToggle>
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputWrapper>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  hasIcon
                />
                <InputIcon>
                  <FiLock />
                </InputIcon>
                <PasswordToggle
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </PasswordToggle>
              </InputWrapper>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="role">Account Type</Label>
            <Select 
              id="role" 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="shopKeeper">Shop Keeper</option>
            </Select>
          </FormGroup>

          <CheckboxContainer>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
              />
              I agree to the Terms of Service and Privacy Policy
            </CheckboxLabel>
          </CheckboxContainer>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Create Account'}
          </Button>
        </Form>
        <LinkText to="/login">Already have an account? Sign in</LinkText>
      </AuthCard>
    </FormContainer>
  );
};

export default Signup;