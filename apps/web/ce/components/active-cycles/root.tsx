import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";
// plane imports
import { useTranslation } from "@plane/i18n";
import type { ICycle } from "@plane/types";
import { ContentWrapper, Row } from "@plane/ui";
// assets
import darkActiveCycleAsset from "@/app/assets/empty-state/cycle/active-dark.webp?url";
import lightActiveCycleAsset from "@/app/assets/empty-state/cycle/active-light.webp?url";
// components
import { ActiveCycleProgress } from "@/components/cycles/active-cycle/progress";
import { ActiveCycleProductivity } from "@/components/cycles/active-cycle/productivity";
import { ActiveCycleStats } from "@/components/cycles/active-cycle/cycle-stats";
import useCyclesDetails from "@/components/cycles/active-cycle/use-cycles-details";
import { CyclesListItem } from "@/components/cycles/list/cycles-list-item";
import { DetailedEmptyState } from "@/components/empty-state/detailed-empty-state-root";
import { LogoSpinner } from "@/components/common/logo-spinner";
// hooks
import { useCycle } from "@/hooks/store/use-cycle";
import { useWorkspace } from "@/hooks/store/use-workspace";

const ActiveCycleItem = observer(function ActiveCycleItem({
  cycle,
  workspaceSlug,
}: {
  cycle: ICycle;
  workspaceSlug: string;
}) {
  const { handleFiltersUpdate, cycle: activeCycle, cycleIssueDetails } = useCyclesDetails({
    workspaceSlug,
    projectId: cycle.project_id,
    cycleId: cycle.id,
  });

  return (
    <div className="flex flex-col border-b border-custom-border-200">
      <CyclesListItem
        cycleId={cycle.id}
        workspaceSlug={workspaceSlug}
        projectId={cycle.project_id}
        className="!border-b-transparent"
      />
      <Row className="bg-custom-background-100 pt-3 pb-6">
        <div className="grid grid-cols-1 bg-custom-background-100 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <ActiveCycleProgress
            handleFiltersUpdate={handleFiltersUpdate}
            projectId={cycle.project_id}
            workspaceSlug={workspaceSlug}
            cycle={activeCycle ?? cycle}
          />
          <ActiveCycleProductivity
            workspaceSlug={workspaceSlug}
            projectId={cycle.project_id}
            cycle={activeCycle ?? cycle}
          />
          <ActiveCycleStats
            workspaceSlug={workspaceSlug}
            projectId={cycle.project_id}
            cycle={activeCycle ?? cycle}
            cycleId={cycle.id}
            handleFiltersUpdate={handleFiltersUpdate}
            cycleIssueDetails={cycleIssueDetails}
          />
        </div>
      </Row>
    </div>
  );
});

export const WorkspaceActiveCyclesRoot = observer(function WorkspaceActiveCyclesRoot() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const { currentWorkspace } = useWorkspace();
  const { fetchWorkspaceCycles, cycleMap } = useCycle();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCycleIds, setActiveCycleIds] = useState<string[]>([]);

  const workspaceSlug = currentWorkspace?.slug;
  const activeCycleResolvedPath = resolvedTheme === "light" ? lightActiveCycleAsset : darkActiveCycleAsset;

  useEffect(() => {
    if (!workspaceSlug) return;
    setIsLoading(true);
    fetchWorkspaceCycles(workspaceSlug)
      .then((cycles) => {
        const activeIds = cycles.filter((c) => c.status === "current").map((c) => c.id);
        setActiveCycleIds(activeIds);
      })
      .finally(() => setIsLoading(false));
  }, [workspaceSlug, fetchWorkspaceCycles]);

  if (isLoading) {
    return (
      <div className="grid h-full w-full place-items-center">
        <LogoSpinner />
      </div>
    );
  }

  if (activeCycleIds.length === 0) {
    return (
      <ContentWrapper>
        <DetailedEmptyState
          title={t("project_cycles.empty_state.active.title")}
          description={t("project_cycles.empty_state.active.description")}
          assetPath={activeCycleResolvedPath}
        />
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      {activeCycleIds.map((cycleId) => {
        const cycle = cycleMap[cycleId];
        if (!cycle || !workspaceSlug) return null;
        return <ActiveCycleItem key={cycleId} cycle={cycle} workspaceSlug={workspaceSlug} />;
      })}
    </ContentWrapper>
  );
});
