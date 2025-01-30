import { TestimonialsObject } from "@/sanity/lib/interfaces/pages";
import styles from "./testimonials.module.css";
import Text from "@/components/text/Text";
import { RichText } from "@/components/richText/RichText";
import LinkButton from "@/components/linkButton/LinkButton";
import SanityNextImage from "@/components/image/sanityImage";

export const Testimonials = ({
  testimonials,
}: {
  testimonials: TestimonialsObject;
}) => {
  return (
    <article className={styles.article} id={testimonials._key}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.text}>
            <Text type="h2">{testimonials.title}</Text>
            <RichText value={testimonials.richText} />
          </div>
          <div className={styles.desktopCta}>
            <LinkButton link={testimonials.link} />
          </div>
        </div>
        <ul className={styles.list}>
          {testimonials.list.map((testimonial) => (
            <li className={styles.item} key={testimonial._key}>
              <div className={styles.listContent}>
                <span className={styles.quotationMark} />
                <RichText value={testimonial.richText} />
                <Text type="small">
                  <span>{testimonial.name}</span> — {testimonial.company}
                </Text>
              </div>
              <div className={styles.avatar}>
                <SanityNextImage image={testimonial.image} />
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.mobileCta}>
          <LinkButton link={testimonials.link} />
        </div>
      </div>
    </article>
  );
};
