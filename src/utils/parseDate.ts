export const parseDate = (date: Date): string =>
  Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .formatToParts(date)
    .map(({ type, value }) =>
      type === 'literal'
        ? ' '
        : type === 'month'
        ? value[0].toUpperCase() + value.substr(1, 2)
        : value,
    )
    .join('');
