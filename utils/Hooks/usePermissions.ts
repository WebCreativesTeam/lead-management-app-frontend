import axios from 'axios';
import { useState, useEffect } from 'react';

const usePermission = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchPermissions = async () => {
            const res = await axios.get(process.env.NEXT_PUBLIC_API_LINK + 'policies/rules', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
                },
            });
            const policyRule = res?.data?.data;
            setData(policyRule);
        };
        fetchPermissions();
    }, []);
    return data;
};

export default usePermission;
