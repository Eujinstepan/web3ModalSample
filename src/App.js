import { useState } from 'react';
import useWeb3Modal from './hooks/useWeb3Modal'
import { truncateAddress } from "./utils";
import Web3 from 'web3';

import BEP20ABI from './config/abi.json'

export default function Home() {

  const { account, connectWallet, disconnect, switchNetwork, error, chainId } = useWeb3Modal()

  const [amount, setAmount] = useState(0)

  const tokenAddress = "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3" // BUSD
  const web3 = new Web3(Web3.givenProvider)
  const tokenContract = new web3.eth.Contract(BEP20ABI, tokenAddress);
  const toAddress = "0x5A97e36aEF195CB7519fc8dfE77bB646AfA805b6"

  const handleChange = (e) => {
    setAmount(Number(e.target.value))
  }

  const handlePay = async () => {
    const amountInWei = amount * (10 ** 18)
    await tokenContract.methods.transfer(toAddress, amountInWei.toLocaleString('en-US', { useGrouping: false }))
      .send({ from: account })
  }

  return (
    <>
      <span>
        {!account ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <button onClick={disconnect}>Disconnect</button>
        )}
      </span>
      <span>{`Account: ${truncateAddress(account)}`}</span>
      <button onClick={switchNetwork}>Switch Network</button>
      <span>{error ? error.message : null}</span>
      <br />
      <br />
      <span>token address: {tokenAddress}</span>
      <br />
      <br />
      <input type={"number"} style={{ width: "300px"}} onChange={handleChange} placeholder="Input number of amount to transfer" />
      <br />
      <br />
      {account && <button onClick={handlePay}>Pay</button>}
    </>
  );
}
