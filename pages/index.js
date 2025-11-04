
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
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('https://i.ibb.co/HpqV3ZKx/Arc.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          padding: "40px 60px",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <h1 style={{ marginBottom: 20 }}>🪪 ARC Name Service</h1>
        <h3 style={{ marginBottom: 30 }}>Testnet (.arc)</h3>

        <div style={{ marginBottom: 40 }}>
          <h3>Register a Name</h3>
          <input
            placeholder="example: hakan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              marginTop: 8,
            }}
          />
          <button
            onClick={registerName}
            disabled={loading || !name}
            style={{
              marginTop: 12,
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#3b82f6",
              color: "white",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </div>

        <div>
          <h3>Resolve a Name</h3>
          <input
            placeholder="example: hakan"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              marginTop: 8,
            }}
          />
          <button
            onClick={resolveName}
            disabled={loading || !query}
            style={{
              marginTop: 12,
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#22c55e",
              color: "white",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {loading ? "Processing..." : "Resolve"}
          </button>

          {result && (
            <p style={{ marginTop: 20, wordBreak: "break-all" }}>
              <b>{query}.arc</b> address: <code>{result}</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
