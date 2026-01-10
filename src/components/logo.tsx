import Image from "next/image";
import Link from "next/link";

export type LogoProps = {
  /** Texto alternativo para accesibilidad */
  alt?: string;
  /** Tamaño (ancho y alto) en píxeles */
  size?: number;
  /** Clases para el <img> */
  className?: string;
  /** Si se provee, envuelve el logo con un <Link> */
  href?: string;
  /** Prioriza la carga del logo (útil en header) */
  priority?: boolean;
};

export function Logo({
  alt = "Debts",
  size = 24,
  className,
  href,
  priority,
}: LogoProps) {
  const img = (
    <Image
      src="/logo.svg"
      alt={alt}
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  );

  if (href) {
    return (
      <Link href={href} aria-label={alt} className="inline-flex items-center">
        {img}
      </Link>
    );
  }

  return img;
}
