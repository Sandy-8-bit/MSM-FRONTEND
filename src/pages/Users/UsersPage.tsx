import { useNavigate } from "react-router-dom";
import ConfigCard from "../../components/common/ConfigCard";
import { appRoutes } from "../../routes/appRoutes";

export const UsersPage = () => {
  const navigate = useNavigate();

  const userConfigCards = [
    {
      img: "icons/Master/create-user.svg", // Make sure the image exists or replace it
      title: "Create User",
      desc: "Add new users to the system and define their basic details of the user.",
      btnText: "Create",
      onAction: () => {navigate(appRoutes.userRoutes.children.createUser)}, // Update this path as per your routing
    },
    {
      img: "icons/Master/assign-role.svg", // Make sure the image exists or replace it
      title: "Assign Role",
      desc: "Assign roles and permissions to users to control access across the app.",
      btnText: "Assign",
      onAction: () => {}, // Update this path as per your routing
    },
  ];

  return (
    <div className="flex w-full max-w-[1590px] origin-top flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userConfigCards.map((card, index) => (
          <ConfigCard
            key={index}
            img={card.img}
            title={card.title}
            desc={card.desc}
            btnText={card.btnText}
            onAction={card.onAction}
          />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
