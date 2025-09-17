import { createWalletClient, custom , createPublicClient} from "https://esm.sh/viem";
import fundMeAbi from "./FundMe.json"
const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
let walletClient;
let publicClient;
const CONTRACT_ADDRESS="0x2416f89c49d617e81bc84bcab0572574dd6495ba";
async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('Connecting');
        walletClient = createWalletClient({  //wallet client basically talks to the user wallet
            transport: custom(window.ethereum)
        });

        try {

            const addresses = await walletClient.requestAddresses();
            console.log("Connected accounts:", addresses); // Log the connected address(es)
            connectButton.innerHTML = `Connected: ${addresses[0].slice(0, 6)}...`; // Show part of address
            console.log("Connection successful!");
        } catch (error) {
            console.error("Connection failed", error);
            connectButton.innerHTML = "Connect";
        }



    } else {
        console.log('No wallet detected');
        connectButton.innerHTML = "Please install metamask"

    }
}

async function fund() {
    const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== 'undefined') {
        console.log('Connecting');
        walletClient = createWalletClient({  //wallet client basically talks to the user wallet
            transport: custom(window.ethereum)
        });

        console.log("Connection successful!", address);


        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        console.log("public client initialised");

        try {
            console.log("Attempting simulation...");
            const simulationResult = await publicClient.simulateContract({
                address: CONTRACT_ADDRESS, 
                abi: fundMeAbi.abi,    
                functionName: 'fund',
                account: address,  
                value:  parseEther(ethAmount),   
            });
            console.log("Simulation successful:", simulationResult);
            // If simulation succeeds, simulationResult.request contains the prepared transaction details
            // We can then pass this to walletClient.writeContract() to send the actual transaction

        } catch (error) {
            console.error("Simulation failed:", error);
            // Handle simulation errors appropriately (e.g., display message to user)
        }

    
    }
}

connectButton.onclick = connect;
fundButton.onclick = fund;
// balanceButton.onclick=getBalance;