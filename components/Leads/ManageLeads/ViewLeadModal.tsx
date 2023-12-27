import React, { memo, useEffect, useState } from 'react';
import ViewModal from '@/components/__Shared/ViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setViewModal } from '@/store/Slices/leadSlice/manageLeadSlice';
import { IRootState } from '@/store';
import { SelectOptionsType } from '@/utils/Types';
import { genderList } from '@/utils/Raw Data';

const LeadViewModal = () => {
    const { viewModal, singleData, leadProductList } = useSelector((state: IRootState) => state.lead);
    const dispatch = useDispatch();
    const { createdAt, status, updatedAt, branch, contact, estimatedDate, priority, source, followUpDate, zip } = singleData;
    const [defaultGender, setDefaultGender] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultProduct, setDefaultProduct] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [defaultSubProduct, setDefaultSubProduct] = useState<SelectOptionsType>({} as SelectOptionsType);
    const [productDropdown, setProductDropdown] = useState<SelectOptionsType[]>([] as SelectOptionsType[]);

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
        const findProduct: SelectOptionsType | undefined = productDropdown.find((item: SelectOptionsType) => item?.value === singleData?.productId);
        if (findProduct) {
            setDefaultProduct(findProduct);
        }
    }, [productDropdown, singleData]);

    //find default selected subproduct
    useEffect(() => {
        const findSubProduct: SelectOptionsType | undefined = productDropdown.find((item: SelectOptionsType) => item?.value === singleData?.subProductId);
        if (findSubProduct) {
            setDefaultSubProduct(findSubProduct);
        }
    }, [productDropdown, singleData]);

    const reqData: any = {
        branch: branch?.name,
        contact: `${contact?.title} ${contact?.name} (${contact?.email})`,
        source: source?.name,
        gender: defaultGender?.label,
        product: defaultProduct?.label,
        ['Sub Product']: defaultSubProduct?.label,
        zip,
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
        ['FollowUp Date']: new Date(followUpDate).toLocaleString(),
        ['Estimate Date']: new Date(estimatedDate).toLocaleString(),
        ['Created']: new Date(createdAt).toLocaleString(),
        ['Updated']: new Date(updatedAt).toLocaleString(),
    };

    return (
        <ViewModal
            title="View Lead Detail"
            open={viewModal}
            size="large"
            onClose={() => dispatch(setViewModal({ open: false }))}
            content={
                <>
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
                </>
            }
        />
    );
};

export default memo(LeadViewModal);
