import { SkeletonView } from '@/shared/ui';

export default function Loading() {
  return <SkeletonView cardCount={6} showContentBorder={false} />;
}
