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
import { Building2, Headphones, Phone, Share2 } from "lucide-react";
import { ComponentProps } from "lib/component-props";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceChannelFields {
  id: string;
  cardType: { jsonValue: Field<string> };
  cardTitle: { jsonValue: Field<string> };
  cardDescription: { jsonValue: Field<string> };
  cardLink: { jsonValue: LinkField };
  cardIcon: { jsonValue: ImageField };
}

interface ServiceChannelsGridDatasource {
  title: { jsonValue: Field<string> };
  portraitImage: { jsonValue: ImageField };
  children?: { results?: ServiceChannelFields[] };
}

interface ServiceChannelsGridFields {
  data?: { datasource?: ServiceChannelsGridDatasource };
}

type ServiceChannelsGridProps = ComponentProps & {
  fields?: ServiceChannelsGridFields;
};

const ServiceChannelsGridDefaultComponent = (): JSX.Element => (
  <div className="component service-channels-grid">
    <div className="component-content">
      <span className="is-empty-hint">ServiceChannelsGrid</span>
    </div>
  </div>
);

const iconByType = {
  chat: Headphones,
  branches: Building2,
  contact: Phone,
  social: Share2,
};

const ChannelCard = ({
  item,
  isEditing,
}: {
  item: ServiceChannelFields;
  isEditing?: boolean;
}) => {
  const type =
    item.cardType?.jsonValue?.value?.toLowerCase() as keyof typeof iconByType;
  const Icon = iconByType[type] ?? Headphones;

  return (
    <Card className="h-full rounded-[var(--brand-card-radius)] border-0 bg-[var(--brand-bg)] shadow-none">
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          {item.cardIcon?.jsonValue?.value?.src ? (
            <ContentSdkImage
              field={item.cardIcon.jsonValue}
              className="h-5 w-5 object-contain"
            />
          ) : (
            <Icon
              className="h-5 w-5 text-[var(--brand-fg)]"
              aria-hidden="true"
            />
          )}
          {(item.cardTitle?.jsonValue?.value || isEditing) && (
            <Text
              field={item.cardTitle?.jsonValue}
              tag="h3"
              className="text-base font-bold font-[var(--brand-heading-font)] text-[var(--brand-fg)]"
            />
          )}
        </div>
        {(item.cardDescription?.jsonValue?.value || isEditing) && (
          <ContentSdkRichText
            field={item.cardDescription?.jsonValue}
            className="text-sm leading-6 text-[var(--brand-muted-foreground)]"
          />
        )}
        {(item.cardLink?.jsonValue?.value?.href || isEditing) && (
          <ContentSdkLink
            field={item.cardLink?.jsonValue}
            className="mt-auto w-fit rounded-[var(--brand-button-radius)] border border-[var(--brand-fg)] px-4 py-2 text-xs font-semibold text-[var(--brand-fg)] transition-colors hover:bg-[var(--brand-muted)]"
          />
        )}
      </CardContent>
    </Card>
  );
};

export const Default = ({
  fields,
  params,
  page,
}: ServiceChannelsGridProps): JSX.Element => {
  const datasource = fields?.data?.datasource;
  const isEditing = page?.mode?.isEditing;

  if (!datasource) return <ServiceChannelsGridDefaultComponent />;

  const channels = datasource.children?.results ?? [];

  return (
    <section
      className={cn(
        "component service-channels-grid bg-[var(--brand-muted)] py-14 sm:py-20",
        params.styles,
      )}
      id={params.RenderingIdentifier}
    >
      <div className="component-content mx-auto max-w-[1136px] px-5 sm:px-6">
        {(datasource.title?.jsonValue?.value || isEditing) && (
          <Text
            field={datasource.title?.jsonValue}
            tag="h2"
            className="mb-8 text-3xl font-bold leading-tight font-[var(--brand-heading-font)] text-[var(--brand-fg)] sm:text-4xl"
          />
        )}

        <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr_1fr] lg:grid-rows-2">
          <div className="overflow-hidden rounded-[var(--brand-card-radius)] bg-[var(--brand-primary)] lg:row-span-2">
            {(datasource.portraitImage?.jsonValue?.value?.src || isEditing) && (
              <ContentSdkImage
                field={datasource.portraitImage?.jsonValue}
                className="h-full min-h-[320px] w-full object-cover object-center lg:min-h-[520px]"
              />
            )}
          </div>
          {channels.map((item) => (
            <ChannelCard key={item.id} item={item} isEditing={isEditing} />
          ))}
        </div>
      </div>
    </section>
  );
};
