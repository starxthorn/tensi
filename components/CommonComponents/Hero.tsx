import Image from "next/image";
import { ContainerScroll } from "../ui/Scroll-animation";
import { InfiniteMovingCards } from "../ui/Infinite-Moving-Cards";
import { clients } from "@/lib/constant";

export default function Hero() {
  return (
    <>
      <div className="h-[50rem] w-full bg-neutral-950 bg-grid-white/[0.05] absolute top-0 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>
      <section>
        <div className="flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 font-bold text-white">
                  Automate Your Data Management
                  <br />
                  <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                    Work With Tensi
                  </span>
                </h1>
              </>
            }
          >
            <Image
              src={`/temp-banner.png`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            />
          </ContainerScroll>
        </div>
        <div className="flex items-center justify-center">
          <InfiniteMovingCards
            className="mb-[100px]"
            items={clients}
            direction="right"
            speed="slow"
          />
        </div>
      </section>
    </>
  );
}
