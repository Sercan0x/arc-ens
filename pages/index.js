import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ARC_RPC = process.env.NEXT_PUBLIC_ARC_RPC;

const ABI = [
  "function register(string name) public",
  "function resolve(string name) public view returns (address)"
];

export default function Home() {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function registerName() {
    try {
      if (!window.ethereum) return alert("MetaMask is required!");
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.register(name);
      await tx.wait();
      alert(`${name}.arc has been successfully registered!`);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resolveName() {
    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider(ARC_RPC);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const address = await contract.resolve(query);
      setResult(
        address === "0x0000000000000000000000000000000000000000"
          ? "Not registered"
          : address
      );
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
        marginTop: 50,
        backgroundImage: "url('https://i.ibb.co/HpqV3ZKx/Arc.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        color: "#fff"
      }}
    >
      <div
        style={{
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: 20,
          display: "inline-block",
          padding: "40px 60px"
        }}
      >
        <h1>🪪 ARC Name Service</h1>
        <h3>Testnet (.arc)</h3>

        {/* Register Section */}
        <div style={{ marginTop: 30 }}>
          <h3>Register a Name</h3>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <input
              placeholder="example: sercan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: 10,
                width: 280,
                borderRadius: 8,
                border: "1px solid #ccc",
                textAlign: "center"
              }}
            />
            <button
              onClick={registerName}
              disabled={loading || !name}
              style={{
                width: 280,
                padding: 10,
                borderRadius: 8,
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </div>
        </div>

        {/* Resolve Section */}
        <div style={{ marginTop: 50 }}>
          <h3>Resolve a Name</h3>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <input
              placeholder="example: sercan"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                padding: 10,
                width: 280,
                borderRadius: 8,
                border: "1px solid #ccc",
                textAlign: "center"
              }}
            />
            <button
              onClick={resolveName}
              disabled={loading || !query}
              style={{
                width: 280,
                padding: 10,
                borderRadius: 8,
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {loading ? "Processing..." : "Resolve"}
            </button>
          </div>

          {result && (
            <p style={{ marginTop: 20, color: "#fff" }}>
              <b>{query}.arc</b> address: <code>{result}</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
