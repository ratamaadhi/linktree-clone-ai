import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-2xl" role="img" aria-label="BioLink Pro Logo Icon">
        💎
      </span>
      <span className="text-xl font-semibold">BioLink Pro</span>
    </div>
  );
};
