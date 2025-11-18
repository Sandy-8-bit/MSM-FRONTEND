type StaffRecord = {
  Sno: number;
  StaffNo: string;
  Name: string;
  Branch: string;
  MobileNo: string;
  Department: string;
  Designation: string;
  DOJ: string; // ISO date string
  CurrentShift: string;
  BiometricNo: string;
  Actions: string;
};

export const staffData: StaffRecord[] = [
  {
    Sno: 1,
    StaffNo: "STF101",
    Name: "Anjali Menon",
    Branch: "Mumbai",
    MobileNo: "9876102345",
    Department: "Marketing",
    Designation: "Marketing Executive",
    DOJ: "2017-09-12",
    CurrentShift: "Morning",
    BiometricNo: "BIO45678",
    Actions: "Edit/Delete"
  },
  {
    Sno: 2,
    StaffNo: "STF102",
    Name: "Ravi Teja",
    Branch: "Delhi",
    MobileNo: "9834567890",
    Department: "Operations",
    Designation: "Operations Manager",
    DOJ: "2016-04-18",
    CurrentShift: "Evening",
    BiometricNo: "BIO78564",
    Actions: "Edit/Delete"
  },
  {
    Sno: 3,
    StaffNo: "STF103",
    Name: "Sneha Kapoor",
    Branch: "Pune",
    MobileNo: "9845098765",
    Department: "Design",
    Designation: "UI/UX Designer",
    DOJ: "2019-11-02",
    CurrentShift: "Night",
    BiometricNo: "BIO34211",
    Actions: "Edit/Delete"
  },
  {
    Sno: 4,
    StaffNo: "STF104",
    Name: "Arun Prakash",
    Branch: "Kochi",
    MobileNo: "9887543210",
    Department: "Support",
    Designation: "Support Engineer",
    DOJ: "2022-01-15",
    CurrentShift: "Morning",
    BiometricNo: "BIO22233",
    Actions: "Edit/Delete"
  },
  {
    Sno: 5,
    StaffNo: "STF105",
    Name: "Divya Ramesh",
    Branch: "Ahmedabad",
    MobileNo: "9823456789",
    Department: "R&D",
    Designation: "Research Analyst",
    DOJ: "2021-06-27",
    CurrentShift: "Evening",
    BiometricNo: "BIO99881",
    Actions: "Edit/Delete"
  },
  {
    Sno: 6,
    StaffNo: "STF106",
    Name: "Naveen Kumar",
    Branch: "Trivandrum",
    MobileNo: "9876001122",
    Department: "Engineering",
    Designation: "Junior Engineer",
    DOJ: "2023-03-10",
    CurrentShift: "Night",
    BiometricNo: "BIO56742",
    Actions: "Edit/Delete"
  },
  {
    Sno: 7,
    StaffNo: "STF107",
    Name: "Fatima Noor",
    Branch: "Nagpur",
    MobileNo: "9867123456",
    Department: "Logistics",
    Designation: "Logistics Supervisor",
    DOJ: "2018-07-22",
    CurrentShift: "Morning",
    BiometricNo: "BIO33445",
    Actions: "Edit/Delete"
  },
  {
    Sno: 8,
    StaffNo: "STF108",
    Name: "Vikram Singh",
    Branch: "Jaipur",
    MobileNo: "9812233445",
    Department: "Security",
    Designation: "Security Officer",
    DOJ: "2015-02-28",
    CurrentShift: "Night",
    BiometricNo: "BIO11122",
    Actions: "Edit/Delete"
  }
];

