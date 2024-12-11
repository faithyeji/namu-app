import { Instrument_Sans } from "next/font/google";
import { Alike } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrumentSans",
});
const alike = Alike({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alike",
});

export const metadata = {
  title: "Namu",
  description: "Your digital garden.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${alike.variable}`}>
      <body>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
