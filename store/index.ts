import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import sourceSlice from './Slices/sourceSlice';
import contactSlice from './Slices/contactSlice';
import branchSlice from './Slices/branchSlice';
import userSlice from './Slices/userSlice';
import policySlice from './Slices/policySlice';
import manageTaskSlice from './Slices/taskSlice/manageTaskSlice';
import taskStatusSlice from './Slices/taskSlice/taskStatusSlice';
import taskPrioritySlice from './Slices/taskSlice/taskPrioritySlice';
import emailTemplateSlice from './Slices/emailSlice/emailTemplateSlice';
import manageLeadSlice from './Slices/leadSlice/manageLeadSlice';
import userProfileSlice from './Slices/userProfileSlice';
import leadPrioritySlice from './Slices/leadSlice/leadPrioritySlice';
import leadStatusSlice from './Slices/leadSlice/leadStatusSlice';
import emailSmtpSlice from './Slices/emailSlice/emailSmtpSlice';
import emailLogSlice from './Slices/emailSlice/emailLogSlice';
import smsTemplateSlice from './Slices/templateSlice/smsTemplateSlice';
import leadRuleSlice from './Slices/leadSlice/leadRuleSlice';
import whatsappTemplateSlice from './Slices/templateSlice/whatsappTemplateSlice';
import dashbordSlice from './Slices/dashbordSlice';
import customFieldSlice from './Slices/customFieldSlice';
import campaignSlice from './Slices/campaignSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    contacts: contactSlice,
    source: sourceSlice,
    branch: branchSlice,
    user: userSlice,
    policy: policySlice,
    task: manageTaskSlice,
    taskStatus: taskStatusSlice,
    taskPriority: taskPrioritySlice,
    lead: manageLeadSlice,
    leadPriority: leadPrioritySlice,
    leadStatus: leadStatusSlice,
    leadRule: leadRuleSlice,
    emailTemplate: emailTemplateSlice,
    emailSmtp: emailSmtpSlice,
    emailLog: emailLogSlice,
    userInfo: userProfileSlice,
    smsTemplate: smsTemplateSlice,
    whatsappTemplate: whatsappTemplateSlice,
    campaign: campaignSlice,
    dashboard: dashbordSlice,
    customField: customFieldSlice,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof rootReducer>;
