"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Plane, ConciergeBell, MonitorPlay, Map } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SubMenuFlyoutProps {
  activeFlyout: string | null;
  onClose: () => void;
  className?: string;
}

export const SubMenuFlyout: React.FC<SubMenuFlyoutProps> = ({ activeFlyout, onClose, className }) => {
  const isOpen = !!activeFlyout;
  const flyoutRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const subItemClass = "flex items-center space-x-3 text-gray-700 hover:text-[#006079] hover:font-medium transition-all cursor-pointer py-1";

  return (
    <div
      ref={flyoutRef}
      className={cn(
        "bg-[#dce9ee] p-6 transition-all duration-300 ease-in-out text-[#1a1a1a]",
        isOpen ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-4",
        className
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        aria-label="Đóng menu"
      >
        <X size={24} />
      </button>

      <div className="mt-8 flex flex-col gap-6">
        {activeFlyout === 'explore' && (
          <div className="mt-2 animate-in fade-in slide-in-from-left-2">
            <div className="group">
              <h3 className="mb-2 flex items-center p-2 text-sm font-semibold tracking-wide text-gray-800 transition-colors rounded-lg group-hover:bg-[#a8c7ce]">
                <Plane size={20} className="mr-3 text-gray-700" />
                Lịch bay & Mạng đường bay
              </h3>
              <div className="h-px bg-gray-300 w-full mb-3"></div>
            </div>
            <ul className="space-y-3.5 text-sm pl-2">
              <li><Link href="/route-map" onClick={onClose} className={subItemClass}>Mạng đường bay</Link></li>
            </ul>
          </div>
        )}

        {activeFlyout === 'service' && (
          <div className="mt-2 animate-in fade-in slide-in-from-left-2">
            <div className="group">
              <h3 className="mb-2 flex items-center p-2 text-sm font-semibold tracking-wide text-gray-800 transition-colors rounded-lg group-hover:bg-[#a8c7ce]">
                <ConciergeBell size={20} className="mr-3 text-gray-700" />
                Dịch vụ bổ trợ
              </h3>
              <div className="h-px bg-gray-300 w-full mb-3"></div>
            </div>
            <ul className="space-y-3.5 text-sm pl-2">
              <li><Link href="/services/baggage" onClick={onClose} className={subItemClass}>Mua thêm hành lý ký gửi</Link></li>
              <li><Link href="/services/seat" onClick={onClose} className={subItemClass}>Chọn trước chỗ ngồi</Link></li>
            </ul>
          </div>
        )}

        {activeFlyout === 'journey' && (
          <div className="mt-2 animate-in fade-in slide-in-from-left-2">
            <div className="group">
              <h3 className="mb-2 flex items-center p-2 text-sm font-semibold tracking-wide text-gray-800 transition-colors rounded-lg group-hover:bg-[#a8c7ce]">
                <Map size={20} className="mr-3 text-gray-700" />
                Hành trình
              </h3>
              <div className="h-px bg-gray-300 w-full mb-3"></div>
            </div>
            <ul className="space-y-3.5 text-sm pl-2">
              <li><Link href="/manage" onClick={onClose} className={subItemClass}>Tra cứu thông tin vé</Link></li>
            </ul>
          </div>
        )}

        {activeFlyout === 'experience' && (
          <div className="mt-2 animate-in fade-in slide-in-from-left-2">
            <div className="group">
              <h3 className="mb-2 flex items-center p-2 text-sm font-semibold tracking-wide text-gray-800 transition-colors rounded-lg group-hover:bg-[#a8c7ce]">
                <MonitorPlay size={20} className="mr-3 text-gray-700" />
                Trải nghiệm bay
              </h3>
              <div className="h-px bg-gray-300 w-full mb-3"></div>
            </div>
            <ul className="space-y-3.5 text-sm pl-2">
              <li><Link href="/experience/business" onClick={onClose} className={subItemClass}>Hạng Thương gia</Link></li>
              <li><Link href="/experience/premium-economy" onClick={onClose} className={subItemClass}>Hạng Phổ thông đặc biệt</Link></li>
              <li><Link href="/experience/economy" onClick={onClose} className={subItemClass}>Hạng Phổ thông</Link></li>
              <li><Link href="/experience/entertainment" onClick={onClose} className={subItemClass}>Giải trí trên chuyến bay</Link></li>
              <li><Link href="/experience/internet" onClick={onClose} className={subItemClass}>Kết nối internet trên chuyến bay</Link></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
