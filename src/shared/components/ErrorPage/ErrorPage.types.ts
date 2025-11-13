export interface ErrorPageProps {
  /**
   * 표시할 아이콘 이름
   * @default 'close'
   */
  icon?: string;

  /**
   * 에러 제목
   */
  title: string;

  /**
   * 에러 설명
   */
  description: string;

  /**
   * 버튼 텍스트
   * @default '돌아가기'
   */
  buttonText?: string;

  /**
   * 버튼 클릭 핸들러
   * 기본값: router.back()
   */
  onButtonClick?: () => void;
}
