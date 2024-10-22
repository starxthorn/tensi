import { cn } from "@/lib/utils";

interface MaxWidthWrapperPropsType {
  children: React.ReactNode;
  className?: string;
}

export default function MaxWidthWrapper({
  children,
  className,
}: MaxWidthWrapperPropsType) {
  return (
    <>
      <section className={cn("px-8 lg:px-24", className)}>{children}</section>
    </>
  );
}
