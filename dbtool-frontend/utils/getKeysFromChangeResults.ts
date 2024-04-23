import { ChangeResults } from '../interfaces/ChangeResults';

const getKeysFromChangeResults = (changeResults: ChangeResults): string[] => {
  const allKeys = [
    ...Object.keys(changeResults.inserted),
    ...Object.keys(changeResults.updated),
    ...Object.keys(changeResults.deleted),
  ];

  const uniqueSortedKeys = Array.from(new Set(allKeys)).sort();

  console.log({ allKeys, uniqueSortedKeys });

  return uniqueSortedKeys;
};

export default getKeysFromChangeResults;
