// src/components/navbar/NavbarBrand.tsx
import Link from "next/link";

export default function NavbarBrand() {
  return (
    <Link href="/" className="text-xl text-iptm-white font-bold">
      การจัดการเทคโนโลยีการผลิตและสารสนเทศ
    </Link>
  );
}
