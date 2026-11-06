import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--gui-radius-xs)] border-0 font-semibold whitespace-nowrap outline-none select-none transition-[transform,background-color,color,opacity] [transition-duration:var(--gui-motion-small)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gui-focus)] active:not-aria-[haspopup]:translate-y-[var(--gui-press-offset)] disabled:pointer-events-none disabled:bg-[var(--gui-control-disabled)] disabled:text-[var(--gui-neutral-6)] disabled:opacity-100 aria-invalid:outline-2 aria-invalid:outline-[var(--gui-error)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[var(--gui-color-1)] text-white [--control-hover-bg:#18329a]",
        outline:
          "bg-white shadow-[inset_0_0_0_1px_var(--gui-color-1)] text-[var(--gui-color-1)] [--control-hover-bg:var(--gui-color-1-transparent)] aria-expanded:bg-[var(--gui-neutral-3-transparent)]",
        secondary:
          "bg-[var(--gui-surface-muted)] text-[var(--gui-text)] [--control-hover-bg:var(--gui-neutral-4)] aria-expanded:bg-[var(--gui-neutral-4-transparent)]",
        ghost:
          "bg-transparent text-[var(--gui-text)] [--control-hover-bg:var(--gui-color-1-transparent)]",
        destructive:
          "bg-[var(--gui-error)] [--control-hover-bg:color-mix(in_srgb,var(--gui-error)_85%,var(--gui-text))] text-white focus-visible:outline-[var(--gui-focus)]",
        link: "bg-transparent px-0 text-[var(--gui-link)] underline-offset-4 hover:underline [--control-hover-bg:var(--gui-color-1-transparent)]",
      },
      size: {
        default:
          "min-h-12 gap-[var(--gui-space-xs)] px-[var(--gui-space-l)] py-[var(--gui-space-s)] text-[length:var(--gui-text-s)] leading-[var(--gui-leading-s)] tracking-[var(--gui-tracking-l)]",
        xs: "min-h-8 gap-[var(--gui-space-xxs)] rounded-[var(--gui-radius-xs)] px-[var(--gui-space-xs)] py-[var(--gui-space-xxs)] text-[length:var(--gui-text-xs)] leading-[var(--gui-leading-xs)] tracking-[var(--gui-tracking-l)] [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-10 gap-[var(--gui-space-xxs)] px-[var(--gui-space-s)] py-[var(--gui-space-xs)] text-[length:var(--gui-text-xs)] leading-[var(--gui-leading-xs)] tracking-[var(--gui-tracking-l)] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-14 gap-[var(--gui-space-xs)] px-[var(--gui-space-xl)] py-[var(--gui-space-s)] text-[length:var(--gui-text-m)] leading-[var(--gui-leading-m)]",
        icon: "size-12 p-0",
        "icon-xs": "size-8 rounded-[var(--gui-radius-xs)] p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10 p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-14 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
