export function formatPhoneUtil(phone: string): string {
  return phone.replace(/[^\d\+]/g, '');
}
