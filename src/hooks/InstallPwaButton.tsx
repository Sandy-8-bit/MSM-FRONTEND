import { usePwaInstall } from "./usePwaInstall";

const InstallButton = () => {
  const { isInstallable, promptInstall } = usePwaInstall();

  if (!isInstallable) return null;

  return (
    <button
      onClick={promptInstall}
      className="rounded-md bg-blue-600 px-4 py-2 text-lg text-black shadow-md"
    >
      Install App
    </button>
  );
};

export default InstallButton;
