import { JSX } from "react";
import {
  Field,
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text,
} from "@sitecore-content-sdk/nextjs";
import { Headphones } from "lucide-react";
import { ComponentProps } from "lib/component-props";
import { cn } from "@/lib/utils";

interface FloatingSupportButtonFields {
  AccessibilityLabel: Field<string>;
  SupportLink: LinkField;
  SupportIcon: ImageField;
}

type FloatingSupportButtonProps = ComponentProps & {
  fields?: FloatingSupportButtonFields;
};

const FloatingSupportButtonDefaultComponent = (): JSX.Element => (
  <div className="component floating-support-button">
    <span className="is-empty-hint">FloatingSupportButton</span>
  </div>
);

export const Default = ({
  fields,
  params,
  page,
}: FloatingSupportButtonProps): JSX.Element => {
  const isEditing = page?.mode?.isEditing;

  if (!fields) return <FloatingSupportButtonDefaultComponent />;

  if (!fields.SupportLink?.value?.href && !isEditing)
    return <FloatingSupportButtonDefaultComponent />;

  return (
    <div
      className={cn("component floating-support-button", params.styles)}
      id={params.RenderingIdentifier}
    >
      <ContentSdkLink
        field={fields.SupportLink}
        className="fixed right-0 top-1/2 z-50 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-l-xl bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
      >
        {fields.SupportIcon?.value?.src ? (
          <ContentSdkImage
            field={fields.SupportIcon}
            className="h-7 w-7 object-contain"
          />
        ) : (
          <Headphones className="h-7 w-7" aria-hidden="true" />
        )}
        {(fields.AccessibilityLabel?.value || isEditing) && (
          <Text
            field={fields.AccessibilityLabel}
            tag="span"
            className="sr-only"
          />
        )}
      </ContentSdkLink>
    </div>
  );
};
