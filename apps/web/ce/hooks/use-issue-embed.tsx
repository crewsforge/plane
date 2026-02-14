// editor
import type { TEmbedConfig } from "@plane/editor";
// plane types
import type { TSearchEntityRequestPayload, TSearchResponse } from "@plane/types";
// plane web components
import { IssueEmbedCard } from "@/plane-web/components/pages";

export type TIssueEmbedHookProps = {
  fetchEmbedSuggestions?: (payload: TSearchEntityRequestPayload) => Promise<TSearchResponse>;
  projectId?: string;
  workspaceSlug?: string;
};

export const useIssueEmbed = (props: TIssueEmbedHookProps) => {
  const widgetCallback = ({
    issueId,
    projectId,
    workspaceSlug,
  }: {
    issueId: string;
    projectId: string | undefined;
    workspaceSlug: string | undefined;
  }) => (
    <IssueEmbedCard
      issueId={issueId}
      projectId={projectId ?? props.projectId}
      workspaceSlug={workspaceSlug ?? props.workspaceSlug}
    />
  );

  const issueEmbedProps: TEmbedConfig["issue"] = {
    widgetCallback,
  };

  return {
    issueEmbedProps,
  };
};
