import React, { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";

// INTERNAL IMPORT
import {
  ChechIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // State Variables
  const [address, setAddress] = useState("");
  const [contractMembership, setContractMembership] = useState([]);
  const [Free, setFree] = useState();
  const [userMembership, setUserMembership] = useState({});

  // Fetch Data on Component Load
  const fetchData = async () => {
    try {
      // Load free trial from local storage
      const freeTrail = localStorage.getItem("freeTrail");
      if (freeTrail) {
        setFree(JSON.parse(freeTrail));
      }

      // Connect with contract and wallet
      const contract = await connectingWithContract();
      const connectAccount = await connectWallet();
      setAddress(connectAccount);

      // Fetch memberships
      const oneMonth = await contract.getMembership(1);
      const sixMonth = await contract.getMembership(2);
      const oneYear = await contract.getMembership(3);

      // Construct membership details
      const contractMembershipList = [
        {
          memberShip_name: oneMonth?.name,
          memberShip_date: oneMonth?.date,
          memberShip_id: oneMonth?.id.toNumber(),
          memberShip_cost: ethers.utils.formatUnits(
            oneMonth?.cost.toString(),
            "ether"
          ),
        },
        {
          memberShip_name: sixMonth?.name,
          memberShip_date: sixMonth?.date,
          memberShip_id: sixMonth?.id.toNumber(),
          memberShip_cost: ethers.utils.formatUnits(
            sixMonth?.cost.toString(),
            "ether"
          ),
        },
        {
          memberShip_name: oneYear?.name,
          memberShip_date: oneYear?.date,
          memberShip_id: oneYear?.id.toNumber(),
          memberShip_cost: ethers.utils.formatUnits(
            oneYear?.cost.toString(),
            "ether"
          ),
        },
      ];

      // Update state with memberships
      setContractMembership(contractMembershipList);

      // Fetch user membership details
      const userMembershipData = await contract.getUserMembership(connectAccount);
      const formattedUserMembership = {
        addressUser: userMembershipData.addressUser.toLowerCase(),
        expireDate: userMembershipData.expireDate,
        cost: ethers.utils.formatUnits(userMembershipData.cost.toString(), "ether"),
        membershipId: userMembershipData.membershipId.toNumber(),
        id: userMembershipData.id.toNumber(),
      };
      setUserMembership(formattedUserMembership);

      // Save user membership to local storage
      localStorage.setItem("UserDetail", JSON.stringify(formattedUserMembership));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const listMembership = async () => {
    try {
      const amount = 12;
      const MEMBERSHIP_NAME = "One Year";
      const MEMBERSHIP_COST = ethers.utils.parseUnits(amount.toString(), "ether");
      const MEMBERSHIP_DATE = "July 31 2024";
      
      const contract = await connectingWithContract();
      const list = await contract.list(
        MEMBERSHIP_NAME,
        MEMBERSHIP_COST,
        MEMBERSHIP_DATE
      );

      await list.wait();
      console.log(list);
    } catch (error) {
      console.error("Error listing membership:", error);
    }
  };

  const buyMembership = async (memberShip_id) => {
    try {
      const contract = await connectingWithContract();
      const connectAccount = await connectWallet();
      setAddress(connectAccount);

      let expiredDate = "";
      let money = "";

      if (memberShip_id === 1) {
        expiredDate = calculateExpiryDate(1);
        money = ethers.utils.parseEther("1");
      } else if (memberShip_id === 2) {
        expiredDate = calculateExpiryDate(6);
        money = ethers.utils.parseEther("3");
      } else {
        expiredDate = calculateExpiryDate(12);
        money = ethers.utils.parseEther("5");
      }

      const mintTransaction = await contract.mint(
        memberShip_id,
        connectAccount,
        expiredDate.toString(),
        {
          value: money.toString(),
        }
      );

      await mintTransaction.wait();
      localStorage.setItem("freeTrail", JSON.stringify("Pro Member"));
      console.info("contract call success", mintTransaction);
      window.location.reload();
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  const calculateExpiryDate = (months) => {
    const today = Date.now() + months * 30 * 24 * 60 * 60 * 1000;
    return new Date(today).toLocaleDateString("en-US");
  };

  return (
    <StateContext.Provider
      value={{
        listMembership,
        buyMembership,
        connectWallet,
        Free,
        address,
        contractMembership,
        userMembership,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
