"use client";
import { menuOptions } from "@/lib/constant";

export default function DashboardNavbar() {
  return (
    <>
      <section className="w-[5rem] h-screen border-r">
        <div className="flex flex-col mt-8 gap-6">
          {menuOptions.map((data, id) => {
            return (
              <div
                key={id}
                className="cursor-pointer flex items-center justify-center"
              >
                <data.Component />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
