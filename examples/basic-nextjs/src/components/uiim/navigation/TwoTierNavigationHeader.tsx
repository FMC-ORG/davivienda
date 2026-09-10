"use client";

import { JSX, useState } from "react";
import {
  Field,
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  Text,
} from "@sitecore-content-sdk/nextjs";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { ComponentProps } from "lib/component-props";
import { cn } from "@/lib/utils";

type NavigationTier = "utility" | "primary";

interface NavigationLinkFields {
  id: string;
  linkText: { jsonValue: Field<string> };
  linkUrl: { jsonValue: LinkField };
  linkTier: { jsonValue: Field<string> };
  hasDropdown: { jsonValue: Field<boolean> };
}

interface TwoTierNavigationHeaderDatasource {
  brandLogo: { jsonValue: ImageField };
  requestProductsLink: { jsonValue: LinkField };
  loginLink: { jsonValue: LinkField };
  pseLink: { jsonValue: LinkField };
  searchLabel: { jsonValue: Field<string> };
  children?: { results?: NavigationLinkFields[] };
}

interface TwoTierNavigationHeaderFields {
  data?: { datasource?: TwoTierNavigationHeaderDatasource };
}

type TwoTierNavigationHeaderProps = ComponentProps & {
  fields?: TwoTierNavigationHeaderFields;
};

const TwoTierNavigationHeaderDefaultComponent = (): JSX.Element => (
  <div className="component two-tier-navigation-header">
    <div className="component-content">
      <span className="is-empty-hint">TwoTierNavigationHeader</span>
    </div>
  </div>
);

const NavigationLink = ({
  item,
}: {
  item: NavigationLinkFields;
}): JSX.Element | null => {
  const link = item.linkUrl?.jsonValue;
  const label = item.linkText?.jsonValue;

  if (!link?.value?.href && !label?.value) return null;

  return (
    <ContentSdkLink
      field={link}
      className="inline-flex items-center gap-1 whitespace-nowrap transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
    >
      <Text field={label} tag="span" />
      {item.hasDropdown?.jsonValue?.value && (
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </ContentSdkLink>
  );
};

export const Default = ({
  fields,
  params,
  page,
}: TwoTierNavigationHeaderProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = page?.mode?.isEditing;
  const datasource = fields?.data?.datasource;

  if (!datasource) return <TwoTierNavigationHeaderDefaultComponent />;

  const links = datasource.children?.results ?? [];
  const linksForTier = (tier: NavigationTier) =>
    links.filter(
      (item) => item.linkTier?.jsonValue?.value?.toLowerCase() === tier,
    );
  const utilityLinks = linksForTier("utility");
  const primaryLinks = linksForTier("primary");

  return (
    <header
      className={cn(
        "component two-tier-navigation-header relative z-40 w-full",
        params.styles,
      )}
      id={params.RenderingIdentifier}
    >
      <div className="hidden border-b border-[var(--brand-border)] bg-[var(--brand-bg)] text-[13px] text-[var(--brand-fg)] lg:block">
        <div className="mx-auto flex h-10 max-w-[1136px] items-center justify-between px-6">
          <nav
            aria-label="Audience navigation"
            className="flex items-center gap-9"
          >
            {utilityLinks.map((item) => (
              <NavigationLink key={item.id} item={item} />
            ))}
          </nav>
          <div className="flex items-center gap-6">
            {(datasource.pseLink?.jsonValue?.value?.href || isEditing) && (
              <ContentSdkLink
                field={datasource.pseLink?.jsonValue}
                className="font-semibold"
              />
            )}
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] text-white"
              aria-hidden="true"
            >
              i
            </span>
          </div>
        </div>
      </div>

      <div
        className="text-[var(--brand-header-fg)]"
        style={{
          background:
            "linear-gradient(90deg, var(--brand-header-bg) 0%, var(--brand-primary) 100%)",
        }}
      >
        <div className="mx-auto flex h-20 max-w-[1136px] items-center gap-8 px-5 lg:h-[72px] lg:px-6">
          {(datasource.brandLogo?.jsonValue?.value?.src || isEditing) && (
            <ContentSdkImage
              field={datasource.brandLogo?.jsonValue}
              className="h-auto w-[150px] shrink-0 object-contain lg:w-44"
            />
          )}

          <nav
            aria-label="Primary navigation"
            className="hidden flex-1 items-center gap-7 text-sm font-semibold lg:flex"
          >
            {primaryLinks.map((item) => (
              <NavigationLink key={item.id} item={item} />
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            {(datasource.requestProductsLink?.jsonValue?.value?.href ||
              isEditing) && (
              <ContentSdkLink
                field={datasource.requestProductsLink?.jsonValue}
                className="rounded-[var(--brand-button-radius)] border border-white px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
              />
            )}
            {(datasource.loginLink?.jsonValue?.value?.href || isEditing) && (
              <ContentSdkLink
                field={datasource.loginLink?.jsonValue}
                className="rounded-[var(--brand-button-radius)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--brand-fg)] transition-opacity hover:opacity-90"
              />
            )}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--brand-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              <Text
                field={datasource.searchLabel?.jsonValue}
                tag="span"
                className="sr-only"
              />
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            {(datasource.loginLink?.jsonValue?.value?.href || isEditing) && (
              <ContentSdkLink
                field={datasource.loginLink?.jsonValue}
                className="rounded-[var(--brand-button-radius)] bg-white px-4 py-2 text-xs font-semibold text-[var(--brand-fg)]"
              />
            )}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((current) => !current)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-white/20 px-5 pb-5 lg:hidden"
          >
            <div className="flex flex-col divide-y divide-white/15">
              {[...primaryLinks, ...utilityLinks].map((item) => (
                <div key={item.id} className="py-3 text-sm">
                  <NavigationLink item={item} />
                </div>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
