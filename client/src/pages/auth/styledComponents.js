// components/common/styledComponents.js
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const breatheAnimation = keyframes`
  0% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
  50% { box-shadow: 0 8px 30px rgba(0, 113, 227, 0.15); }
  100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const floatingLabel = css`
  position: absolute;
  top: ${props => props.focused || props.value ? '-12px' : '16px'};
  left: ${props => props.focused || props.value ? '12px' : '16px'};
  background-color: ${props => props.focused || props.value ? 'white' : 'transparent'};
  padding: ${props => props.focused || props.value ? '0 5px' : '0'};
  font-size: ${props => props.focused || props.value ? '12px' : '16px'};
  color: ${props => props.focused ? '#0071e3' : props.value ? '#6e6e73' : '#9898a4'};
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 1;
`;

export const FormContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const AuthCard = styled.div`
  width: 100%;
  max-width: 680px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.6s ease-out, ${breatheAnimation} 6s infinite ease-in-out;
  border: 1px solid rgba(230, 237, 245, 0.8);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 576px) {
    padding: 30px 20px;
    max-width: 100%;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

export const Logo = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0071e3 0%, #47a3ff 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(0, 113, 227, 0.2);
  
  svg {
    width: 30px;
    height: 30px;
  }
`;

export const Title = styled.h1`
  color: #1d1d1f;
  text-align: center;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 28px;
  letter-spacing: -0.022em;
  background: linear-gradient(135deg, #1d1d1f 0%, #4a4a4a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 576px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  color: #86868b;
  text-align: center;
  margin-bottom: 35px;
  font-size: 16px;
  letter-spacing: -0.016em;
  line-height: 1.4;
  
  @media (max-width: 576px) {
    font-size: 14px;
    margin-bottom: 25px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
  position: relative;
  
  @media (max-width: 576px) {
    margin-bottom: 20px;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6e6e73;
  font-weight: 500;
  letter-spacing: -0.016em;
  transition: color 0.2s ease;
  
  ${props => props.floating && floatingLabel}
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px;
  padding-left: ${props => props.hasIcon ? '45px' : '16px'};
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;
  background-color: #fff;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1d1d1f;
  letter-spacing: -0.016em;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  
  &:focus {
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15);
  }
  
  &::placeholder {
    color: #9898a4;
    opacity: 0.8;
  }
  
  @media (max-width: 576px) {
    padding: 14px;
    padding-left: ${props => props.hasIcon ? '40px' : '14px'};
    font-size: 15px;
  }
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9898a4;
  transition: color 0.2s ease;
  
  ${Input}:focus + & {
    color: #0071e3;
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9898a4;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #0071e3;
  }
`;

export const Select = styled.select`
   width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: #333; // Make sure this contrasts with the background
  background-color: #fff;
  appearance: auto; // This ensures the dropdown arrow appears
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
  
  @media (max-width: 576px) {
    padding: 14px;
    padding-right: 40px;
    font-size: 15px;
    background-position: right 14px center;
  }
`;

export const Button = styled.button`
  background: ${props => props.secondary ? 'transparent' : 'linear-gradient(135deg, #0071e3 0%, #47a3ff 100%)'};
  color: ${props => props.secondary ? '#0071e3' : 'white'};
  border: ${props => props.secondary ? '1px solid #0071e3' : 'none'};
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease-out;
  margin-top: 10px;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.016em;
  position: relative;
  overflow: hidden;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${props => props.secondary ? 'none' : '0 10px 20px rgba(0, 113, 227, 0.2)'};
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    animation: ${shimmer} 1.5s infinite;
    display: ${props => props.disabled ? 'none' : 'block'};
    background-size: 200% 100%;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.secondary ? 'none' : '0 12px 25px rgba(0, 113, 227, 0.25)'};
    background: ${props => props.secondary ? 'rgba(0, 113, 227, 0.05)' : 'linear-gradient(135deg, #0077ed 0%, #57b0ff 100%)'};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.secondary ? 'none' : '0 8px 15px rgba(0, 113, 227, 0.15)'};
  }
  
  &:disabled {
    background: ${props => props.secondary ? 'transparent' : '#e0e0e0'};
    color: ${props => props.secondary ? '#9898a4' : '#9898a4'};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    border-color: ${props => props.secondary ? '#e0e0e0' : 'transparent'};
  }
  
  @media (max-width: 576px) {
    padding: 14px;
    font-size: 15px;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff3b30;
  font-size: 14px;
  margin: 8px 0;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  
  &:before {
    content: '!';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    background: #ff3b30;
    color: white;
    border-radius: 50%;
    margin-right: 8px;
    font-size: 11px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  @media (max-width: 576px) {
    font-size: 13px;
  }
`;

export const SuccessMessage = styled.p`
  color: #28cd41;
  font-size: 14px;
  margin: 8px 0;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before {
    content: '✓';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    background: #28cd41;
    color: white;
    border-radius: 50%;
    margin-right: 8px;
    font-size: 11px;
    flex-shrink: 0;
  }
  
  @media (max-width: 576px) {
    font-size: 13px;
  }
`;

export const LinkText = styled(Link)`
  color: #0071e3;
  text-decoration: none;
  font-size: 15px;
  text-align: center;
  display: block;
  margin-top: 26px;
  letter-spacing: -0.016em;
  transition: color 0.2s;
  font-weight: 500;
  
  &:hover {
    color: #0077ed;
    text-decoration: underline;
  }
  
  @media (max-width: 576px) {
    font-size: 14px;
    margin-top: 20px;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 25px 0;
  
  &:before, &:after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #d2d2d7, transparent);
  }
  
  span {
    padding: 0 15px;
    color: #86868b;
    font-size: 14px;
    font-weight: 500;
  }
`;

export const SocialButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const SocialButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e6e6e6;
  background-color: white;
  color: #1d1d1f;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background-color: #f5f5f7;
    transform: translateY(-2px);
  }
  
  @media (max-width: 576px) {
    padding: 10px;
  }
`;

export const LoadingSpinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  width: 18px;
  height: 18px;
  animation: ${spin} 0.8s linear infinite;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    margin-bottom: 15px;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #6e6e73;
  
  @media (max-width: 576px) {
    font-size: 13px;
  }
`;

export const Checkbox = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 1px solid #d2d2d7;
  border-radius: 5px;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  
  &:checked {
    background-color: #0071e3;
    border-color: #0071e3;
  }
  
  &:checked:after {
    content: '';
    position: absolute;
    left: 6px;
    top: 2px;
    width: 4px;
    height: 9px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
    outline: none;
  }
`;

export const ForgotPassword = styled(Link)`
  color: #0071e3;
  font-size: 14px;
  text-decoration: none;
  margin-left: auto;
  transition: color 0.2s;
  font-weight: 500;
  
  &:hover {
    color: #0077ed;
    text-decoration: underline;
  }
  
  @media (max-width: 576px) {
    font-size: 13px;
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 20px;
  }
`;