type ParsedPhone = { number: string; code: string; number_code: string };

export const parsePhone = (number: string): ParsedPhone => {
  if (!number)
    return {
      number: '',
      code: '',
      number_code: '',
    };
  const res = {
    number: number.substring(number.indexOf(')') + 2),
    code: number.split(' ', 1)[0]?.replace('(', '').replace(')', ''),
    number_code: '',
  };
  res.number_code = (res.code + res.number).replaceAll(' ', '');
  return res;
};

export const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find((key: string) => object[key] === value);
};
