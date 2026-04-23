import type { ImgHTMLAttributes } from "react";

type AssetIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

export function AssetIcon({ src, alt = "", decoding = "async", ...rest }: AssetIconProps) {
  return <img src={src} alt={alt} decoding={decoding} {...rest} />;
}
