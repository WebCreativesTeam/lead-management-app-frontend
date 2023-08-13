import axios from 'axios';
import { useState, useEffect } from 'react';

const usePermission = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchPermissions = async () => {
            const res = await axios.get('http://13.233.123.25:3030/policies/rules');
            const policyRule = res?.data?.data;
            setData(policyRule);
        };
        fetchPermissions();
    }, []);
    return data;
};

export default usePermission;
