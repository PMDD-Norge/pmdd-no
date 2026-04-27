import { sanityFetch } from "@/sanity/lib/live";
import { GODKJENTE_BLOMSTER_QUERY } from "@/sanity/lib/queries/blomst";
import Text from "@/components/text/Text";
import BlomstKort from "./BlomstKort";
import styles from "./blomster.module.css";

interface Blomst {
  _id: string;
  blomstType: string;
  tilMinneOm?: string;
  hilsen?: string;
  navn?: string;
  plantetDato: string;
}

export default async function MinnehagenBlomster() {
  const { data: blomster } = await sanityFetch({
    query: GODKJENTE_BLOMSTER_QUERY,
    params: {},
  });

  if (!blomster || blomster.length === 0) return null;

  return (
    <section className={styles.seksjon}>
      <div className={styles.inner}>
        <ul className={styles.grid} role="list">
          {blomster.map((blomst: Blomst) => (
            <li key={blomst._id} className={styles.kort}>
              <BlomstKort
                blomstType={blomst.blomstType}
                tilMinneOm={blomst.tilMinneOm}
                hilsen={blomst.hilsen}
                navn={blomst.navn}
                size={130}
              />
            </li>
          ))}
        </ul>

        <Text type="small" className={styles.beskrivelse}>
          Her vokser det blomster til minne om dem vi har mistet til PMDD, og
          til støtte for alle som lever med det. <br />
          {/* Alle donasjoner går til PMDD Norges arbeid for kunnskap, støtte og
          viktig hjelp. */}
        </Text>
      </div>
    </section>
  );
}
