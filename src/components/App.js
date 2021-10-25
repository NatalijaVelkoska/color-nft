import React, { Component, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import Color from "../abis/Color.json";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  const [colors, setColors] = useState([]);
  const [currColor, setCurrCOlor] = useState("");
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-ethereum browser detected. You should consider trying metamask"
      );
    }
  }

  // function mint(color) {
  //   console.log(color);
  // }

  async function loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    setAccount(accounts[0]);

    //we need the network id to find the address and we need the abi and address for the contract
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    const networkData = Color.networks[networkId];
    if (networkData) {
      const address = networkData.address;
      const abi = Color.abi;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
      const totalTokens = await contract.methods.totalSupply().call();
      console.log(totalTokens.toNumber());
      setTotalSupply(totalTokens);

      //Load Colors
      const colors = [];
      for (var i = 1; i <= totalTokens; i++) {
        const color = await contract.methods.colors(i - 1).call();
        console.log(color);
        colors.push(color);
      }

      setColors(colors);

      console.log(colors);
    } else {
      window.alert("Smart Contract not deployed to detected network");
    }
  }

  // mint = (color) => {

  // };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(currColor);
    contract.methods
      .mint(currColor)
      .send({ from: account })
      .on("confirmation", function() {
        console.log("test");
        setColors([...colors, currColor]);
      });
    // .on("receipt", (receipt) => {
    //   console.log("test");
    //   console.log(receipt);
    // });

    // setCurrCOlor(this.color.value);
    //this.mint(currColor);
  };

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Color Tokens
        </a>
        <ul>
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">
              <span id="account">{account}</span>
            </small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  className="form-control mb-1"
                  placeholder="e.g #FFFFFF"
                  value={currColor}
                  onChange={(e) => setCurrCOlor(e.target.value)}
                />
                <input
                  type="submit"
                  className="btn btn-block btn-primary"
                  value="MINT"
                />
              </form>
            </div>
          </main>
        </div>
        <hr />
        <div className="row text-center">
          {colors.map((color, key) => {
            return (
              <div key={key} className="col-md-3 mb-3">
                <div className="token" style={{ backgroundColor: color }}></div>
                <div>{color}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default App;
