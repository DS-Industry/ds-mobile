const DEFAULT_NAME = 'Мобильный клиент';

export function formatNameUtil(id: string): string {
  return `${DEFAULT_NAME} ${id}`;
}
