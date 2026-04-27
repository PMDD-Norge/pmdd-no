"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Text from "@/components/text/Text";
import Button from "@/components/buttons/Button";
import InputField from "@/components/forms/inputField/InputField";
import InputTextArea from "@/components/forms/inputTextArea/InputTextArea";
import { useFocusTrap } from "@/utils/useFocusTrap";
import modalStyles from "./blomstModal.module.css";

type BlomstType =
  | "snoklokke"
  | "alperose"
  | "dahlia"
  | "krokus"
  | "prestekrage"
  | "forglemmegei";

type Status = "idle" | "loading" | "success" | "error";

const BLOMST_FILNAVN: Record<BlomstType, string> = {
  snoklokke: "snøklokke",
  alperose: "alperose",
  dahlia: "dahlia",
  krokus: "krokus",
  prestekrage: "prestekrage",
  forglemmegei: "forglemmegei",
};

const BLOMSTER: { value: BlomstType; navn: string }[] = [
  { value: "prestekrage", navn: "Prestekrage" },
  { value: "alperose", navn: "Alperose" },
  { value: "dahlia", navn: "Dahlia" },
  { value: "krokus", navn: "Krokus" },
  { value: "snoklokke", navn: "Snøklokke" },
  { value: "forglemmegei", navn: "Forglemmegei" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BlomstModal({ isOpen, onClose }: Props) {
  const [valgt, setValgt] = useState<BlomstType | null>(null);
  const [tilMinneOm, setTilMinneOm] = useState("");
  const [hilsen, setHilsen] = useState("");
  const [navn, setNavn] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feilmelding, setFeilmelding] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(modalRef, isOpen);

  function lukk() {
    if (status === "loading") return;
    onClose();
  }

  function reset() {
    setValgt(null);
    setTilMinneOm("");
    setHilsen("");
    setNavn("");
    setStatus("idle");
    setFeilmelding("");
  }

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
    else reset();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "loading") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, status, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valgt || status === "loading") return;

    setStatus("loading");
    setFeilmelding("");

    try {
      const res = await fetch("/api/plant-blomst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blomstType: valgt, tilMinneOm, hilsen, navn, url: honeypot }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFeilmelding(data.error ?? "Noe gikk galt. Prøv igjen.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setFeilmelding("Kunne ikke nå serveren. Prøv igjen.");
      setStatus("error");
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div className={modalStyles.backdrop} onClick={lukk} aria-hidden="true" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="blomst-tittel"
        className={modalStyles.modal}
      >
        {status === "success" ? (
          <div className={modalStyles.suksess}>
            {valgt && (
              <Image
                src={`/blomster/${BLOMST_FILNAVN[valgt]}.png`}
                alt=""
                width={71}
                height={100}
                className={modalStyles.blomstIkon}
              />
            )}
            <Text type="bodyLarge">Så fin den ble. </Text>
            <Text type="body">
              Takk for at du plantet en blomst. Snart vil den blomstre sammen
              med alle de andre i minnehagen.
            </Text>
            <Button type="secondary" onClick={lukk} size="small">
              Lukk
            </Button>
          </div>
        ) : (
          <>
            <div className={modalStyles.header}>
              <div className={modalStyles.tittelBlokk}>
                <Text type="h3" as="h2" id="blomst-tittel">
                  Plant en blomst
                </Text>
                <Text>Velg en blomst og legg gjerne igjen en hilsen.</Text>
              </div>
              <button
                ref={closeRef}
                className={modalStyles.lukk}
                onClick={lukk}
                aria-label="Lukk"
                disabled={status === "loading"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className={modalStyles.innhold}
              noValidate
            >
              {/* Honeypot: skjult for mennesker, bots fyller det ut */}
              <input
                type="text"
                name="url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                style={{ position: 'absolute', opacity: 0, height: 0, pointerEvents: 'none' }}
              />
              <fieldset className={modalStyles.fieldset}>
                <legend className={modalStyles.blomstLegend}>
                  Velg en blomst:
                </legend>
                <div className={modalStyles.blomstGrid}>
                  {BLOMSTER.map((b) => (
                    <label key={b.value} className={modalStyles.blomstKnapp}>
                      <input
                        type="radio"
                        name="blomstType"
                        value={b.value}
                        checked={valgt === b.value}
                        onChange={() => setValgt(b.value)}
                        required
                        className={modalStyles.blomstInput}
                      />
                      <Image
                        src={`/blomster/${BLOMST_FILNAVN[b.value]}.png`}
                        alt={b.navn}
                        width={71}
                        height={100}
                        className={modalStyles.blomstIkon}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              <InputField
                label="Til minne om eller til støtte for (valgfri)"
                id="tilMinneOm"
                value={tilMinneOm}
                onChange={setTilMinneOm}
                maxLength={100}
                placeholder="Skriv her..."
                disabled={status === "loading"}
              />

              <InputTextArea
                label="En personlig hilsen (valgfri)"
                id="hilsen"
                value={hilsen}
                onChange={setHilsen}
                maxLength={150}
                rows={3}
                placeholder="Skriv her..."
                disabled={status === "loading"}
              />

              <InputField
                label="Ditt navn (valgfri)"
                id="navn"
                value={navn}
                onChange={setNavn}
                maxLength={60}
                placeholder="Skriv her..."
                disabled={status === "loading"}
              />

              <div className={modalStyles.bunn}>
                {feilmelding && (
                  <p className={modalStyles.feil} role="alert">
                    {feilmelding}
                  </p>
                )}
                <div className={modalStyles.sendRad}>
                  <Button
                    type="primary"
                    disabled={!valgt || status === "loading"}
                    loading={status === "loading"}
                    size="small"
                  >
                    {status === "loading" ? "Planter..." : "Plant blomsten"}
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
