import "./IceBlock.css";

type IceBlockProps = {
  subtype: string;
  position: { x: number; y: number };
};

export default function IceBlock({ subtype, position }: IceBlockProps) {
  return (
    <div className="ice-block" style={{ left: `${position.x * 40}px`, top: `${position.y * 40}px` }}>
      <img src={`/assets/iceblock-${subtype}.webp`} alt={`Ice Block ${subtype}`} />
    </div>
  );
}
