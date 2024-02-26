import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-bold", {
  variants: {
    size: {
      small: "text-lg md:text-2xl",
      large: "text-6xl",
      medium: "text-4xl",
    },
    centered: {
      true: "text-center",
    },
  },
  defaultVariants: {
    size: "medium",
    centered: false,
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, centered, ...props }, ref) => {
    return (
      <h1
        className={cn(
          headingVariants({
            size,
            centered,
            className,
          }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
