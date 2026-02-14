import { observer } from "mobx-react";
import Link from "next/link";
// plane imports
import { PriorityIcon, StateGroupIcon } from "@plane/propel/icons";
import { cn } from "@plane/utils";
// hooks
import { useIssueDetail } from "@/hooks/store/use-issue-detail";
import { useProject } from "@/hooks/store/use-project";
import { useProjectState } from "@/hooks/store/use-project-state";
import { useWorkspace } from "@/hooks/store/use-workspace";

type Props = {
  issueId?: string;
  projectId?: string;
  workspaceSlug?: string;
  selected?: boolean;
};

export const IssueEmbedCard = observer(function IssueEmbedCard(props: Props) {
  const { issueId, projectId, workspaceSlug: propWorkspaceSlug, selected } = props;
  const { currentWorkspace } = useWorkspace();
  const { getProjectIdentifierById } = useProject();
  const {
    issue: { getIssueById },
  } = useIssueDetail();
  const { getStateById } = useProjectState();

  const workspaceSlug = propWorkspaceSlug ?? currentWorkspace?.slug;
  const issue = issueId ? getIssueById(issueId) : undefined;
  const projectIdentifier = projectId ? getProjectIdentifierById(projectId) : undefined;
  const state = issue?.state_id ? getStateById(issue.state_id) : undefined;

  if (!issueId) return null;

  const href = workspaceSlug && projectId ? `/${workspaceSlug}/projects/${projectId}/issues/${issueId}` : "#";

  return (
    <Link
      href={href}
      target="_blank"
      className={cn(
        "w-full bg-custom-background-80 rounded-md border-[0.5px] border-custom-border-200 shadow-custom-shadow-2xs flex items-center gap-3 px-4 py-2.5 hover:bg-custom-background-90 transition-colors no-underline",
        { "border-2 border-custom-primary-100": selected }
      )}
    >
      {issue ? (
        <>
          <div className="flex items-center gap-2 shrink-0 text-custom-text-300 text-xs">
            {state && <StateGroupIcon stateGroup={state.group} className="size-3" />}
            {projectIdentifier && (
              <span>
                {projectIdentifier}-{issue.sequence_id}
              </span>
            )}
          </div>
          <span className="text-sm text-custom-text-100 truncate">{issue.name}</span>
          {issue.priority && (
            <div className="shrink-0 ml-auto">
              <PriorityIcon priority={issue.priority} className="size-3.5" />
            </div>
          )}
        </>
      ) : (
        <span className="text-sm text-custom-text-300">
          {projectIdentifier ? `${projectIdentifier} — ` : ""}Work item {issueId.slice(0, 8)}
        </span>
      )}
    </Link>
  );
});

// Keep backward compatible export name
export const IssueEmbedUpgradeCard = IssueEmbedCard;
