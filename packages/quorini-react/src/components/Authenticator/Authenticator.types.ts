export interface AuthenticatorProps {
    onLoginSuccess?: (data: any) => void;
    onLoginFailure?: (error: any) => void;
    onSignupSuccess?: (data: any) => void;
    onSignupFailure?: (error: any) => void;
    onVerificationSuccess?: (data: any) => void;
    onVerificationFailure?: (error: any) => void;
    loginLabel?: string;
    signupLabel?: string;
    verifyLabel?: string;
  }