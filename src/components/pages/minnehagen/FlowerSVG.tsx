import Image from 'next/image';
import { CSSProperties } from 'react';

interface Props {
  type: string;
  size?: number;
  style?: CSSProperties;
}

const FLOWER_FILENAMES: Record<string, string> = {
  snoklokke:    'snøklokke',
  alperose:     'alperose',
  dahlia:       'dahlia',
  krokus:       'krokus',
  prestekrage:  'prestekrage',
  forglemmegei: 'forglemmegei',
};

export default function FlowerSVG({ type, size = 90, style }: Props) {
  const filename = FLOWER_FILENAMES[type] ?? 'prestekrage';
  return (
    <span
      style={{ display: 'inline-block', width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <Image
        src={`/blomster/${filename}.png`}
        alt=""
        width={size}
        height={size}
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
      />
    </span>
  );
}
