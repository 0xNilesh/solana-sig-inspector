import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Network } from '@/utils/cryptoUtils';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

interface NetworkSelectorProps {
  network: Network;
  onChange: (network: Network) => void;
}

export function NetworkSelector({ network, onChange }: NetworkSelectorProps) {
  const handleNetworkChange = (value: string) => {
    switch (value) {
      case 'mainnet-beta':
        onChange(WalletAdapterNetwork.Mainnet);
        break;
      case 'testnet':
        onChange(WalletAdapterNetwork.Testnet);
        break;
      case 'devnet':
        onChange(WalletAdapterNetwork.Devnet);
        break;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="network-select">Network</Label>
      <Select value={network} onValueChange={handleNetworkChange}>
        <SelectTrigger id="network-select" className="w-full">
          <SelectValue placeholder="Select network" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mainnet-beta">Mainnet</SelectItem>
          <SelectItem value="testnet">Testnet</SelectItem>
          <SelectItem value="devnet">Devnet</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
