import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther } from "https://esm.sh/viem";
import { fundMeAbi } from "./FundMe.js"
const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
let walletClient;
let publicClient;
const CONTRACT_ADDRESS = "0x0165878A594ca255338adfa4d48449f69242Eb8F";


// 6:24

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

        const [connectedAccount] = await walletClient.requestAddresses()
        const currentChain = await getCurrectChain(walletClient);
        console.log("Connection successful!", connectedAccount);


        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        console.log("public client initialised");

        try {
            console.log("Attempting simulation...");
            const { request } = await publicClient.simulateContract({
                address: CONTRACT_ADDRESS,
                abi: fundMeAbi,
                functionName: 'fund',
                account: connectedAccount,
                chain: currentChain,
                value: parseEther(ethAmount),
            });
            console.log("Simulation successful:", request);
            // If simulation succeeds, simulationResult.request contains the prepared transaction details
            // We can then pass this to walletClient.writeContract() to send the actual transaction


            const hash = await walletClient.writeContract(request)
            console.log(hash)


        } catch (error) {
            console.error("Simulation failed:", error);
            // Handle simulation errors appropriately (e.g., display message to user)
        }


    }
}
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        try {
            const balance = await publicClient.getBalance({
                address: CONTRACT_ADDRESS
            });
            const formattedBalance = formatEther(balance);

            // Log the formatted balance to the console
            console.log(`Contract Balance: ${formattedBalance} ETH`);
            // You could update a UI element here instead of logging

        } catch (error) {
            // Handle potential errors during the asynchronous call
            console.error("Error getting balance:", error);
        }
    }
}
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        try {
            // Create clients
            walletClient = createWalletClient({
                transport: custom(window.ethereum)
            });

            publicClient = createPublicClient({
                transport: custom(window.ethereum)
            });

            // Get the connected account
            const [connectedAccount] = await walletClient.requestAddresses();
            const currentChain = await getCurrectChain(walletClient);

            console.log("Withdrawing from contract using:", connectedAccount);

            // Simulate the withdraw call
            const { request } = await publicClient.simulateContract({
                address: CONTRACT_ADDRESS,
                abi: fundMeAbi,
                functionName: "withdraw",
                account: connectedAccount,
                chain: currentChain
            });

            console.log("Simulation successful, sending tx:", request);

            // Execute transaction
            const hash = await walletClient.writeContract(request);
            console.log("Withdraw tx sent, hash:", hash);

        } catch (error) {
            console.error("Withdraw failed:", error);
        }
    } else {
        console.log("No wallet detected");
    }
}



async function getCurrectChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
        id: chainId,
        name: "Custom Chain",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },

        rpcUrls: {
            default: {
                http: ["http://localhost:8545"]
            }
        },

    })
    return currentChain;
}
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
