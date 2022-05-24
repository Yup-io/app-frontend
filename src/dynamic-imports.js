import dynamic from 'next/dynamic'

export const Tour = dynamic(() => import('reactour'), { ssr: false });
