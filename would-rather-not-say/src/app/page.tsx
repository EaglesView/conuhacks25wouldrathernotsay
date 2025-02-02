import BackgroundWaves from "@/components/background";
import MenuScreen from "@/components/menu-screen";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#FFD6B0] text-white">
      <BackgroundWaves>
        <MenuScreen />
      </BackgroundWaves>
    </main>
  );
}
