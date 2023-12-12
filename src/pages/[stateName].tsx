import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/map'), {
  ssr: false, // Disable server-side rendering
  loading: () => <p>Loading...</p> // Displayed while loading the component
});

export default function State() {
  const router = useRouter();
  const { stateName } = router.query;
  const [data, setData] = useState<any>(null); // State variable to store the fetched data

  useEffect(() => {
    if (stateName) {
      fetch(`/api/states/${stateName}`)
        .then(response => response.json())
        .then(data => setData(data)) // Update the state with the fetched data
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [stateName]);

  return (
    <div className="mx-auto h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg bg-white shadow">
            <p className='font-semibold text-lg'>State: {stateName}</p>
            {data && (
              <div>
                <p className='font-semibold pb-2 text-lg'>Total Population: {data.statePopulation}</p>
                <div>
                  <DynamicMap geoJson={data.geoJsonFeatureCollection}/>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
