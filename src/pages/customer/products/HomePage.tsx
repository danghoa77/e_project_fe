import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { customerApi } from "../api";
import { ProductCard } from "./components/ProductCard";
import { RecommendCard } from "./components/Recommend";

export const HomePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await customerApi.fetchProducts();
        if (data && data.products) {
          setProducts(data.products);
        } else {
          console.warn("No products found in the response");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-[#F7F2EC] text-neutral-800">
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <video
              src="https://res.cloudinary.com/dzskttedu/video/upload/v1753603101/Astonishing_orange_-_Herm%C3%A8s_tglwbm.mp4"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
            />
          </div>
          <div
            className="flex flex-col justify-items-end items-start 
             bg-gradient-to-br 
             from-[#e07b39] via-[#e0bd93] to-[#e8dfd3] 
             p-10 ml-5 mt-0"
          >
            <h2 className="text-2xl md:text-5xl font-semibold uppercase tracking-[0.2em] text-stone-800">
              THE ART OF MOTION
            </h2>
            <p className="mt-4 text-base text-black leading-relaxed">
              Inspired by myth and reborn through craft, the winged steed soars
              again — a symbol of freedom, strength, and elegance carried
              forward in each design.
            </p>
            <Button
              asChild
              className="mt-6 uppercase tracking-widest 
             text-white bg-neutral-800 
             transition-colors duration-700 ease-in-out hover:shadow-black hover:shadow-sm
             hover:text-black hover:bg-gradient-to-br hover:from-[#F7F2EC] hover:to-[#e0bd93]"
            >
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl uppercase tracking-[0.2em] text-neutral-800">
          FLYING STEED
        </h2>
        <p className="mt-5 text-lg text-neutral-600 max-w-2xl mx-auto font-serif leading-relaxed">
          An equestrian case captures the image of a winged horse, and the myth
          of Pegasus rises from its ashes, once again.
        </p>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className=" text-3xl md:text-4xl uppercase tracking-wider">
          Where there's silk, there's sunshine
        </h2>
        <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          A vibrant energy radiates from the Spring-Summer 2025 silk collection.
        </p>
        <Button
          asChild
          variant="link"
          className="p-0 mt-6 text-sm uppercase tracking-widest text-neutral-800 hover:text-neutral-500 h-auto"
        >
          <Link to="/products" className="text-xl">
            Discover the Collection
          </Link>
        </Button>
      </section>

      {/* Full Width Image */}
      <section className="w-full my-8">
        <img
          src="https://res.cloudinary.com/dzskttedu/image/upload/v1753603320/imgi_138_P_169_SUMMERMOOD_U_M_wniouk.webp"
          alt="Campaign"
          className="w-full h-auto object-cover"
        />
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className=" text-3xl md:text-4xl uppercase tracking-wider">
          Gallop in style
        </h2>
        <p className="mt-4 text-sm text-neutral-600 max-w-2xl mx-auto">
          Everything you need for the perfect equestrian outing, from signature
          silks to technical apparel.
        </p>
        <Button
          asChild
          variant="link"
          className="p-0 mt-6 text-sm uppercase tracking-widest text-neutral-800 hover:text-neutral-500 h-auto"
        >
          <Link to="#">Shop the selection</Link>
        </Button>
      </section>

      <section className="container mx-auto px-4 pt-12 pb-16 md:pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(4, 8).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4  pb-16 md:pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            Loading...
          </div>
        ) : (
          <RecommendCard />
        )}
      </section>
    </div>
  );
};
