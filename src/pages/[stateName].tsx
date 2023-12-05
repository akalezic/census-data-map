import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/map'), {
  ssr: false, // Disable server-side rendering
});

export default function State() {
  const router = useRouter();
  const { stateName } = router.query;
  const [data, setData] = useState<any>(null); // State variable to store the fetched data

  useEffect(() => {
    console.log(stateName)
    if (stateName) {
      console.log(stateName)
      fetch(`/api/states/${stateName}`)
        .then(response => response.json())
        .then(data => setData(data)) // Update the state with the fetched data
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [stateName]);

  return (
    <div className="-mt-24 flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div>
        <div className="relative z-10 mx-auto max-w-2xl justify-center align-middle lg:max-w-none">
          <p className='font-semibold'>State: {stateName}</p>
          {data && <p className='font-semibold'>Total Population: {data.statePopulation}</p>}
          <div className="grid grid-rows-2 py-8 xl:py-10 ">
            <DynamicMap />
          </div>
        </div>
      </div>
    </div>
  );
}
