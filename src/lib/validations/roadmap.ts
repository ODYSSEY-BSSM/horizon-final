import { z } from 'zod';

// Category step validation
export const categoryStepSchema = z.object({
  category: z.string().min(1, '카테고리를 선택해주세요'),
});

// Folder step validation
export const folderStepSchema = z
  .object({
    folderId: z.string().optional(),
    folderName: z.string().optional(),
  })
  .refine((data) => data.folderId || data.folderName, {
    message: '폴더를 선택하거나 새 폴더 이름을 입력해주세요',
    path: ['folderId'],
  });

// Team step validation
export const teamStepSchema = z.object({
  teamId: z.string().min(1, '팀을 선택해주세요'),
});

// Info step validation
export const infoStepSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(50, '이름은 50자 이내로 입력해주세요').trim(),
  description: z
    .string()
    .min(1, '설명을 입력해주세요')
    .max(200, '설명은 200자 이내로 입력해주세요')
    .trim(),
});

// Style step validation
export const styleStepSchema = z.object({
  color: z.string().min(1, '색상을 선택해주세요'),
  icon: z.string().min(1, '아이콘을 선택해주세요'),
});

// Complete roadmap form validation
export const roadmapFormSchema = z.object({
  category: z.string().optional(),
  folderId: z.string().optional(),
  folderName: z.string().trim().min(1).optional(),
  teamId: z.string().optional(),
  name: z.string().trim().min(1, '이름을 입력해주세요').max(50, '이름은 50자 이내로 입력해주세요'),
  description: z
    .string()
    .trim()
    .min(1, '설명을 입력해주세요')
    .max(200, '설명은 200자 이내로 입력해주세요'),
  color: z.string(),
  icon: z.string(),
});

// Type exports for form data
export type CategoryStepFormData = z.infer<typeof categoryStepSchema>;
export type FolderStepFormData = z.infer<typeof folderStepSchema>;
export type TeamStepFormData = z.infer<typeof teamStepSchema>;
export type InfoStepFormData = z.infer<typeof infoStepSchema>;
export type StyleStepFormData = z.infer<typeof styleStepSchema>;
export type RoadmapFormData = z.infer<typeof roadmapFormSchema>;
