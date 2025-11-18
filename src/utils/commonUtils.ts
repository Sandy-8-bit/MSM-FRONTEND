export const formatAadhar = (value: string) => {
  // Remove all spaces first
  const digits = value.replace(/\s/g, "");
  // Insert space after every 4 digits
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const getMaxDateFromToday = (days: number) => {
  const today = new Date();
  today.setDate(today.getDate() + days); // Go forward 2 days
  return today.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
};

export const getMinDateFromToday = (days: number) => {
  const today = new Date();
  today.setDate(today.getDate() - days); // Go back 2 days
  return today.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
};

export const generateReferenceNumber = (prefix: string) => {
  const now = new Date();
  const datePart = now.toISOString().split("T")[0].replace(/-/g, "");
  
  const randomPart = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number

  return `${prefix}-${datePart}-${randomPart}`;
};


export const get18YearsAgo = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split("T")[0]; // format: YYYY-MM-DD
};

import dayjs from "dayjs";

export const convertToBackendDate = (date: string) => {
  return dayjs(date).format("DD-MM-YYYY");
};

export const convertToFrontendDate = (backendDate: string): string => {
  const [dd, mm, yyyy] = backendDate.split("-");
  return `${yyyy}-${mm}-${dd}`;
};

const calculateAge = (dob: string): number => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();

  // 🛡️ Block future dates
  if (birthDate > today) return 0;

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) age--;

  return age;
};

export default calculateAge;
