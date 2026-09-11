import React, { JSX } from 'react';
import * as LucideIcons from 'lucide-react';
import { Sparkles } from 'lucide-react';
import {
  Field,
  RichTextField,
  Text,
  RichText as ContentSdkRichText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { cn } from '@/lib/utils';

interface LandingFeaturesRouteFields {
  feature1IconName?: Field<string>;
  feature1Title?: Field<string>;
  feature1Description?: RichTextField;
  feature2IconName?: Field<string>;
  feature2Title?: Field<string>;
  feature2Description?: RichTextField;
  feature3IconName?: Field<string>;
  feature3Title?: Field<string>;
  feature3Description?: RichTextField;
}

const LandingFeaturesDefaultComponent = (): JSX.Element => (
  <div className="component landing-features">
    <div className="component-content">
      <span className="is-empty-hint">LandingFeatures</span>
    </div>
  </div>
);

function getRouteFields(page: ComponentProps['page']): LandingFeaturesRouteFields | null {
  const fields = page?.layout?.sitecore?.route?.fields;
  return fields ? (fields as unknown as LandingFeaturesRouteFields) : null;
}

function FeatureCard({
  iconName,
  title,
  description,
  isEditing,
}: {
  iconName?: Field<string>;
  title?: Field<string>;
  description?: RichTextField;
  isEditing?: boolean;
}) {
  const iconKey = iconName?.value;
  const hasContent = iconKey || title?.value || description?.value;
  if (!hasContent && !isEditing) return null;

  const Icon =
    iconKey && (LucideIcons as Record<string, unknown>)[iconKey]
      ? ((LucideIcons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[
          iconKey
        ]
      : Sparkles;

  return (
    <div
      className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md"
      data-testid="feature-card"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-gray-900 text-white">
        <Icon className="h-6 w-6" />
      </div>
      {(title?.value || isEditing) && (
        <Text
          field={title}
          tag="h3"
          className="text-lg font-semibold text-gray-900"
          data-testid="feature-title"
        />
      )}
      {(description?.value || isEditing) && (
        <div className="mt-2 text-sm text-gray-600" data-testid="feature-description">
          <ContentSdkRichText field={description} />
        </div>
      )}
    </div>
  );
}

export const Default = ({ params, page }: ComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  if (!routeFields) return <LandingFeaturesDefaultComponent />;

  return (
    <div className={cn('component landing-features', styles)} id={RenderingIdentifier}>
      <section className="bg-gray-50 py-16 md:py-24" data-testid="landing-features">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              iconName={routeFields.feature1IconName}
              title={routeFields.feature1Title}
              description={routeFields.feature1Description}
              isEditing={isEditing}
            />
            <FeatureCard
              iconName={routeFields.feature2IconName}
              title={routeFields.feature2Title}
              description={routeFields.feature2Description}
              isEditing={isEditing}
            />
            <FeatureCard
              iconName={routeFields.feature3IconName}
              title={routeFields.feature3Title}
              description={routeFields.feature3Description}
              isEditing={isEditing}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

/* Davivienda — light banking cards with red icon accents */
export const Davivienda = ({ params, page }: ComponentProps): JSX.Element => {
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  if (!routeFields) return <LandingFeaturesDefaultComponent />;

  const features = [
    { iconName: routeFields.feature1IconName, title: routeFields.feature1Title, description: routeFields.feature1Description },
    { iconName: routeFields.feature2IconName, title: routeFields.feature2Title, description: routeFields.feature2Description },
    { iconName: routeFields.feature3IconName, title: routeFields.feature3Title, description: routeFields.feature3Description },
  ];

  return (
    <div className={cn('component landing-features', params.styles)} id={params.RenderingIdentifier}>
      <section className="bg-[var(--brand-muted)] px-5 py-16 sm:px-6 md:py-24" data-testid="landing-features">
        <div className="mx-auto grid max-w-[1136px] gap-5 md:grid-cols-3">
          {features.map((feature, index) => {
            const iconKey = feature.iconName?.value;
            const hasContent = iconKey || feature.title?.value || feature.description?.value;
            if (!hasContent && !isEditing) return null;
            const Icon = iconKey && (LucideIcons as Record<string, unknown>)[iconKey]
              ? ((LucideIcons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[iconKey]
              : Sparkles;
            return (
              <article key={index} className="rounded-[var(--brand-card-radius)] bg-[var(--brand-bg)] p-7 ring-1 ring-[var(--brand-border)] transition-transform hover:-translate-y-1">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]">
                  <Icon className="h-6 w-6" />
                </div>
                {(feature.title?.value || isEditing) && (
                  <Text field={feature.title} tag="h3" className="text-xl font-bold font-[var(--brand-heading-font)] text-[var(--brand-fg)]" />
                )}
                {(feature.description?.value || isEditing) && (
                  <ContentSdkRichText field={feature.description} className="mt-3 text-sm leading-6 text-[var(--brand-muted-foreground)]" />
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
