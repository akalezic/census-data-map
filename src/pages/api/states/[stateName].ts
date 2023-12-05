import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/ds';

type Data = {
  // Define the type according to the data you expect to return
  data: any;
  error?: string;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Getting the statename from the url route params
  const { stateName } = req.query;
  console.log(stateName);
  // Connect to MongoDB
  const db = await connectToDatabase();
  // Get the FIPS code for the state
  const fipsMappingCollection = db.collection('mapping');
  const result = await fipsMappingCollection.findOne(
    // Use a regex to match the state name case-insensitively
    { StateName: { $regex: new RegExp(`^${stateName}$`, 'i') } },
    // Only return the StateFIPS field, exclude id field which automatically gets returned
    { projection: { StateFIPS: 1, _id: 0 } }
  );

  // If no result, return 404
  if (!result) {
    res.status(404).json({ data: null, error: 'State Name Not Found' });
    return;
  }

  try {
    /* Use the StateFIPS code from the mapping table to get the total population (B01001_001E)
    and median income (B19013_001E) data for all counties in the state
    If you want to return state and county names add NAME, after get=
    */
    const apiUrl = `https://api.census.gov/data/2021/acs/acs5?get=B01001_001E,B19013_001E&for=county:*&in=state:${result.StateFIPS}&key=${process.env.CensusAPIKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch census data');
    }
    const censusData = await response.json();
    console.log(censusData)
    const geojsonCollection = db.collection('geojson');
    // const geojsonData = await geojsonCollection.find({ _id: new ObjectId(result.StateFIPS) });
    
    const geojsonArrayResult = await geojsonCollection.aggregate([
      {
        $match: {
          "properties.STATE": result.StateFIPS
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ]).toArray();
    
    let statePopulation = 0;
    // Iterate through censusData and sum total population from each county
    censusData.forEach((data:any) => {
      const total_population = data[0]; // Total population is the first item

      // First item is the header row, so need to account for a string
      if (!isNaN(total_population)) {
        statePopulation += parseInt(total_population);
      }
    });

    // Create a mapping function to merge the data from the api and the geojson
    const mergedData = geojsonArrayResult.map((feature) => {
      // Find the matching data from the API results based on county FIPS code
      const matchingData = censusData.find(
        (data:any) =>
          data[2] === feature.properties.STATE &&
          data[3] === feature.properties.COUNTY // Compare api FIPS code with county FIPS code
      );

      // Merge the data if a match is found
      if (matchingData) {
        // Extract the relevant data from the API result array
        const total_population = matchingData[0]; // Total population is the first item
        const median_household_income = matchingData[1]; // Median income is the second item

        return {
          ...feature,
          properties: {
            ...feature.properties,
            total_population,
            median_household_income,
          },
        };
      }

      // If no match is found, return the original feature
      return feature;
    });
    res.status(200).json({ mergedData, statePopulation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: null, error: 'Internal Server Error' });
  }
}
