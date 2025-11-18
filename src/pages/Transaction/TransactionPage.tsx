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

export const TransactionPage = () => {
  const navigate = useNavigate();

  const configCards: ConfigCardtype[] = [
    {
      img: "/icons/Master/machine-entry.svg",
      title: "Machine Entry",
      desc: "Register and manage your external suppliers and service providers.",
      btnText: "Configure",
      onAction: () =>
        navigate(appRoutes.transactionRoutes.children.machineEntry),
    },
    {
      img: "/icons/Master/service-request.svg",
      title: "Service Request",
      desc: "Manage and track service requests, client information, and support history efficiently.",
      btnText: "Configure",
      onAction: () =>
        navigate(appRoutes.transactionRoutes.children.serviceRequest),
    },
    {
      img: "/icons/Master/service-entry.svg",
      title: "Service Entry",
      desc: "Catalog, track, and manage your machines, products or items all in one page.",
      btnText: "Configure",
      onAction: () =>
        navigate(appRoutes.transactionRoutes.children.serviceEntry),
    },
  ];
  return (
    <div className="flex w-full max-w-[1590px] origin-top flex-col gap-8">
      {/* <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div>
            <p className="text-xl font-semibold text-slate-800">
              Transaction Configuration
            </p>
          </div>
          <div>
            <p className="text-base font-medium text-slate-500">
              Configure your app and connect the tool your app will need
            </p>
          </div>
        </div>
      </div> */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

export default TransactionPage;
