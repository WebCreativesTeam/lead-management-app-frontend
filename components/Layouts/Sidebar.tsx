/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { AppDispatch, IRootState } from '../../store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowRight, Branch, Email, Global, Phone, Shield, Tasks, User } from '../../utils/icons';
import { setBranchCreatePolicy, setBranchDeletePolicy, setBranchReadPolicy, setBranchUpdatePolicy } from '@/store/Slices/branchSlice';
import { fetchUserPolicyArray } from '@/utils/contant';
import { setContactCreatePolicy, setContactDeletePolicy, setContactReadPolicy, setContactUpdatePolicy } from '@/store/Slices/contactSlice';
import { setSourceCreatePolicy, setSourceDeletePolicy, setSourceReadPolicy, setSourceUpdatePolicy } from '@/store/Slices/sourceSlice';
import { setChangeUsersPolicy, setUserCreatePolicy, setUserDeletePolicy, setUserReadPolicy, setUserUpdatePolicy } from '@/store/Slices/userSlice';
import { setTaskCreatePolicy, setTaskDeletePolicy, setTaskReadPolicy, setTaskUpdatePolicy } from '@/store/Slices/taskSlice/manageTaskSlice';
import { setTaskPriorityCreatePolicy, setTaskPriorityDeletePolicy, setTaskPriorityReadPolicy, setTaskPriorityUpdatePolicy } from '@/store/Slices/taskSlice/taskPrioritySlice';
import { setPolicyCreatePermission, setPolicyDeletePermission, setPolicyReadPermission, setPolicyUpdatePermission } from '@/store/Slices/policySlice';

const Sidebar = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const isAbleToReadBranch: boolean = useSelector((state: IRootState) => state.branch.isAbleToRead);
    const userPolicyBranchArray: string[] = useSelector((state: IRootState) => state.branch.userPolicyArr);

    const userPolicyContactArray: string[] = useSelector((state: IRootState) => state.contacts.userPolicyArr);

    const userPolicySourceArray: string[] = useSelector((state: IRootState) => state.source.userPolicyArr);
    const isAbleToReadSource: boolean = useSelector((state: IRootState) => state.source.isAbleToRead);

    const userPolicyUsersArray: string[] = useSelector((state: IRootState) => state.user.userPolicyArr);
    const isAbleToReadUsers: boolean = useSelector((state: IRootState) => state.user.isAbleToRead);

    const userPolicyTaskArray: string[] = useSelector((state: IRootState) => state.task.userPolicyArr);
    const isAbleToReadTask: boolean = useSelector((state: IRootState) => state.task.isAbleToRead);

    const userPolicyPermissonArray: string[] = useSelector((state: IRootState) => state.policy.userPolicyArr);
    const isAbleToReadPolicy: boolean = useSelector((state: IRootState) => state.policy.isAbleToRead);

    // const userPolicyTaskPriorityArray: string[] = useSelector((state: IRootState) => state.taskPriority.userPolicyArr);

    // const userPolicyTaskStatusArray: string[] = useSelector((state: IRootState) => state.taskStatus.userPolicyArr);
    useEffect(() => {
        dispatch(fetchUserPolicyArray());
    }, []);

    //access for branch page
    useEffect(() => {
        dispatch(setBranchReadPolicy('branches:Read::Documents'));
        dispatch(setBranchCreatePolicy('branches:Create'));
        dispatch(setBranchUpdatePolicy('branches:Update'));
        dispatch(setBranchDeletePolicy('branches:Delete'));
    }, [userPolicyBranchArray]);

    //access for source page
    useEffect(() => {
        dispatch(setSourceReadPolicy('sources:Read::Documents'));
        dispatch(setSourceCreatePolicy('sources:Create'));
        dispatch(setSourceUpdatePolicy('sources:Update'));
        dispatch(setSourceDeletePolicy('sources:Delete'));
    }, [userPolicySourceArray]);

    //access for users page
    useEffect(() => {
        dispatch(setUserReadPolicy('users:Read::Documents'));
        dispatch(setUserCreatePolicy('users:Create'));
        dispatch(setUserUpdatePolicy('users:Update::BasicFields'));
        dispatch(setUserDeletePolicy('users:Delete'));
        dispatch(setChangeUsersPolicy('users:Add::Policy'));
    }, [userPolicyUsersArray]);

    //access for Manage Task page
    useEffect(() => {
        dispatch(setTaskReadPolicy('tasks:Read::Documents'));
        dispatch(setTaskCreatePolicy('tasks:Create'));
        dispatch(setTaskUpdatePolicy('tasks:Update'));
        dispatch(setTaskDeletePolicy('tasks:Delete'));
    }, [userPolicyTaskArray]);

    // //access for Task Priority page
    // useEffect(() => {
    //     dispatch(setTaskPriorityReadPolicy('tasks:Read::Documents'));
    //     dispatch(setTaskPriorityCreatePolicy('tasks:Create'));
    //     dispatch(setTaskPriorityUpdatePolicy('tasks:Update'));
    //     dispatch(setTaskPriorityDeletePolicy('tasks:Delete'));
    // }, [userPolicyTaskPriorityArray]);

    //access for Policy page
    useEffect(() => {
        dispatch(setPolicyReadPermission('policies:Read::Documents'));
        dispatch(setPolicyCreatePermission('policies:Create'));
        dispatch(setPolicyUpdatePermission('policies:Update'));
        dispatch(setPolicyDeletePermission('policies:Delete'));
    }, [userPolicyPermissonArray]);

    //access for contact page
    // useEffect(() => {
    //     dispatch(setContactReadPolicy('branches:Read::Documents'));
    //     dispatch(setContactCreatePolicy('branches:Create'));
    //     dispatch(setContactUpdatePolicy('branches:Update'));
    //     dispatch(setContactDeletePolicy('branches:Delete'));
    // }, [userPolicyContactArray]);

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [router.pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    const { t } = useTranslation();

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="ml-[5px] w-8 flex-none" src="/assets/images/logo.svg" alt="logo" />
                            <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">{t('VRISTO')}</span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto h-5 w-5">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            {/* tasks */}
                            {isAbleToReadTask && (
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'Tasks' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Tasks')}>
                                        <div className="flex items-center">
                                            <Tasks />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Tasks')}</span>
                                        </div>

                                        <div className={currentMenu === 'Tasks' ? 'rotate-90' : 'rtl:rotate-180'}>
                                            <ArrowRight />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'Tasks' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <Link href="/tasks">{t('Manage Tasks')}</Link>
                                            </li>

                                            <li>
                                                <Link href="/tasks/priority">{t('Priority')}</Link>
                                            </li>
                                            <li>
                                                <Link href="/tasks/status">{t('Status')}</Link>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* emails */}
                            <li className="menu nav-item">
                                <Link href="/emails" className="group">
                                    <div className="flex items-center">
                                        <Email />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Emails')}</span>
                                    </div>
                                </Link>
                            </li>

                            {/* Users */}
                            {isAbleToReadUsers && (
                                <li className="menu nav-item">
                                    <Link href="/users" className="group">
                                        <div className="flex items-center">
                                            <User />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Users')}</span>
                                        </div>
                                    </Link>
                                </li>
                            )}

                            {/* Branches */}
                            {isAbleToReadBranch && (
                                <li className="menu nav-item">
                                    <Link href="/branches" className="group">
                                        <div className="flex items-center">
                                            <Branch />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Branches')}</span>
                                        </div>
                                    </Link>
                                </li>
                            )}
                            {/* policies */}
                            {isAbleToReadPolicy && (
                                <li className="menu nav-item">
                                    <Link href="/policies" className="group">
                                        <div className="flex items-center">
                                            <Shield />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Policies')}</span>
                                        </div>
                                    </Link>
                                </li>
                            )}

                            {/* sources */}
                            {isAbleToReadSource && (
                                <li className="menu nav-item">
                                    <Link href="/sources" className="group">
                                        <div className="flex items-center">
                                            <Global />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Sources')}</span>
                                        </div>
                                    </Link>
                                </li>
                            )}

                            {/* contacts */}
                            <li className="menu nav-item">
                                <Link href="/contacts" className="group">
                                    <div className="flex items-center">
                                        <Phone />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Contacts')}</span>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
