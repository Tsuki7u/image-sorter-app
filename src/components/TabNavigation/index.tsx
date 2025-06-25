'use client';

import Link from 'next/link';
// import { usePathname } from 'next/navigation';

interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  count?: number;
}

interface TabNavigationProps {
  tabs: TabItem[];
}

export default function TabNavigation({ tabs }: TabNavigationProps) {
  // const pathname = usePathname();

  return (
    <nav className="w-full bg-[#18181c] border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-2xl font-bold text-white">图片工具箱</div>
        <div className="flex space-x-6">
          {tabs.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className="text-gray-200 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-[#23232a]"
            >
              {nav.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}