import { z } from 'zod';

// Email step validation
export const emailSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
});

// Verification step validation
export const verificationSchema = z.object({
  verificationCode: z
    .string()
    .min(1, '인증번호를 입력해주세요')
    .length(6, '인증번호는 6자리입니다'),
});

// Password step validation
export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(/\d/, '숫자를 포함해야 합니다')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

// Username step validation
export const usernameSchema = z.object({
  username: z
    .string()
    .min(1, '사용자 이름을 입력해주세요')
    .max(16, '사용자 이름은 16자 이내로 입력해주세요')
    .regex(/^[가-힣a-zA-Z]+$/, '한글 또는 영어만 입력 가능합니다'),
});

// Type exports for form data
export type EmailFormData = z.infer<typeof emailSchema>;
export type VerificationFormData = z.infer<typeof verificationSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type UsernameFormData = z.infer<typeof usernameSchema>;
