import TabNavigation from '@/components/TabNavigation';
import { tabs } from '@/constants/tabs';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <TabNavigation tabs={tabs} />
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
} 