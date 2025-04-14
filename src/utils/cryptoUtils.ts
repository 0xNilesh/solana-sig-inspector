import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
export type Network = WalletAdapterNetwork.Devnet | WalletAdapterNetwork.Testnet | WalletAdapterNetwork.Mainnet;

export type ExtractResult = {
  publicKey: string;
  publicKeyHex: string;
  message: string;
  signature: string;
  signatureHex: string;
};

export interface VerifyResult {
  isValid: boolean;
  errorMessage?: string;
}
