import { products } from "@/lib/constant";
import { HeroParallax } from "../ui/Hero-Parallax";

export default function Products() {
  return (
    <>
      <HeroParallax products={products} />
    </>
  );
}
