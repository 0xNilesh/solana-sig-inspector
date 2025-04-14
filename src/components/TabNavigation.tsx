
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="w-full mb-8">
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger 
            value="extract" 
            className={cn(
              "text-sm font-medium transition-all",
              activeTab === "extract" && "text-solana"
            )}
          >
            Extract
          </TabsTrigger>
          <TabsTrigger 
            value="sign" 
            className={cn(
              "text-sm font-medium transition-all",
              activeTab === "sign" && "text-solana"
            )}
          >
            Sign
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
