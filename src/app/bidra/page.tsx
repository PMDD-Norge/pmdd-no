import { permanentRedirect } from "next/navigation";

// Gammel adresse for Bli medlem. Siden ligger nå på /bli-medlem.
export default function BidraRedirect() {
  permanentRedirect("/bli-medlem");
}
