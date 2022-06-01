import dynamic from 'next/dynamic'

export const Tour = dynamic(() => import('reactour'), { ssr: false });

export const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
