import { useEffect, useState } from "react";
import { Crypto } from "../Types";

export type AppProps = {
  crypto: Crypto;
  updateOwned: (crypto: Crypto, amount: number) => void;
};

export default function CryptoSummary({
  crypto,
  updateOwned,
}: AppProps): JSX.Element {
  useEffect(() => {
    console.log(crypto.name, amount, crypto.current_price * amount);
  });

  const [amount, setAmount] = useState<number>(NaN);

  return (
    <>
      <div>
        <span>{crypto.name + " $" + crypto.current_price}</span>;
        <input 
        title = 'hello'
          type="number"
          style={{ margin: 10 }}
          value={amount}
          onChange={(e) => {
            setAmount(parseFloat(e.target.value));
            updateOwned(crypto, parseFloat(e.target.value));
            //set the parents state calling a function passed as prop
          }}
        ></input>
        <p>
          {isNaN(amount) ? '$0.00' : '$' + 
          (crypto.current_price * amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </>
  );
}
