import BannerCarousel from "@/components/Carousel";
import Categories from "@/components/Categories";
import Products from "@/components/Products";


export default function Home() {

  return (
    <div>
      <BannerCarousel />
      <Categories title="Explore Popular Categories" />
      <Products title="Best Selling Products" tag="BEST_SELLER" />
      <Products />
    </div>
  );
}
