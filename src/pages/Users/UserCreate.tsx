import { useState, useEffect } from "react";
import type { UserDetails ,UserTabel} from "../../types/userTypes";
import Input from "@/components/common/Input";
import DropdownSelect from "@/components/common/DropDown";
import { useCreateServiceEntry,useFetchUsers } from "../../queries/UserQueries/UserQuery";
import {
  useFetchServiceEngineerOptions,
  useFetchServiceEngineerById,
} from "../../queries/masterQueries/ServiceEngineersQuery";
import ButtonSm from "@/components/common/Buttons";

const UserCreate = () => {
  const dummyData: UserDetails = {
    username: "",
    password: "",
    role: "",
    serviceEngineerId: 0,
  };

  const [formData, setFormData] = useState<UserDetails>(dummyData);
  const [confirmPassword, setConfirmPassword] = useState("");

const hasEngineerId = formData.serviceEngineerId > 0;


  // Dropdown options for engineers
  const { data: engineerOptions = [] } = useFetchServiceEngineerOptions();

const { data: engineerDetails } = useFetchServiceEngineerById(
  formData.serviceEngineerId,
  { enabled: hasEngineerId }
);

// Autofill username when engineer is selected
useEffect(() => {
  if (formData.serviceEngineerId > 0 && engineerDetails?.engineerName) {
    setFormData((prev) => ({
      ...prev,
      username: prev.username || engineerDetails.engineerName, // only autofill if empty
    }));
  }
}, [formData.serviceEngineerId, engineerDetails]);

  // Dropdown options for roles
  const roleOptions = [
    { id: 1, label: "ADMIN" },
    { id: 2, label: "SERVICE" },
    { id: 3, label: "CLIENT" },
  ];

  // Handle form submission
  const { mutate: createUser } = useCreateServiceEntry();

  const handleSubmit = () => {
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Final User Data:", formData);
    createUser(formData);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {/* Engineer Dropdown */}
        <DropdownSelect
          title="Select Engineer"
          required
          options={engineerOptions}
          selected={
            engineerOptions.find(
              (opt) => opt.id === formData.serviceEngineerId,
            ) || {
              id: 0,
              label: "Select Engineer",
            }
          }
          onChange={(val) =>
            setFormData({ ...formData, serviceEngineerId: val.id })
          }
        />

        {/* Username - Editable now ✅ */}
        <Input
          required
          title="Username"
          inputValue={formData.username}
          onChange={(val) => setFormData({ ...formData, username: val })}
        />

        {/* Password */}
        <Input
          required
          title="Password"
          inputValue={formData.password}
          onChange={(val) => setFormData({ ...formData, password: val })}
        />

        {/* Confirm Password */}
        <Input
          required
          title="Confirm Password"
          inputValue={confirmPassword}
          onChange={(val) => setConfirmPassword(val)}
        />

        {/* Role Dropdown */}
        <DropdownSelect
          title="Role"
          required
          options={roleOptions}
          selected={
            roleOptions.find((opt) => opt.label === formData.role) || {
              id: 0,
              label: "Select Role",
            }
          }
          onChange={(val) => setFormData({ ...formData, role: val.label })}
        />

        {/* Disabled Number */}
        <Input
          title="Number"
          disabled
          inputValue={engineerDetails?.engineerMobile?.toString() || ""}
          onChange={() => {}}
        />
      </div>

      <div className="mt-2 w-full justify-end">
        {/* Submit Button */}
        <ButtonSm
          className="col-span-3 rounded bg-blue-600 p-2 text-white"
          onClick={handleSubmit}
          type="submit"
          text="Create User"
          state="default"
        />
      </div>
    </>
  );
};

export default UserCreate;
