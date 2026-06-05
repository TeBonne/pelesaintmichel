export default function Logo({ height = 44, variant = "color", style = {} }) {
  const src =
    variant === "medallion" ? "/img/logo-medallion-cream.png" : "/img/logo-pele-saint-michel.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Pèlerinage de Saint Michel"
      style={{ height, width: "auto", display: "block", ...style }}
    />
  );
}
