import React from 'react';
import { useTranslation } from 'react-i18next';

const SideabarLabel = ({ label }: { label: string }) => {
    const { t } = useTranslation();

    return (
        <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
            <svg className="hidden h-5 w-4 flex-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>{t(label)}</span>
        </h2>
    );
};

export default SideabarLabel;
