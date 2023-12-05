// Home page

export default function Home() {
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Lousiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montanta",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennslyvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virgina",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ];

  const handleStateSelection = (e: any) => {
    const stateName = e.target.value;
    window.location.href = `/${stateName}`;
  };

  return (
    <div className="-mt-24 flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center font-semibold">
        <p className="pb-2">
          Select a state to get started:
        </p>
        <select 
          onChange={(e) => {handleStateSelection(e)}}
          className="bg-gray-50 border border-gray-700 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        >
          {states.map((state, index) => {
            return <option key={index} value={state}>{state}</option>
          })}
        </select>
      </div>
    </div>
  )
}
