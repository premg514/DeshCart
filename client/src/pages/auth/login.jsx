import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../Redux/authSlice";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import {
  FormContainer,
  AuthCard,
  LogoContainer,
  Logo,
  Title,
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
  ForgotPassword,
  PasswordToggle,
} from "./styledComponents";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    role: "user",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/login`,
        formData
      );

      setSuccess(response.data.message);
      if (response.data.message === "login successfully!") {
        const { token, user } = response.data;
        dispatch(setAuthData({ token, userID: user._id, userRole: user.role }));

        // Save to localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem(
            "authUser",
            JSON.stringify({ userID: user._id, userRole: user.role })
          );
        }

        // Redirect based on user role
        if (user.role === "admin") navigate("/admin/dashboard/");
        else if (user.role === "shopKeeper") navigate("/shopkeeper/dashboard/");
        else navigate("/user");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
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
        <Title>Welcome Back</Title>
        <Form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
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

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : "Sign In"}
          </Button>
        </Form>
        <LinkText to="/signup">Don't have an account? Sign up</LinkText>
      </AuthCard>
    </FormContainer>
  );
};

export default Login;
