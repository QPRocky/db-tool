const getTextColorForTracking = (value: any, isJsonString: boolean) => {
  let textColor = '#fff';

  if (value === null) textColor = 'gray.500';
  if (isJsonString) textColor = 'yellow.500';

  return textColor;
};

export default getTextColorForTracking;
