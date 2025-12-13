'use client'; // Client Component (runs in browser)
import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState<{ message: string } | null>(null);


  const fetchData = async () => {
    fetch('http://localhost:5000/api/status')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Backend connection failed", err));
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">DevOps Practice App</h1>
      <div className="mt-5 p-5 border rounded bg-gray-100 text-black">
        Status: {data ? data.message : "Loading..."}
      </div>
    </main>
  );
}