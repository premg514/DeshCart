// components/common/styledComponents.js
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";

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
  top: ${(props) => (props.focused || props.value ? "-12px" : "16px")};
  left: ${(props) => (props.focused || props.value ? "12px" : "16px")};
  background-color: ${(props) =>
    props.focused || props.value ? "white" : "transparent"};
  padding: ${(props) => (props.focused || props.value ? "0 5px" : "0")};
  font-size: ${(props) => (props.focused || props.value ? "12px" : "16px")};
  color: ${(props) =>
    props.focused ? "#0071e3" : props.value ? "#6e6e73" : "#9898a4"};
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
  max-width: 520px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.6s ease-out,
    ${breatheAnimation} 6s infinite ease-in-out;
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
  margin-bottom: 10px;
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

  ${(props) => props.floating && floatingLabel}
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px;
  padding-left: ${(props) => (props.hasIcon ? "45px" : "16px")};
  padding-right: ${(props) => (props.type === "password" ? "45px" : "16px")};
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;
  background-color: #fff;
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
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
    padding-left: ${(props) => (props.hasIcon ? "40px" : "14px")};
    font-size: 15px;
  }
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9898a4;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
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
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    color: #0071e3;
    background-color: rgba(0, 113, 227, 0.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 113, 227, 0.3);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Select = styled.select`
  width: 100%;

  padding-right: 40px;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 16px;
  color: #1d1d1f;
  background-color: #fff;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.016em;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239898a4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;

  &:focus {
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15);
  }

  @media (max-width: 576px) {
  
    padding-right: 40px;
    font-size: 15px;
    background-position: right 14px center;
  }
`;

export const Button = styled.button`
  background: ${(props) =>
    props.secondary
      ? "transparent"
      : "linear-gradient(135deg, #0071e3 0%, #47a3ff 100%)"};
  color: ${(props) => (props.secondary ? "#0071e3" : "white")};
  border: ${(props) => (props.secondary ? "1px solid #0071e3" : "none")};
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease-out;
  margin-top: 10px;
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.016em;
  position: relative;
  overflow: hidden;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${(props) =>
    props.secondary ? "none" : "0 10px 20px rgba(0, 113, 227, 0.2)"};

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    animation: ${shimmer} 1.5s infinite;
    display: ${(props) => (props.disabled ? "none" : "block")};
    background-size: 200% 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.secondary ? "none" : "0 12px 25px rgba(0, 113, 227, 0.25)"};
    background: ${(props) =>
      props.secondary
        ? "rgba(0, 113, 227, 0.05)"
        : "linear-gradient(135deg, #0077ed 0%, #57b0ff 100%)"};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${(props) =>
      props.secondary ? "none" : "0 8px 15px rgba(0, 113, 227, 0.15)"};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.3),
      ${(props) =>
        props.secondary ? "none" : "0 10px 20px rgba(0, 113, 227, 0.2)"};
  }

  &:disabled {
    background: ${(props) => (props.secondary ? "transparent" : "#e0e0e0")};
    color: ${(props) => (props.secondary ? "#9898a4" : "#9898a4")};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    border-color: ${(props) => (props.secondary ? "#e0e0e0" : "transparent")};
  }

  @media (max-width: 576px) {
    padding: 14px;
    font-size: 15px;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff3b30;
  font-size: 14px;
  margin: 8px 0 16px;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;

  &:before {
    content: "!";
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
  margin: 8px 0 16px;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;

  &:before {
    content: "✓";
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

  &:focus {
    outline: none;
    text-decoration: underline;
    color: #0077ed;
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

  &:before,
  &:after {
    content: "";
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
  margin-bottom: 20px;

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
    border-color: #d2d2d7;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15);
  }

  &:active {
    transform: translateY(0);
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
  margin-bottom: 0;

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
    content: "";
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

  &:hover:not(:checked) {
    background-color: rgba(0, 113, 227, 0.05);
  }
`;

export const ForgotPassword = styled(Link)`
  color: #0071e3;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;

  &:hover {
    color: #0077ed;
    text-decoration: underline;
  }

  &:focus {
    outline: none;
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

export const PasswordStrengthMeter = styled.div`
  height: 4px;
  border-radius: 2px;
  margin-top: 6px;
  background: #f0f0f0;
  overflow: hidden;
`;

export const PasswordStrengthIndicator = styled.div`
  height: 100%;
  border-radius: 2px;
  width: ${(props) => props.strength}%;
  background: ${(props) => {
    if (props.strength < 25) return "#ff3b30";
    if (props.strength < 50) return "#ff9500";
    if (props.strength < 75) return "#ffcc00";
    return "#28cd41";
  }};
  transition: all 0.3s ease;
`;

export const PasswordStrengthText = styled.span`
  font-size: 12px;
  display: block;
  margin-top: 4px;
  text-align: right;
  color: ${(props) => {
    if (props.strength < 25) return "#ff3b30";
    if (props.strength < 50) return "#ff9500";
    if (props.strength < 75) return "#ffcc00";
    return "#28cd41";
  }};
`;

export const ValidationMessage = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: ${(props) => (props.valid ? "#28cd41" : "#6e6e73")};
  display: flex;
  align-items: center;
  opacity: ${(props) => (props.touched ? 1 : 0.7)};

  svg {
    margin-right: 5px;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }
`;

export const ValidationRules = styled.div`
  margin-top: 6px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 8px;
  font-size: 12px;
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1d1d1f;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #86868b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #f5f5f7;
    color: #1d1d1f;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
  background-color: ${(props) => {
    switch (props.variant) {
      case "success":
        return "rgba(40, 205, 65, 0.1)";
      case "warning":
        return "rgba(255, 149, 0, 0.1)";
      case "error":
        return "rgba(255, 59, 48, 0.1)";
      case "info":
        return "rgba(0, 113, 227, 0.1)";
      default:
        return "rgba(142, 142, 147, 0.1)";
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case "success":
        return "#28cd41";
      case "warning":
        return "#ff9500";
      case "error":
        return "#ff3b30";
      case "info":
        return "#0071e3";
      default:
        return "#8e8e93";
    }
  }};
`;

export const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background-color: #1d1d1f;
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: ${(props) => (props.visible ? "1" : "0")};
  pointer-events: ${(props) => (props.visible ? "auto" : "none")};
  transition: opacity 0.2s ease;
  z-index: 10;

  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #1d1d1f transparent transparent transparent;
  }
`;
