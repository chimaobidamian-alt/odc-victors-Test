"use client";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanks ${name}, we received your message!`);
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-3 rounded" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="w-full border p-3 rounded" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <textarea className="w-full border p-3 rounded h-32" placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} required />
        <button className="bg-black text-white px-6 py-3 rounded w-full">Send Message</button>
      </form>
    </div>
  );
}
