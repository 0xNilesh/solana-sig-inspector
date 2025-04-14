import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from '@/components/CopyButton';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function SignTab() {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [msgHex, setMsgHex] = useState<string | null>(null);
  const [pubKeyHex, setPubKeyHex] = useState<string | null>(null);
  const [signatureHex, setSignatureHex] = useState<string | null>(null);
  const [signedMsgBase58, setSignedMsgBase58] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { publicKey, signMessage } = useWallet();
  const [showResults, setShowResults] = useState(false);

  const handleSign = async () => {
    if (!publicKey || !signMessage) return;

    setLoading(true);
    try {
      const encodedMessage = new TextEncoder().encode(message); // Encode the message before signing
      const signed = await signMessage(encodedMessage);
      const pubKeyBytes = publicKey.toBytes();

      const signedMessageBytes = new Uint8Array(encodedMessage.length + signed.length);
      signedMessageBytes.set(encodedMessage, 0); // Add the original message
      signedMessageBytes.set(signed, encodedMessage.length); // Add the signature

      setSignature(bs58.encode(signed)); // Base58 encode the signature
      setSignatureHex(Buffer.from(signed).toString('hex'));
      setMsgHex(Buffer.from(encodedMessage).toString('hex')); // Hex format for the encoded message
      setPubKeyHex(Buffer.from(pubKeyBytes).toString('hex')); // Hex format for the public key

      // Show signed message bytes in both Hex and Base58
    setSignedMsgBase58(bs58.encode(signedMessageBytes)); // Base58 format for the signed message

      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <Card className="crypto-card">
        <CardHeader>
          <CardTitle>Sign Message</CardTitle>
          <CardDescription>
            Connect your Solana wallet to sign a message
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!publicKey ? (
            <WalletMultiButton className="bg-gradient-to-r from-solana to-solana-dark hover:opacity-90" />
          ) : (
            <>
              <WalletMultiButton className="bg-gradient-to-r from-solana to-solana-dark hover:opacity-90" />

              <div className="space-y-2">
                <Label htmlFor="walletAddress">Connected Wallet</Label>
                <div className="flex items-center gap-2">
                  <div id="walletAddress" className="hex-display">
                    {publicKey.toString()}
                  </div>
                  <CopyButton text={publicKey.toString() || ''} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageInput">Message to Sign</Label>
                <Textarea
                  id="messageInput"
                  placeholder="Enter message to sign..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="font-mono"
                />
              </div>

              <Button
                onClick={handleSign}
                disabled={loading || !message}
                className="w-full bg-gradient-to-r from-solana to-solana-dark hover:opacity-90"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sign Message
              </Button>

              {showResults && signature && (
                <div className="mt-6 pt-6 border-t border-border/50">
                  <h3 className="text-lg font-medium mb-4">Signature Results</h3>

                  <Tabs defaultValue="base58" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="base58">Base58</TabsTrigger>
                      <TabsTrigger value="hex">Hex</TabsTrigger>
                    </TabsList>

                    <TabsContent value="base58" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Public Key (Base58)</Label>
                          <CopyButton text={publicKey.toString() || ''} />
                        </div>
                        <div className="hex-display">{publicKey.toString()}</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Message</Label>
                          <CopyButton text={msgHex} />
                        </div>
                        <div className="hex-display">
                          {msgHex}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Signature (Base58)</Label>
                          <CopyButton text={signature} />
                        </div>
                        <div className="hex-display">{signature}</div>
                      </div>
                    </TabsContent>

                    <TabsContent value="hex" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Public Key (Hex)</Label>
                          <CopyButton text={pubKeyHex || ''} />
                        </div>
                        <div className="hex-display">{pubKeyHex}</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Message</Label>
                          <CopyButton text={msgHex || ''} />
                        </div>
                        <div className="hex-display">{msgHex}</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Signature (Hex)</Label>
                          <CopyButton text={signatureHex || ''} />
                        </div>
                        <div className="hex-display">{signatureHex}</div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
