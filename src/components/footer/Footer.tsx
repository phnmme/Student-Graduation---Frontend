import FooterLeft from "./FooterLeft";
import FooterRight from "./FooterRight";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-300 bg-iptm-navy text-iptm-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:items-start">
          <FooterLeft />
          <FooterRight />
        </div>

        {/* bottom copyright */}
        <div className="mt-8 text-center text-xs text-iptm-white">
          © {new Date().getFullYear()}{" "}
          ภาควิชาการจัดการเทคโนโลยีการผลิตและสารสนเทศ
        </div>
      </div>
    </footer>
  );
}
