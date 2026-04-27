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

type Step = "form" | "donate" | "success" | "vipps-pending";
type Status = "idle" | "loading" | "error";

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

const PRESET_BELOEP = [50, 100, 200, 500, 1000];

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
  const [step, setStep] = useState<Step>("form");
  const [vilDonere, setVilDonere] = useState(false);
  const [valgtBeloep, setValgtBeloep] = useState<number | null>(null);
  const [annetBeloep, setAnnetBeloep] = useState("");

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
    setStep("form");
    setVilDonere(false);
    setValgtBeloep(null);
    setAnnetBeloep("");
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

  async function handleFormNeste(e: React.FormEvent) {
    e.preventDefault();
    if (!valgt || status === "loading") return;

    if (!vilDonere) {
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
          setStatus("idle");
          setStep("success");
        }
      } catch {
        setFeilmelding("Kunne ikke nå serveren. Prøv igjen.");
        setStatus("error");
      }
    } else {
      setStep("donate");
    }
  }

  function effektivtBeloep(): number | null {
    if (valgtBeloep !== null) return valgtBeloep;
    const parsed = parseInt(annetBeloep, 10);
    if (!isNaN(parsed) && parsed >= 10) return parsed;
    return null;
  }

  async function handleDoner() {
    const beloep = effektivtBeloep();
    if (beloep === null || status === "loading") return;

    setStatus("loading");
    setFeilmelding("");

    try {
      const blomstRes = await fetch("/api/plant-blomst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blomstType: valgt, tilMinneOm, hilsen, navn, url: honeypot }),
      });
      const blomstData = await blomstRes.json();

      if (!blomstRes.ok) {
        setFeilmelding(blomstData.error ?? "Noe gikk galt. Prøv igjen.");
        setStatus("error");
        return;
      }

      const blomstId: string = blomstData.id;

      const vippsRes = await fetch("/api/vipps-donasjon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beloep, blomstId }),
      });
      const vippsData = await vippsRes.json();

      if (!vippsRes.ok) {
        setFeilmelding(vippsData.error ?? "Kunne ikke starte Vipps-betaling. Prøv igjen.");
        setStatus("error");
        return;
      }

      setStep("vipps-pending");
      window.location.href = vippsData.redirectUrl;
    } catch {
      setFeilmelding("Kunne ikke nå serveren. Prøv igjen.");
      setStatus("error");
    }
  }

  if (!isOpen) return null;

  const showHeader = step === "form" || step === "donate";

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
        {step === "success" && (
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
            <Text type="bodyLarge">Så fin den ble.</Text>
            <Text type="body">
              Takk for at du plantet en blomst. Snart vil den blomstre sammen
              med alle de andre i minnehagen.
            </Text>
            <Button type="secondary" onClick={lukk} size="small">
              Lukk
            </Button>
          </div>
        )}

        {step === "vipps-pending" && (
          <div className={modalStyles.vippsPending}>
            <div className={modalStyles.spinner} aria-hidden="true" />
            <Text type="bodyLarge">Sender deg til Vipps...</Text>
          </div>
        )}

        {showHeader && (
          <div className={modalStyles.header}>
            <div className={modalStyles.tittelBlokk}>
              <Text type="h3" as="h2" id="blomst-tittel">
                {step === "donate" ? "Velg donasjonsbeløp" : "Plant en blomst"}
              </Text>
              {step === "form" && (
                <Text>Velg en blomst og legg gjerne igjen en hilsen.</Text>
              )}
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
        )}

        {step === "form" && (
          <form
            onSubmit={handleFormNeste}
            className={modalStyles.innhold}
            noValidate
          >
            <input
              type="text"
              name="url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              style={{ position: "absolute", opacity: 0, height: 0, pointerEvents: "none" }}
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
              <label className={modalStyles.donasjonsCheckbox}>
                <input
                  type="checkbox"
                  checked={vilDonere}
                  onChange={(e) => setVilDonere(e.target.checked)}
                  disabled={status === "loading"}
                />
                <span>Jeg vil også donere til PMDD Norges arbeid</span>
              </label>
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
                  {status === "loading" ? "Planter..." : "Neste"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {step === "donate" && (
          <div className={modalStyles.donasjonSteg}>
            <Text type="body">
              Din donasjon går til PMDD Norges arbeid for kunnskap, støtte og viktig hjelp.
            </Text>

            <div className={modalStyles.beloepGrid}>
              {PRESET_BELOEP.map((b) => (
                <button
                  key={b}
                  type="button"
                  className={`${modalStyles.beloepKnapp}${valgtBeloep === b ? ` ${modalStyles.valgtBeloep}` : ""}`}
                  onClick={() => {
                    setValgtBeloep(b);
                    setAnnetBeloep("");
                  }}
                  disabled={status === "loading"}
                >
                  {b} kr
                </button>
              ))}
            </div>

            <div className={modalStyles.annetBeloep}>
              <InputField
                label="Annet beløp"
                id="annetBeloep"
                type="number"
                value={annetBeloep}
                onChange={(val) => {
                  setAnnetBeloep(val);
                  setValgtBeloep(null);
                }}
                placeholder="Minimum 10 kr"
                disabled={status === "loading"}
              />
            </div>

            {feilmelding && (
              <p className={modalStyles.feil} role="alert">
                {feilmelding}
              </p>
            )}

            <div className={modalStyles.navigasjon}>
              <Button
                type="secondary"
                size="small"
                onClick={() => {
                  setStep("form");
                  setFeilmelding("");
                }}
                disabled={status === "loading"}
              >
                Tilbake
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={handleDoner}
                disabled={effektivtBeloep() === null || status === "loading"}
                loading={status === "loading"}
              >
                {status === "loading" ? "Venter..." : "Doner via Vipps"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
