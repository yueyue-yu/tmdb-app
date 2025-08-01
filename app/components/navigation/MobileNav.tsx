'use client';

import {
    Bars3Icon
} from '@heroicons/react/24/outline';
import SidebarContent from "@/app/components/navigation/SidebarContent";


interface MobileNavProps {
    className?: string;
}

export default function MobileNav({ className = '' }: MobileNavProps) {


    return (
        <>
            <div className={`drawer ${className}`} >
                <input id="my-drawer" type="checkbox" className="drawer-toggle"/>
                <div className="drawer-content">
                    <label htmlFor="my-drawer">
                            <Bars3Icon className="h-6 w-6" />
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <SidebarContent/>
                </div>
            </div>
        </>
    );
}