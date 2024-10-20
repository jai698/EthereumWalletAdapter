import './App.css'
import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { useState } from 'react'

const queryClient = new QueryClient()

const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
})

import { useConnect } from 'wagmi'

function WalletOptions() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ))
}

function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const { data: balance } = useBalance({
    address,
  })

  return (
    <div>
      {address && (
        <div>
          Your address - {address}
          <br />
          <br />
          Your balance - {balance?.formatted}
          <br />
          <br />
        </div>
      )}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}


export function SendTransaction() {
  const { data: hash, sendTransaction } = useSendTransaction()

  async function sendTx() {
      const to = document.getElementById("to").value;
      const value = document.getElementById("value").value;
      sendTransaction({ to, value: parseEther(value) });
  }

  // Todo: use refs here
  return <div>
    <p>Send to:</p>
    <input id="to" placeholder="0xA0Cf…251e" required />
    <p>Amount:</p>
    <input id="value" placeholder="0.01" required />
    <br /><br />
    <button onClick={sendTx}>Send</button>
    {hash && <div>Transaction Hash: {hash}</div>}
  </div>
}

function App() {
  return (
    <div className="App">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <WalletOptions />
          <br />
          <br />
          <SendTransaction />
          <br />
          <Account />
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}

export default App
