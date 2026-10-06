import { permanentRedirect } from "next/navigation";

// Gammel adresse for Om foreningen. Siden ligger nå på /om-foreningen.
export default function ForeningenRedirect() {
  permanentRedirect("/om-foreningen");
}
