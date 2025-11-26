'use client';

import { useQuery } from '@tanstack/react-query';
import { schoolApi } from '../api';

export const useEducation = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['education', 'subject'],
    queryFn: async () => {
      const result = await schoolApi.getEducationInfo();
      return result;
    },
  });

  // subjects 배열을 EducationResponse 형태로 매핑
  const educations = (data?.subjects || []).map((subject, index) => ({
    id: index,
    title: subject.subjectName,
    description: subject.description,
    usageCount: 0,
  }));

  return {
    educations,
    isLoading,
    isError,
    error,
  };
};

export const useEducationCount = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['education', 'count'],
    queryFn: () => schoolApi.getEducationCount(),
  });

  return {
    count: data?.count || 0,
    isLoading,
  };
};
