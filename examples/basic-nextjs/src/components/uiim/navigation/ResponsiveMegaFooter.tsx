import { JSX } from "react";
import {
  Field,
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
} from "@sitecore-content-sdk/nextjs";
import { ChevronDown } from "lucide-react";
import { ComponentProps } from "lib/component-props";
import { cn } from "@/lib/utils";

interface FooterItemFields {
  id: string;
  itemType: { jsonValue: Field<string> };
  groupTitle: { jsonValue: Field<string> };
  linkText: { jsonValue: Field<string> };
  linkUrl: { jsonValue: LinkField };
  itemImage: { jsonValue: ImageField };
}

interface ResponsiveMegaFooterDatasource {
  brandLogo: { jsonValue: ImageField };
  description: { jsonValue: Field<string> };
  copyrightText: { jsonValue: Field<string> };
  children?: { results?: FooterItemFields[] };
}

interface ResponsiveMegaFooterFields {
  data?: { datasource?: ResponsiveMegaFooterDatasource };
}

type ResponsiveMegaFooterProps = ComponentProps & {
  fields?: ResponsiveMegaFooterFields;
};

const ResponsiveMegaFooterDefaultComponent = (): JSX.Element => (
  <div className="component responsive-mega-footer">
    <div className="component-content">
      <span className="is-empty-hint">ResponsiveMegaFooter</span>
    </div>
  </div>
);

const FooterLink = ({
  item,
  className,
}: {
  item: FooterItemFields;
  className?: string;
}) => (
  <ContentSdkLink
    field={item.linkUrl?.jsonValue}
    className={cn(
      "transition-colors hover:text-[var(--brand-primary)]",
      className,
    )}
  >
    {item.itemImage?.jsonValue?.value?.src && (
      <ContentSdkImage
        field={item.itemImage.jsonValue}
        className="h-8 w-auto object-contain"
      />
    )}
    {item.linkText?.jsonValue && (
      <Text field={item.linkText.jsonValue} tag="span" />
    )}
  </ContentSdkLink>
);

export const Default = ({
  fields,
  params,
  page,
}: ResponsiveMegaFooterProps): JSX.Element => {
  const datasource = fields?.data?.datasource;
  const isEditing = page?.mode?.isEditing;

  if (!datasource) return <ResponsiveMegaFooterDefaultComponent />;

  const items = datasource.children?.results ?? [];
  const navigationItems = items.filter(
    (item) => item.itemType?.jsonValue?.value?.toLowerCase() === "navigation",
  );
  const socialItems = items.filter(
    (item) => item.itemType?.jsonValue?.value?.toLowerCase() === "social",
  );
  const storeItems = items.filter(
    (item) => item.itemType?.jsonValue?.value?.toLowerCase() === "store",
  );
  const certificationItems = items.filter(
    (item) =>
      item.itemType?.jsonValue?.value?.toLowerCase() === "certification",
  );
  const groupedItems = navigationItems.reduce<Map<string, FooterItemFields[]>>(
    (groups, item) => {
      const title = item.groupTitle?.jsonValue?.value || "";
      groups.set(title, [...(groups.get(title) ?? []), item]);
      return groups;
    },
    new Map(),
  );

  return (
    <footer
      className={cn(
        "component responsive-mega-footer bg-[var(--brand-footer-bg)] text-[var(--brand-footer-fg)]",
        params.styles,
      )}
      id={params.RenderingIdentifier}
    >
      <div className="component-content mx-auto max-w-[1136px] px-5 pb-10 pt-14 sm:px-6 sm:pt-20">
        <div className="mb-10 max-w-5xl">
          {(datasource.brandLogo?.jsonValue?.value?.src || isEditing) && (
            <ContentSdkImage
              field={datasource.brandLogo?.jsonValue}
              className="mb-5 h-auto w-44 object-contain"
            />
          )}
          {(datasource.description?.jsonValue?.value || isEditing) && (
            <ContentSdkRichText
              field={datasource.description?.jsonValue}
              className="max-w-5xl text-sm leading-6 text-[var(--brand-muted-foreground)]"
            />
          )}
        </div>

        <div className="hidden grid-cols-2 gap-x-10 gap-y-8 border-b border-[var(--brand-border)] pb-12 md:grid lg:grid-cols-4">
          {[...groupedItems.entries()].map(([groupTitle, groupItems]) => (
            <section key={groupTitle}>
              {groupItems[0]?.groupTitle?.jsonValue && (
                <Text
                  field={groupItems[0].groupTitle.jsonValue}
                  tag="h3"
                  className="mb-5 text-sm font-bold font-[var(--brand-heading-font)] text-[var(--brand-fg)]"
                />
              )}
              <ul className="space-y-3">
                {groupItems.map((item) => (
                  <li key={item.id} className="text-xs leading-5">
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="divide-y divide-[var(--brand-border)] border-y border-[var(--brand-border)] md:hidden">
          {[...groupedItems.entries()].map(([groupTitle, groupItems]) => (
            <details key={groupTitle} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
                {groupItems[0]?.groupTitle?.jsonValue && (
                  <Text
                    field={groupItems[0].groupTitle.jsonValue}
                    tag="span"
                    className="text-sm font-bold text-[var(--brand-fg)]"
                  />
                )}
                <ChevronDown
                  className="h-4 w-4 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <ul className="space-y-3 pb-5">
                {groupItems.map((item) => (
                  <li key={item.id} className="text-sm">
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-b border-[var(--brand-border)] py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {socialItems.map((item) => (
              <FooterLink
                key={item.id}
                item={item}
                className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[var(--brand-fg)] px-2 text-[11px] font-bold text-[var(--brand-fg)]"
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {[...certificationItems, ...storeItems].map((item) => (
              <FooterLink
                key={item.id}
                item={item}
                className="inline-flex min-h-9 items-center rounded-md bg-[var(--brand-dark)] px-3 py-2 text-xs font-semibold text-[var(--brand-dark-foreground)]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--brand-dark)] px-5 py-3 text-center text-[11px] text-[var(--brand-dark-foreground)]">
        {(datasource.copyrightText?.jsonValue?.value || isEditing) && (
          <Text field={datasource.copyrightText?.jsonValue} tag="p" />
        )}
      </div>
    </footer>
  );
};
