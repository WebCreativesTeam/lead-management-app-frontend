import React, { Fragment, memo, useEffect, useState } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/leadSlice/manageLeadSlice';
import { IRootState } from '@/store';
import { SelectOptionsType } from '@/utils/Types';
import { genderList } from '@/utils/Raw Data';
import { Tab } from '@headlessui/react';
import { Home, Note, Setting } from '@/utils/icons';
import CreateNotesTab from './CreateNotesTab';

const LeadViewModal = () => {
    const { viewModal, singleData, leadProductList, customFieldsList } = useSelector((state: IRootState) => state.lead);
    const dispatch = useDispatch();
    const { createdAt, status, updatedAt, branch, contact, estimatedDate, priority, source, followUpDate, zip, assignedTo } = singleData;
    const [defaultGender, setDefaultGender] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultProduct, setDefaultProduct] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultSubProduct, setDefaultSubProduct] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);
    const [customFieldCombineArr, setCustomFieldCombineArr] = useState<
        {
            [x: string]: any;
            label: string | undefined;
            id: string;
        }[]
    >(
        [] as {
            [x: string]: any;
            label: string | undefined;
            id: string;
        }[]
    );

    //find default selected branch
    useEffect(() => {
        const findGender: SelectOptionsType | undefined = genderList.find((item: SelectOptionsType) => item?.value === singleData?.gender);
        if (findGender) {
            setDefaultGender(findGender);
        }
    }, [genderList, singleData]);

    //create product dropdown
    useEffect(() => {
        const createProductDropdown: SelectOptionsType[] = leadProductList?.map((item) => {
            return { label: item?.name, value: item?.id };
        });
        setProductDropdown(createProductDropdown);
    }, [leadProductList]);

    //find default selected product
    useEffect(() => {
        const findProduct: SelectOptionsType | undefined = productDropdown.find((item: SelectOptionsType) => item?.value === singleData?.product?.id);
        if (findProduct) {
            setDefaultProduct(findProduct);
        }
    }, [productDropdown, singleData]);

    //find default selected subproduct
    useEffect(() => {
        const findSubProduct: SelectOptionsType | undefined = productDropdown.find((item: SelectOptionsType) => item?.value === singleData?.subProduct?.id);
        if (findSubProduct) {
            setDefaultSubProduct(findSubProduct);
        }
    }, [productDropdown, singleData]);

    console.log(singleData);

    const reqData: any = {
        branch: branch?.name,
        ['Contact Name']: `${contact?.title} ${contact?.name}`,
        ['Contact Number']: contact?.phoneNumber,
        Email: contact?.email,
        source: source?.name,
        gender: defaultGender?.label,
        product: defaultProduct?.label,
        ['Assigned To']: `${assignedTo?.firstName} ${assignedTo?.lastName} (${assignedTo?.email})`,
        ['Sub Product']: defaultSubProduct?.label,
        ['Pin Code']: zip,
        priority: (
            <span className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: priority?.color, backgroundColor: priority?.color + '20' }}>
                {priority?.name}
            </span>
        ),
        ['Lead Status']: (
            <span className={`rounded px-2.5 py-0.5 text-sm font-medium dark:bg-blue-900 dark:text-blue-300`} style={{ color: status?.color, backgroundColor: status?.color + '20' }}>
                {status?.name}
            </span>
        ),
        ['Follow Up Date']: followUpDate ? new Date(followUpDate).toLocaleString() : 'Pending',
        ['Estimate Purchase Date']: estimatedDate ? new Date(estimatedDate).toLocaleDateString() : 'Pending',
        ['Created']: new Date(createdAt).toLocaleString(),
        ['Updated']: new Date(updatedAt).toLocaleString(),
    };

    // janxk60

    useEffect(() => {
        const result = Object.keys(singleData?.customFields).map((key) => {
            return {
                [key]: singleData?.customFields[key],
                label: customFieldsList?.find((item) => item?.id === key)?.label,
                id: key,
            };
        });
        setCustomFieldCombineArr(result);
    }, []);

    return (
        <ViewModal
            title="View Lead Detail"
            open={viewModal}
            size="large"
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <Tab.Group>
                    <Tab.List className="mb-8 flex flex-col flex-wrap gap-2 sm:flex-row">
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? 'bg-green-600 text-white shadow-xl !outline-none' : ''
                                    } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2 before:inline-block hover:bg-green-600 hover:text-white`}
                                >
                                    <Home />
                                    Overview
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? 'bg-green-600 text-white shadow-xl !outline-none' : ''
                                    } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2 before:inline-block hover:bg-green-600 hover:text-white`}
                                >
                                    <Setting />
                                    Custom Fields
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? 'bg-green-600 text-white  shadow-xl !outline-none' : ''
                                    } -mb-[1px] flex flex-1 items-center justify-center rounded-lg p-3.5 py-2  before:inline-block hover:bg-green-600 hover:text-white`}
                                >
                                    <Note />
                                    Note
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        {/* overview form :start */}
                        <Tab.Panel>
                            <ul className="flex flex-col gap-4">
                                {Object.keys(reqData).map((item: string, i: number) => {
                                    return (
                                        <li className="flex flex-wrap" key={i}>
                                            <span className="flex-1 text-lg font-bold capitalize">{item}</span>
                                            <p className="flex-[2]"> {reqData[item]}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Tab.Panel>
                        {/* overview form :end */}

                        {/* Custom fields tab : start */}
                        <Tab.Panel>
                            <ul className="flex flex-col gap-4">
                                {customFieldCombineArr?.map((item, i: number) => {
                                    return (
                                        <li className="flex flex-wrap" key={i}>
                                            <span className="flex-1 text-lg font-bold capitalize">{item?.label}</span>
                                            <p className="flex-[2]"> {item[item?.id]}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Tab.Panel>
                        {/* custom fields tab :end */}

                        {/* Notes tab content : start */}
                        <Tab.Panel>
                            <CreateNotesTab />
                        </Tab.Panel>
                        {/* Notes tab content : end */}

                        {/* logs tab content : start */}
                        {/* <Tab.Panel>
                                    <div className="mb-5">
                                        <div className="mx-auto max-w-[900px]">
                                            <div className="flex">
                                                <p className="mr-3 w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">2 Days Ago</p>
                                                <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-primary after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-primary"></div>
                                                <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">Call with John Doe</p>
                                                    <p className="min-w-[100px] max-w-[100px] self-center text-xs font-bold text-white-dark">Duration :25 mins</p>
                                                    <audio controls muted>
                                                        <source src="horse.ogg" type="audio/ogg" />
                                                        <source src="horse.mp3" type="audio/mpeg" />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <p className="mr-3 w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">2 Days Ago</p>
                                                <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-secondary after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-secondary"></div>
                                                <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">Whatsapp With Jane Smith</p>
                                                    <p className="min-w-[100px] self-center text-xs font-bold text-white-dark">Last Message: Birthday wish content</p>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <p className="mr-3 w-[100px] py-2.5 text-base font-semibold text-[#3b3f5c] dark:text-white-light">2 Days Ago</p>
                                                <div className="relative before:absolute before:left-1/2 before:top-[15px] before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:rounded-full before:border-2 before:border-success after:absolute after:-bottom-[15px] after:left-1/2 after:top-[25px] after:h-auto after:w-0 after:-translate-x-1/2 after:rounded-full after:border-l-2 after:border-success"></div>
                                                <div className="self-center p-2.5 ltr:ml-2.5 rtl:ml-2.5 rtl:ltr:mr-2.5">
                                                    <p className="text-[13px] font-semibold text-[#3b3f5c] dark:text-white-light">Email to HR and Admin</p>
                                                    <p className="min-w-[100px]  self-center text-xs font-bold text-white-dark">Last Message: Birthday wish content</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Panel> */}
                        {/* logs tab content : end */}
                    </Tab.Panels>
                </Tab.Group>
            }
        />
    );
};

export default memo(LeadViewModal);
