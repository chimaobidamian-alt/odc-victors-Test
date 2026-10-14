import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { ink:"#171512", cocoa:"#5B3827", leather:"#9B6847", sand:"#D7B58A", cream:"#F8F4ED", muted:"#776E65" }, boxShadow: { soft:"0 16px 50px rgba(40,26,16,.08)" } } }, plugins: [] };
export default config;