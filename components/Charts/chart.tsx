import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Charts = ({data} : any) => {

    const [isMounted, setIsMounted] = useState(false);
    const series = [20, 20, 20]
    useEffect(() => {
        setIsMounted(true);
    });


    return (
        <div className=" text-center max-w-[18rem] w-full shadow-[4px_6px_10px_-3px_#bfc9d4] bg-white rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#0e1726] dark:shadow-none p-5">
         <h4 className='text-[16px] font-semibold'>User</h4>   
        {isMounted && <ReactApexChart series={series} options={data.options}  type="donut" height={490} width={'100%'} />}
        </div>
    );
};

export default Charts;
