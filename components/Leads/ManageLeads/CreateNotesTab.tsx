/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Loader from '@/components/__Shared/Loader';
import { IRootState } from '@/store';
import { getAllNotesForLead } from '@/store/Slices/leadSlice/manageLeadSlice';
import { GetMethodResponseType, ILeadNotes } from '@/utils/Types';
import { ApiClient } from '@/utils/http';
import { Delete } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CreateNotesTab = () => {
    const { isFetching, editModal, singleData, leadNoteList } = useSelector((state: IRootState) => state.lead);
    const dispatch = useDispatch();
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const {
        data: { id },
    } = useSelector((state: IRootState) => state.userInfo);

    useEffect(() => {
        handleFetchNotes();
    }, [fetching]);

    const handleFetchNotes = async () => {
        setIsLoading(true);
        try {
            const LeadNoteList: GetMethodResponseType = await new ApiClient().get(`lead-note?leadId=${singleData?.id}&sortBy=-createdAt`);
            const leadNotes: ILeadNotes[] = LeadNoteList?.data;
            if (typeof leadNotes === 'undefined') {
                dispatch(getAllNotesForLead([] as ILeadNotes[]));
                setIsLoading(false);
                return;
            }
            dispatch(getAllNotesForLead(leadNotes));
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const handleCreateNote = async () => {
        const createNoteObj = {
            content,
            userId: id,
            leadId: singleData?.id,
            title,
        };
        try {
            setIsLoading(true);
            await new ApiClient().post('lead-note', createNoteObj);
            setContent('');
            setTitle('');
            setIsLoading(false);
            setFetching(!fetching);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            setIsLoading(true);
            const deleteNote: ILeadNotes = await new ApiClient().delete('lead-note/' + id);
            if (deleteNote === null) {
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
            setFetching(!fetching);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    return isLoading ? (
        <Loader />
    ) : (
        <div className="mb-5">
            <div className="panel max-h-[60vh] overflow-y-auto">
                {leadNoteList?.map((item, index) => {
                    return (
                        <div className="relative items-start sm:flex" key={index}>
                            <div className="relative z-[2] mx-auto mb-5 before:absolute before:-bottom-[15px] before:left-1/2 before:top-12 before:-z-[1] before:hidden before:h-auto before:w-0 before:-translate-x-1/2 before:border-l-2 before:border-[#ebedf2] dark:before:border-[#191e3a] sm:mb-0 sm:before:block ltr:sm:mr-8 rtl:sm:ml-8">
                                <img src="/assets/images/profile-16.jpeg" alt="img" className="mx-auto h-12 w-12 rounded-full shadow-[0_4px_9px_0_rgba(31,45,61,0.31)]" />
                            </div>

                            <div className="flex-1">
                                <h4 className="text-center text-base font-bold text-primary ltr:sm:text-left rtl:sm:text-right">{item?.title}</h4>
                                <p className="text-xs tracking-wide text-gray-500">{new Date(item?.createdAt).toLocaleString()}</p>
                                <div className="mb-8 mt-2 font-semibold text-white-dark sm:mt-7 ">{item?.content}</div>
                            </div>
                            <button type="button" className="btn btn-danger absolute right-2 top-0" onClick={() => handleDeleteNote(item?.id)}>
                                <Delete />
                                Delete note
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className="my-5 flex-1">
                <label htmlFor="zip">Title</label>
                <input onChange={(e) => setTitle(e.target.value)} value={title} placeholder="Enter Title" className="form-input" />
            </div>
            <div>
                <textarea id="addNoteArea" rows={10} className="form-textarea" placeholder="Enter Note" onChange={(e) => setContent(e.target.value)} value={content}></textarea>
            </div>
            <div className="flex justify-center">
                <button type="button" className="btn btn-primary" onClick={handleCreateNote} disabled={!content || !title}>
                    Add Note
                </button>
            </div>
        </div>
    );
};

export default CreateNotesTab;
