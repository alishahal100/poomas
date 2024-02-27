import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { Button, buttonVariants } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/config";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CarFrontIcon, } from "lucide-react";

interface Category {
  label: string;
  value: string;
  img:string | null;
  featured: {
    name: string;
    href: string;
    imageSrc: string;
  }[];
}


const perks = [
  {
    name: "Fast Listings",
    Icon: ArrowDownToLine,
    description:
      "List your properties or vehicles quickly and easily on Poomas.",
  },
  {
    name: "Verified Sellers",
    Icon: CheckCircle,
    description:
      "Our platform ensures trust with verified sellers, providing quality assurance for buyers.",
  },
  {
    name: "Premium Selection",
    Icon: Leaf,
    description:
      "Discover premium listings and join us in our commitment to offering high-quality properties, shops, and vehicles.",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Marketplace For{" "}
            <span className="text-blue-600">Buying and Selling</span> Online.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to Poomas. Discover a wide range of products from verified
            sellers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/products?sort=category" className={buttonVariants()}>
              Explore Categories
            </Link>

            <Button variant="ghost">Learn More &rarr;</Button>
          </div>
        </div>
       <section className="w-full h-auto  flex flex-col gap-5  justify-center ml-auto">
        <div>

        <h1 className="text-3xl font-bold">Categories</h1>
        </div>
        <div className="grid  grid-cols-2 lg:grid-cols-4 gap-24  ">

  {PRODUCT_CATEGORIES.map((category, index) => (
    <div key={index} className=" shadow-md px-10 py-4 flex gap-5 cursor-pointer items-center text-center justify-center">
      <Link href={`/products?category=${category.value}`}>
        <Image src={category.img} alt={category.label} width={100} height={90} />
        <p className="text-md font-semibold mt-4">{category.label}</p>
      </Link>
    </div>
  ))}
  </div>
</section>

        <ProductReel
          query={{ sort: "desc", limit: 4 }}
          href="/products?sort=recent"
          title="New Arrivals"
        />
      </MaxWidthWrapper>

      <section className="border-t border-gray-200 bg-gray-50">
       
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    {<perk.Icon className="w-1/3 h-1/3" />}
                  </div>
                </div>

                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
