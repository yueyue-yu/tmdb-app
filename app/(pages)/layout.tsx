import React from 'react';
import CommonLayout from "@/app/components/layout/CommonLayout";

export default function PagesLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (

        <CommonLayout>{children}</CommonLayout>

    );
}