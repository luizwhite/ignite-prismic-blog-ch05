const getPtBRMonth = (month: string): string => {
  const monthTable = [
    ['Jan', 'Jan'],
    ['Feb', 'Fev'],
    ['Mar', 'Mar'],
    ['Apr', 'Abr'],
    ['May', 'Mai'],
    ['Jun', 'Jun'],
    ['Jul', 'Jul'],
    ['Aug', 'Ago'],
    ['Sep', 'Set'],
    ['Oct', 'Out'],
    ['Nov', 'Nov'],
    ['Dec', 'Dez'],
  ];

  return monthTable.find(([enMonth]) => enMonth === month)[1];
};

export const parseDate = (date: Date): string => {
  const d = Intl.DateTimeFormat(/* 'pt-BR' */ 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .formatToParts(date)
    .map(({ type, value }) =>
      type === 'literal'
        ? ' '
        : type === 'month'
        ? getPtBRMonth(value).toLowerCase()
        : value,
    );

  const parsedDate = d[2] + d[1] + d[0] + d[3] + d[4];

  return parsedDate;
};

// export const parseDate = (date: Date): string =>
//   Intl.DateTimeFormat('pt-BR', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   })
//     .formatToParts(date)
//     .map(({ type, value }) =>
//       type === 'literal'
//         ? ' '
//         : type === 'month'
//         ? value[0].toUpperCase() + value.substr(1, 2)
//         : value,
//     )
//     .join('');
