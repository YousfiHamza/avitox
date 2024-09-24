'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

const TABS = ['listings', 'transactions', 'messages', 'store'];

export default function DashboardTabs() {
  const pathname = usePathname();
  const initialTab = useMemo(() => {
    return TABS.find(tab => pathname.includes(tab)) || 'listings';
  }, [pathname]);

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const activeT = tabsRef.current[TABS.indexOf(activeTab)];
    if (activeT) {
      const { offsetLeft, offsetWidth } = activeT;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  useEffect(() => {
    const newActiveTab = TABS.find(tab => pathname.includes(tab)) || 'listings';
    setActiveTab(newActiveTab);
  }, [pathname]);

  return (
    <div className="relative mx-auto flex w-full gap-2 rounded-sm border-[2px] border-gray-400 p-1">
      <div
        className="absolute top-1 h-[calc(100%-8px)] rounded-sm bg-blue-500 transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />
      {TABS.map((tab, index) => {
        if (!tab) return null;
        return (
          <Link
            href={activeTab === tab ? '#' : `/dashboard/${tab}`}
            ref={el => {
              tabsRef.current[index] = el;
            }}
            className={`text-s z-10 flex-1 rounded-sm px-6 py-1 font-semibold transition-colors duration-300 hover:bg-blue-500/40 hover:text-white ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'text-state-disabled'
            }`}
            key={tab}
          >
            <button
              onClick={() => setActiveTab(tab)}
              className="w-full text-center capitalize"
            >
              {tab}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
