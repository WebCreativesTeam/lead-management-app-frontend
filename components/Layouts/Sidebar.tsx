/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

//* lib Imports
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import AnimateHeight from 'react-animate-height';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

//* redux-toolkit imports
import { toggleSidebar } from '../../store/themeConfigSlice';
import { AppDispatch, IRootState } from '../../store';
import { setBranchCreatePolicy, setBranchDeletePolicy, setBranchReadPolicy, setBranchUpdatePolicy } from '@/store/Slices/branchSlice';
import { setContactCreatePolicy, setContactDeletePolicy, setContactReadPolicy, setContactUpdatePolicy } from '@/store/Slices/contactSlice';
import { setSourceCreatePolicy, setSourceDeletePolicy, setSourceReadPolicy, setSourceUpdatePolicy } from '@/store/Slices/sourceSlice';
import { setChangeActiveStatusPermission, setChangeUsersPolicy, setUserCreatePolicy, setUserDeletePolicy, setUserReadPolicy, setUserUpdatePolicy } from '@/store/Slices/userSlice';
import { setTaskCreatePolicy, setTaskDeletePolicy, setTaskReadPolicy, setTaskTransferPermission, setTaskUpdatePolicy } from '@/store/Slices/taskSlice/manageTaskSlice';
import {
    setChangeDefaultTaskPriorityPermission,
    setTaskPriorityCreatePolicy,
    setTaskPriorityDeletePolicy,
    setTaskPriorityReadPolicy,
    setTaskPriorityUpdatePolicy,
} from '@/store/Slices/taskSlice/taskPrioritySlice';
import { setChangeDefaultPolicyPermission, setPolicyCreatePermission, setPolicyDeletePermission, setPolicyReadPermission, setPolicyUpdatePermission } from '@/store/Slices/policySlice';
import {
    setChangeDefaultTaskStatusPermission,
    setTaskStatusCreatePolicy,
    setTaskStatusDeletePolicy,
    setTaskStatusReadPolicy,
    setTaskStatusUpdatePolicy,
} from '@/store/Slices/taskSlice/taskStatusSlice';
import { setEmailTemplateCreatePermission, setEmailTemplateDeletePermission, setEmailTemplateReadPermission, setEmailTemplateUpdatePermission } from '@/store/Slices/emailSlice/emailTemplateSlice';
import { setLeadCreatePolicy, setLeadDeletePolicy, setLeadReadPolicy, setLeadUpdatePolicy } from '@/store/Slices/leadSlice/manageLeadSlice';
import {
    setChangeDefaultLeadPriorityPermission,
    setLeadPriorityCreatePolicy,
    setLeadPriorityDeletePolicy,
    setLeadPriorityReadPolicy,
    setLeadPriorityUpdatePolicy,
} from '@/store/Slices/leadSlice/leadPrioritySlice';
import {
    setChangeDefaultLeadStatusPermission,
    setLeadStatusCreatePolicy,
    setLeadStatusDeletePolicy,
    setLeadStatusReadPolicy,
    setLeadStatusUpdatePolicy,
} from '@/store/Slices/leadSlice/leadStatusSlice';
import { setEmailSmtpCreatePermission, setEmailSmtpDeletePermission, setEmailSmtpReadPermission, setEmailSmtpUpdatePermission } from '@/store/Slices/emailSlice/emailSmtpSlice';
import { setSmsTemplateCreatePermission, setSmsTemplateDeletePermission, setSmsTemplateReadPermission, setSmsTemplateUpdatePermission } from '@/store/Slices/templateSlice/smsTemplateSlice';

//other imports
import { ArrowRight, Branch, Email, Global, Phone, Shield, Tasks, User, File, Talegram, Setting, Automation, DropdownDoubleLayer } from '../../utils/icons';
import { fetchUserInfo } from '@/utils/contant';

const Sidebar = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [leadSettingSubMenu, setLeadSettingSubMenu] = useState<boolean>(false);
    const [taskSettingSubMenu, setTaskSettingSubMenu] = useState<boolean>(false);
    const [userSettingSubMenu, setUserSettingSubMenu] = useState<boolean>(false);
    const [logsSubMenu, setLogsSubMenu] = useState<boolean>(false);
    const [campaignIntegrationSubMenu, setCampaignIntegrationSubMenu] = useState<boolean>(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    //branch
    const isAbleToReadBranch: boolean = useSelector((state: IRootState) => state.branch.isAbleToRead);
    const userPolicyBranchArray: string[] = useSelector((state: IRootState) => state.branch.userPolicyArr);

    //contacts
    const userPolicyContactArray: string[] = useSelector((state: IRootState) => state.contacts.userPolicyArr);
    const isAbleToReadContact: boolean = useSelector((state: IRootState) => state.contacts.isAbleToRead);

    // source
    const userPolicySourceArray: string[] = useSelector((state: IRootState) => state.source.userPolicyArr);
    const isAbleToReadSource: boolean = useSelector((state: IRootState) => state.source.isAbleToRead);

    //user
    const userPolicyUsersArray: string[] = useSelector((state: IRootState) => state.user.userPolicyArr);
    const isAbleToReadUsers: boolean = useSelector((state: IRootState) => state.user.isAbleToRead);

    //Manage Task
    const userPolicyTaskArray: string[] = useSelector((state: IRootState) => state.task.userPolicyArr);
    const isAbleToReadTask: boolean = useSelector((state: IRootState) => state.task.isAbleToRead);

    //Policy page
    const userPolicyPermissonArray: string[] = useSelector((state: IRootState) => state.policy.userPolicyArr);
    const isAbleToReadPolicy: boolean = useSelector((state: IRootState) => state.policy.isAbleToRead);

    //Task Priority
    const userPolicyTaskPriorityArray: string[] = useSelector((state: IRootState) => state.taskPriority.userPolicyArr);
    const isAbleToReadTaskPriority: boolean = useSelector((state: IRootState) => state.taskPriority.isAbleToRead);

    //Lead Priority
    const userPolicyLeadPriorityArray: string[] = useSelector((state: IRootState) => state.leadPriority.userPolicyArr);
    const isAbleToReadLeadPriority: boolean = useSelector((state: IRootState) => state.taskPriority.isAbleToRead);

    //Task Status
    const userPolicyTaskStatusArray: string[] = useSelector((state: IRootState) => state.taskStatus.userPolicyArr);
    const isAbleToReadTaskStatus: boolean = useSelector((state: IRootState) => state.taskStatus.isAbleToRead);

    //Lead Status
    const userPolicyLeadStatusArray: string[] = useSelector((state: IRootState) => state.leadStatus.userPolicyArr);
    const isAbleToReadLeadStatus: boolean = useSelector((state: IRootState) => state.leadStatus.isAbleToRead);

    //email template
    const userPolicyEmailTemplateArray: string[] = useSelector((state: IRootState) => state.taskStatus.userPolicyArr);
    const isAbleToReadEmailTemplates: boolean = useSelector((state: IRootState) => state.emailTemplate.isAbleToRead);

    //email smtp
    const userPolicyEmailSmtpArray: string[] = useSelector((state: IRootState) => state.emailSmtp.userPolicyArr);
    const isAbleToReadEmailSmtp: boolean = useSelector((state: IRootState) => state.emailSmtp.isAbleToRead);

    //Manage Leads page
    const userPolicyLeadArray: string[] = useSelector((state: IRootState) => state.lead.userPolicyArr);
    const isAbleToReadLeads: boolean = useSelector((state: IRootState) => state.lead.isAbleToRead);

    //Manage sms template page
    const userPolicySmsTemplateArray: string[] = useSelector((state: IRootState) => state.smsTemplate.userPolicyArr);
    const isAbleToReadSmsTemplate: boolean = useSelector((state: IRootState) => state.smsTemplate?.isAbleToRead);

    useEffect(() => {
        dispatch(fetchUserInfo());
    }, []);

    //access for sms template page
    useEffect(() => {
        dispatch(setSmsTemplateReadPermission('smstemplate:Read::Documents'));
        dispatch(setSmsTemplateCreatePermission('smstemplate:Create::Document'));
        dispatch(setSmsTemplateUpdatePermission('smstemplate:Update::Document'));
        dispatch(setSmsTemplateDeletePermission('smstemplate:Delete::Document'));
    }, [userPolicySmsTemplateArray]);

    //access for branch page
    useEffect(() => {
        dispatch(setBranchReadPolicy('branch:Read::Documents'));
        dispatch(setBranchCreatePolicy('branch:Create::Document'));
        dispatch(setBranchUpdatePolicy('branch:Update::Document'));
        dispatch(setBranchDeletePolicy('branch:Delete::Document'));
    }, [userPolicyBranchArray]);

    //access for source page
    useEffect(() => {
        dispatch(setSourceReadPolicy('source:Read::Documents'));
        dispatch(setSourceCreatePolicy('source:Create::Document'));
        dispatch(setSourceUpdatePolicy('source:Update::Document'));
        dispatch(setSourceDeletePolicy('source:Delete::Document'));
    }, [userPolicySourceArray]);

    //access for users page
    useEffect(() => {
        dispatch(setUserReadPolicy('user:Read::Documents'));
        dispatch(setUserCreatePolicy('user:Create::Document'));
        dispatch(setUserUpdatePolicy('user:Update::DocumentBasic'));
        dispatch(setUserDeletePolicy('user:Delete::Document'));
        dispatch(setChangeUsersPolicy('user:Update::Policy'));
        dispatch(setChangeActiveStatusPermission('user:Update::DocumentInternals'));
    }, [userPolicyUsersArray]);

    //access for Manage Task page
    useEffect(() => {
        dispatch(setTaskReadPolicy('task:Read::Documents'));
        dispatch(setTaskCreatePolicy('task:Create::Document'));
        dispatch(setTaskUpdatePolicy('task:Update::Document'));
        dispatch(setTaskDeletePolicy('task:Delete::Document'));
        dispatch(setTaskTransferPermission('task:Update::DocumentTransfer'));
    }, [userPolicyTaskArray]);

    //access for Task Status page
    useEffect(() => {
        dispatch(setTaskStatusReadPolicy('taskstatus:Read::Documents'));
        dispatch(setTaskStatusCreatePolicy('taskstatus:Create::Document'));
        dispatch(setTaskStatusUpdatePolicy('taskstatus:Update::Document'));
        dispatch(setTaskStatusDeletePolicy('taskstatus:Delete::Document'));
        dispatch(setChangeDefaultTaskStatusPermission('taskstatus:Update::DocumentDefault'));
    }, [userPolicyTaskStatusArray]);

    //access for Lead Status page
    useEffect(() => {
        dispatch(setLeadStatusReadPolicy('leadstatus:Read::Documents'));
        dispatch(setLeadStatusCreatePolicy('leadstatus:Create::Document'));
        dispatch(setLeadStatusUpdatePolicy('leadstatus:Update::Document'));
        dispatch(setLeadStatusDeletePolicy('leadstatus:Delete::Document'));
        dispatch(setChangeDefaultLeadStatusPermission('leadstatus:Update::DocumentDefault'));
    }, [userPolicyLeadStatusArray]);

    //access for Task Priority page
    useEffect(() => {
        dispatch(setTaskPriorityReadPolicy('taskpriority:Read::Documents'));
        dispatch(setTaskPriorityCreatePolicy('taskpriority:Create::Document'));
        dispatch(setTaskPriorityUpdatePolicy('taskpriority:Update::Document'));
        dispatch(setTaskPriorityDeletePolicy('taskpriority:Delete::Document'));
        dispatch(setChangeDefaultTaskPriorityPermission('taskpriority:Update::DocumentDefault'));
    }, [userPolicyTaskPriorityArray]);

    //access for Lead Priority page
    useEffect(() => {
        dispatch(setLeadPriorityReadPolicy('leadpriority:Read::Documents'));
        dispatch(setLeadPriorityCreatePolicy('leadpriority:Create::Document'));
        dispatch(setLeadPriorityUpdatePolicy('leadpriority:Update::Document'));
        dispatch(setLeadPriorityDeletePolicy('leadpriority:Delete::Document'));
        dispatch(setChangeDefaultLeadPriorityPermission('leadpriority:Update::DocumentDefault'));
    }, [userPolicyLeadPriorityArray]);

    //access for Policy page
    useEffect(() => {
        dispatch(setPolicyReadPermission('policy:Read::Documents'));
        dispatch(setPolicyCreatePermission('policy:Create::Document'));
        dispatch(setPolicyUpdatePermission('policy:Update::Document'));
        dispatch(setPolicyDeletePermission('policy:Delete::Document'));
        dispatch(setChangeDefaultPolicyPermission('policy:Update::DocumentDefault'));
    }, [userPolicyPermissonArray]);

    // access for contact page
    useEffect(() => {
        dispatch(setContactReadPolicy('contact:Read::Documents'));
        dispatch(setContactCreatePolicy('contact:Create::Document'));
        dispatch(setContactUpdatePolicy('contact:Update::Document'));
        dispatch(setContactDeletePolicy('contact:Delete::Document'));
    }, [userPolicyContactArray]);

    // access for Email Template page
    useEffect(() => {
        dispatch(setEmailTemplateReadPermission('emailtemplate:Read::Documents'));
        dispatch(setEmailTemplateCreatePermission('emailtemplate:Create::Document'));
        dispatch(setEmailTemplateUpdatePermission('emailtemplate:Update::Document'));
        dispatch(setEmailTemplateDeletePermission('emailtemplate:Delete::Document'));
    }, [userPolicyEmailTemplateArray]);

    // access for Email smtp page
    useEffect(() => {
        dispatch(setEmailSmtpReadPermission('smtp:Read::Documents'));
        dispatch(setEmailSmtpCreatePermission('smtp:Create::Document'));
        dispatch(setEmailSmtpUpdatePermission('smtp:Update::Document'));
        dispatch(setEmailSmtpDeletePermission('smtp:Delete::Document'));
    }, [userPolicyEmailSmtpArray]);

    //access for Manage Lead page
    useEffect(() => {
        dispatch(setLeadReadPolicy('lead:Read::Documents'));
        dispatch(setLeadCreatePolicy('lead:Create::Document'));
        dispatch(setLeadUpdatePolicy('lead:Update::Document'));
        dispatch(setLeadDeletePolicy('lead:Delete::Document'));
    }, [userPolicyLeadArray]);

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
                            {/* dashboard */}
                            <li className="menu nav-item">
                                <Link href="/" className="group">
                                    <div className="flex items-center">
                                        <User />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Dashboard')}</span>
                                    </div>
                                </Link>
                            </li>

                            {/* Leads */}
                            {!isAbleToReadLeads && !isAbleToReadLeadPriority && !isAbleToReadLeadStatus ? null : (
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'Leads' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Leads')}>
                                        <div className="flex items-center">
                                            <Talegram />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Leads')}</span>
                                        </div>

                                        <div className={currentMenu === 'Leads' ? 'rotate-90' : 'rtl:rotate-180'}>
                                            <ArrowRight />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'Leads' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {isAbleToReadLeads && (
                                                <li>
                                                    <Link href="/leads">{t('Manage Leads')}</Link>
                                                </li>
                                            )}

                                            <li>
                                                <Link href="/leads/rules">{t('Rules')}</Link>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* IVR */}
                            <li className="menu nav-item">
                                <Link href="/ivr" className="group">
                                    <div className="flex items-center">
                                        <User />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('IVR')}</span>
                                    </div>
                                </Link>
                            </li>

                            {/* Automation */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'Automation' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Automation')}>
                                    <div className="flex items-center">
                                        <Automation />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Automation')}</span>
                                    </div>

                                    <div className={currentMenu === 'Automation' ? 'rotate-90' : 'rtl:rotate-180'}>
                                        <ArrowRight />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'Automation' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/automation/schedule-message">{t('Schedule Message')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/automation/occasion-message">{t('Occasion Message')}</Link>
                                        </li>

                                        <li>
                                            <Link href="/automation/drip-message">{t('Drip Message')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            {/* task */}
                            {isAbleToReadContact && (
                                <li className="menu nav-item">
                                    <Link href="/task" className="group">
                                        <div className="flex items-center">
                                            <Tasks />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Task')}</span>
                                        </div>
                                    </Link>
                                </li>
                            )}

                            {/* contacts */}
                            {isAbleToReadContact && (
                                <li className="menu nav-item">
                                    <Link href="/contacts" className="group">
                                        <div className="flex items-center">
                                            <Phone />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Contacts')}</span>
                                        </div>
                                    </Link>
                                </li>
                            )}

                            {/* Report */}
                            {isAbleToReadContact && (
                                <li className="menu nav-item">
                                    <Link href="/report" className="group">
                                        <div className="flex items-center">
                                            <Phone />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Report')}</span>
                                        </div>
                                    </Link>
                                </li>
                            )}

                            {/* Templates */}
                            {!isAbleToReadEmailTemplates && !isAbleToReadEmailSmtp ? null : (
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'Templates' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Templates')}>
                                        <div className="flex items-center">
                                            <File />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Templates')}</span>
                                        </div>

                                        <div className={currentMenu === 'Templates' ? 'rotate-90' : 'rtl:rotate-180'}>
                                            <ArrowRight />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'Templates' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {isAbleToReadSmsTemplate && (
                                                <li>
                                                    <Link href="/templates/sms-template">{t('SMS')}</Link>
                                                </li>
                                            )}
                                            {isAbleToReadEmailTemplates && (
                                                <li>
                                                    <Link href="/templates/email-template">{t('Email')}</Link>
                                                </li>
                                            )}

                                            <li>
                                                <Link href="/templates/whatsapp-template">{t('WhatsApp')}</Link>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}

                            {/* //? Settings */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'Setting' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Setting')}>
                                    <div className="flex items-center">
                                        <Setting />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Setting')}</span>
                                    </div>

                                    <div className={currentMenu === 'Setting' ? 'rotate-90' : 'rtl:rotate-180'}>
                                        <ArrowRight />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'Setting' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        {/* campaign integration dropdown */}
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${
                                                    campaignIntegrationSubMenu ? 'open' : ''
                                                } w-full break-words before:h-[5px] before:w-[5px] before:rounded before:bg-gray-300 hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                onClick={() => setCampaignIntegrationSubMenu(!campaignIntegrationSubMenu)}
                                            >
                                                {t('Campaign Integration')}
                                                <div className={`${campaignIntegrationSubMenu ? '!rotate-90' : ''} ltr:ml-auto rtl:mr-auto rtl:rotate-180`}>
                                                    <ArrowRight />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={campaignIntegrationSubMenu ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    <li>
                                                        <Link href="/setting/campaign-integration/email">{t('SMS')}</Link>
                                                    </li>
                                                    {isAbleToReadEmailSmtp && (
                                                        <li>
                                                            <Link href="/setting/campaign-integration/email">{t('Email')}</Link>
                                                        </li>
                                                    )}
                                                    <li>
                                                        <Link href="/setting/campaign-integration/email">{t('Whatsapp')}</Link>
                                                    </li>
                                                </ul>
                                            </AnimateHeight>
                                        </li>

                                        <li>
                                            <Link href="/setting/email-logs">{t('Lead Integration')}</Link>
                                        </li>

                                        {/* User setting dropdown */}
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${
                                                    userSettingSubMenu ? 'open' : ''
                                                } w-full before:h-[5px] before:w-[5px] before:rounded before:bg-gray-300 hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                onClick={() => setUserSettingSubMenu(!userSettingSubMenu)}
                                            >
                                                {t('User Setting')}
                                                <div className={`${userSettingSubMenu ? '!rotate-90' : ''} ltr:ml-auto rtl:mr-auto rtl:rotate-180`}>
                                                    <ArrowRight />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={userSettingSubMenu ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    {isAbleToReadUsers && (
                                                        <li>
                                                            <Link href="/setting/user-setting/user-information">{t('User Information')}</Link>
                                                        </li>
                                                    )}
                                                    {isAbleToReadPolicy && (
                                                        <li>
                                                            <Link href="/setting/user-setting/user-policy">{t('User Policy')}</Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </AnimateHeight>
                                        </li>

                                        {isAbleToReadBranch && (
                                            <li>
                                                <Link href="/setting/branch-setting">{t('Branch Setting')}</Link>
                                            </li>
                                        )}

                                        {/* lead setting dropdown */}
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${
                                                    leadSettingSubMenu ? 'open' : ''
                                                } w-full before:h-[5px] before:w-[5px] before:rounded before:bg-gray-300 hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                onClick={() => setLeadSettingSubMenu(!leadSettingSubMenu)}
                                            >
                                                {t('Lead Setting')}
                                                <div className={`${leadSettingSubMenu ? '!rotate-90' : ''} ltr:ml-auto rtl:mr-auto rtl:rotate-180`}>
                                                    <ArrowRight />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={leadSettingSubMenu ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    {isAbleToReadSource && (
                                                        <li>
                                                            <Link href="/setting/lead-setting/source-setting">{t('Source Setting')}</Link>
                                                        </li>
                                                    )}
                                                    {isAbleToReadLeadStatus && (
                                                        <li>
                                                            <Link href="/setting/lead-setting/status">{t('Status')}</Link>
                                                        </li>
                                                    )}
                                                    {isAbleToReadLeadPriority && (
                                                        <li>
                                                            <Link href="/setting/lead-setting/priority">{t('Priority')}</Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </AnimateHeight>
                                        </li>

                                        {/* task setting dropdown */}
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${
                                                    taskSettingSubMenu ? 'open' : ''
                                                } w-full before:h-[5px] before:w-[5px] before:rounded before:bg-gray-300 hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                onClick={() => setTaskSettingSubMenu(!taskSettingSubMenu)}
                                            >
                                                {t('Task Setting')}
                                                <div className={`${taskSettingSubMenu ? '!rotate-90' : ''} ltr:ml-auto rtl:mr-auto rtl:rotate-180`}>
                                                    <ArrowRight />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={taskSettingSubMenu ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    {isAbleToReadTaskStatus && (
                                                        <li>
                                                            <Link href="/setting/task-setting/status">{t('Status')}</Link>
                                                        </li>
                                                    )}
                                                    {isAbleToReadTaskPriority && (
                                                        <li>
                                                            <Link href="/setting/task-setting/priority">{t('Priority')}</Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </AnimateHeight>
                                        </li>

                                        <li>
                                            <Link href="/setting/email-logs">{t('Lead Assigning')}</Link>
                                        </li>

                                        {/* Logs dropdown */}
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${
                                                    logsSubMenu ? 'open' : ''
                                                } w-full before:h-[5px] before:w-[5px] before:rounded before:bg-gray-300 hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                onClick={() => setLogsSubMenu(!logsSubMenu)}
                                            >
                                                {t('Logs')}
                                                <div className={`${logsSubMenu ? '!rotate-90' : ''} ltr:ml-auto rtl:mr-auto rtl:rotate-180`}>
                                                    <ArrowRight />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={logsSubMenu ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    <li>
                                                        <Link href="/setting/logs/email">{t('Email')}</Link>
                                                    </li>
                                                </ul>
                                            </AnimateHeight>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            {/* Emails */}
                            {!isAbleToReadEmailSmtp ? null : (
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'Emails' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Emails')}>
                                        <div className="flex items-center">
                                            <Email />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Emails')}</span>
                                        </div>

                                        <div className={currentMenu === 'Emails' ? 'rotate-90' : 'rtl:rotate-180'}>
                                            <ArrowRight />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'Emails' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <Link href="/emails/create-email">{t('Create Email')}</Link>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            )}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
