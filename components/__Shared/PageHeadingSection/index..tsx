import React,{memo} from 'react';
import { SnackLine, WalkingMan } from '../../icons';
import { PageHeadingSectionProps } from './PageHeading.types';

const PageHeadingSection = ({ heading, description }: PageHeadingSectionProps) => {
    return (
        <div className="relative rounded-t-md bg-primary-light bg-[url('/assets/images/knowledge/pattern.png')] bg-contain bg-left-top bg-no-repeat px-5 py-10 dark:bg-black md:px-10">
            <div className="rtl:rotate-y-180 absolute -bottom-1 -end-6 hidden text-[#DBE7FF] dark:text-[#1B2E4B] lg:block xl:end-0">
                <WalkingMan />
            </div>
            <div className="relative">
                <div className="flex flex-col items-center justify-center sm:-ms-32 sm:flex-row xl:-ms-60">
                    <div className="mb-2 flex gap-1 text-end text-base leading-5 sm:flex-col xl:text-xl">
                        <span>Welcome Admin, </span>
                    </div>
                    <div className="rtl:rotate-y-180 me-4 ms-2 hidden text-[#0E1726] dark:text-white sm:block">
                        <SnackLine />
                    </div>
                    <div className="mb-2 text-center text-2xl font-bold dark:text-white md:text-5xl">{heading}</div>
                </div>
                <p className="my-9 text-center text-base font-semibold">{description}</p>
            </div>
        </div>
    );
};

export default memo(PageHeadingSection);
