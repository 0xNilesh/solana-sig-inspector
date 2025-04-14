import { useState } from "react";
import { TabNavigation } from "@/components/TabNavigation";
import { ExtractTab } from "@/components/ExtractTab";
import { SignTab } from "@/components/SignTab";
import { NetworkProvider } from "@/hooks/useNetwork";
import { WalletAdapter } from "@/components/WalletAdapter";

const Index = () => {
  const [activeTab, setActiveTab] = useState("extract");

  return (
    <NetworkProvider>
      <WalletAdapter>
      <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
        <header className="w-full max-w-xl mb-4 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-solana to-solana-secondary bg-clip-text text-transparent">
            Solana Sig Inspector
          </h1>
          <p className="text-muted-foreground mt-1 mb-6">
            Sign and extract Solana signature data
          </p>
        </header>

        <main className="w-full max-w-xl flex flex-col items-center">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "extract" && <ExtractTab />}
          {activeTab === "sign" && <SignTab />}
        </main>
      </div>
      </WalletAdapter>
    </NetworkProvider>
  );
};

export default Index;
