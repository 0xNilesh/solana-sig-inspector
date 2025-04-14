
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/CopyButton';
// import { extractFromTransactionHash, ExtractResult } from '@/utils/cryptoUtils';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NetworkSelector } from '@/components/NetworkSelector';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNetwork } from '@/hooks/useNetwork';
import { useConnection } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { ExtractResult } from '@/utils/cryptoUtils';

export function ExtractTab() {
  const [transactionHash, setTransactionHash] = useState('');
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [loading, setLoading] = useState(false);
  const {network, setNetwork} = useNetwork();
  const { connection } = useConnection();

  const handleExtract = async () => {
    setLoading(true);
    try {
      const tx = await connection.getTransaction(transactionHash);
      if (!tx) {
        console.error('Transaction not found');
        return;
      }
  
      const signatureBase58 = tx.transaction.signatures[0];
      const publicKeyBase58 = tx.transaction.message.accountKeys[0].toBase58();
      const messageBuffer = tx.transaction.message.serialize();
  
      const signatureHex = Buffer.from(bs58.decode(signatureBase58)).toString('hex');
      const publicKeyHex = Buffer.from(bs58.decode(publicKeyBase58)).toString('hex');
      const messageHex = Buffer.from(messageBuffer).toString('hex');
  
      setResult({
        publicKey: publicKeyBase58,
        publicKeyHex,
        message: messageHex,
        signature: signatureBase58,
        signatureHex,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <Card className="crypto-card">
        <CardHeader>
          <CardTitle>Extract Transaction Data</CardTitle>
          <CardDescription>
            Enter a Solana transaction hash to extract signature components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NetworkSelector network={network} onChange={setNetwork} />
          
          <div className="space-y-2">
            <Label htmlFor="txHash">Transaction Hash</Label>
            <div className="flex gap-2">
              <Input
                id="txHash"
                placeholder="Enter transaction hash..."
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                className="font-mono"
              />
              <Button onClick={handleExtract} disabled={loading || !transactionHash}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Extract
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <h3 className="text-lg font-medium mb-4">Extraction Results</h3>
              
              <Tabs defaultValue="base58" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="base58">Base58</TabsTrigger>
                  <TabsTrigger value="hex">Hex</TabsTrigger>
                </TabsList>
                
                <TabsContent value="base58" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pubkey-base58">Public Key (Base58)</Label>
                      <CopyButton text={result.publicKey} />
                    </div>
                    <div id="pubkey-base58" className="hex-display">
                      {/* In a real app, convert from hex to base58 */}
                      {result.publicKey.substring(0, 44)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message-base58">Message</Label>
                      <CopyButton text={result.message} />
                    </div>
                    <div id="message-base58" className="hex-display">
                      {/* In a real app, convert from hex to base58 */}
                      {result.message}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signature-base58">Signature (Base58)</Label>
                      <CopyButton text={result.signature} />
                    </div>
                    <div id="signature-base58" className="hex-display">
                      {/* In a real app, convert from hex to base58 */}
                      {result.signature}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="hex" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pubkey-hex">Public Key (Hex)</Label>
                      <CopyButton text={result.publicKey} />
                    </div>
                    <div id="pubkey-hex" className="hex-display">
                      {result.publicKeyHex}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message-hex">Message</Label>
                      <CopyButton text={result.message} />
                    </div>
                    <div id="message-hex" className="hex-display">
                      {result.message}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signature-hex">Signature (Hex)</Label>
                      <CopyButton text={result.signature} />
                    </div>
                    <div id="signature-hex" className="hex-display">
                      {result.signatureHex}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}