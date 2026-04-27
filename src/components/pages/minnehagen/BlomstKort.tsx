import FlowerSVG from "./FlowerSVG";
import Text from "@/components/text/Text";
import styles from "./blomstKort.module.css";

interface Props {
  blomstType: string;
  tilMinneOm?: string;
  hilsen?: string;
  navn?: string;
  size?: number;
  hilsenPrefix?: string;
}

export default function BlomstKort({
  blomstType,
  tilMinneOm,
  hilsen,
  navn,
  size = 100,
  hilsenPrefix = "Klem",
}: Props) {
  const hasTekst = tilMinneOm || hilsen || navn;

  return (
    <div className={styles.kort}>
      <FlowerSVG type={blomstType} size={size} />
      {hasTekst && (
        <div className={styles.tekst}>
          {tilMinneOm && <Text className={styles.minne}>{tilMinneOm}</Text>}
          {hilsen && <Text>{hilsen}</Text>}
          {navn && (
            <Text>
              {hilsenPrefix} {navn}
            </Text>
          )}
        </div>
      )}
    </div>
  );
}
