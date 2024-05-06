export const generatePassword = async () => {
  const randomString = Math.random().toString(36).slice(-16); // Generate random string
  return randomString;
};
