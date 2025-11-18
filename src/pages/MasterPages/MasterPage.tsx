import { useNavigate } from "react-router-dom";
import ConfigCard from "../../components/common/ConfigCard";
import { appRoutes } from "../../routes/appRoutes";

export interface ConfigCardtype {
  img: string;
  title: string;
  desc: string;
  btnText: string;
  onAction: () => void;
}

export const MasterPage = () => {
  const navigate = useNavigate();

  const configCards: ConfigCardtype[] = [
    {
      img: "/icons/Master/Vendor.svg",
      title: "Vendors",
      desc: "Register and manage your external suppliers and service providers with ease.",
      btnText: "Configure",
      onAction: () => navigate(appRoutes.masterRoutes.children.vendors),
    },
    {
      img: "/icons/Master/Clients.svg",
      title: "Clients",
      desc: "Manage client entries and access their information quickly and efficiently.",
      btnText: "Configure",
      onAction: () => navigate(appRoutes.masterRoutes.children.clients),
    },
    {
      img: "/icons/Master/Products.svg",
      title: "Products",
      desc: "Catalog, track, and manage your products , items & machines in one page.",
      btnText: "Configure",
      onAction: () => navigate(appRoutes.masterRoutes.children.products),
    },
    {
      img: "/icons/Master/Users.svg",
      title: "Service Engineers",
      desc: "Create and manage system Service-engineers with roles and permissions.",
      btnText: "Configure",
      onAction: () => navigate(appRoutes.masterRoutes.children.users),
    },
    {
      img: "/icons/Master/Spare.svg",
      title: "Machine Spares ",
      desc: "Record and manage spare parts for machines, ensuring quick access for maintenance. ",
      btnText: "Configure",
      onAction: () => navigate(appRoutes.masterRoutes.children.machineSpares),
    },
    {
      img: "/icons/Master/Problem.svg",
      title: "Problem Types",
      desc: "Log and categorize recurring issues related to products, machines, or inventory.",
      btnText: "Configure",
      onAction: () => navigate(appRoutes.masterRoutes.children.problemDetails),
    },
  ];
  return (
    <div className="flex w-full max-w-[1590px] origin-top flex-col gap-8">
      {/* <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div>
            <p className="text-xl font-semibold text-slate-800">
              Configuration
            </p>
          </div>
          <div>
            <p className="text-base font-medium text-slate-500">
              Configure your app and connect the tool your app will need
            </p>
          </div>
        </div>
      </div> */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:mb-0 lg:grid-cols-3">
        {configCards.map((card, index) => (
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

export default MasterPage;
