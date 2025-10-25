export const useSignUpValidation = () => {
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return '이메일을 입력해주세요';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return '올바른 이메일 형식이 아닙니다';
    }
    return '';
  };

  const validateVerificationCode = (code: string) => {
    if (!code.trim()) {
      return '인증번호를 입력해주세요';
    }
    if (code.length !== 6) {
      return '인증번호 6자리를 입력해주세요';
    }
    if (!/^\d{6}$/.test(code)) {
      return '숫자 6자리를 입력해주세요';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      return '비밀번호를 입력해주세요';
    }
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다';
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return '영문과 숫자를 포함해야 합니다';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword.trim()) {
      return '비밀번호 확인을 입력해주세요';
    }
    if (confirmPassword !== password) {
      return '비밀번호가 일치하지 않습니다';
    }
    return '';
  };

  const validateUsername = (username: string) => {
    if (!username.trim()) {
      return '이름을 입력해주세요';
    }
    if (username.length < 2) {
      return '이름은 2자 이상이어야 합니다';
    }
    if (username.length > 20) {
      return '이름은 20자 이하여야 합니다';
    }
    if (!/^[가-힣a-zA-Z\s]+$/.test(username)) {
      return '한글, 영문만 사용 가능합니다';
    }
    return '';
  };

  return {
    validateEmail,
    validateVerificationCode,
    validatePassword,
    validateConfirmPassword,
    validateUsername,
  };
};
