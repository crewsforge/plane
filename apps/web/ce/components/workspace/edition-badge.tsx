import { observer } from "mobx-react";
// ui
import { useTranslation } from "@plane/i18n";
import { Tooltip } from "@plane/propel/tooltip";
// hooks
import { usePlatformOS } from "@/hooks/use-platform-os";
import packageJson from "package.json";

export const WorkspaceEditionBadge = observer(function WorkspaceEditionBadge() {
  // translation
  const { t } = useTranslation();
  // platform
  const { isMobile } = usePlatformOS();

  return (
    <Tooltip tooltipContent={`Version: v${packageJson.version}`} isMobile={isMobile}>
      <div
        className="w-fit min-w-24 rounded-2xl px-2 py-1 text-center text-sm font-medium outline-none text-custom-primary-200 bg-custom-primary-100/20"
        aria-label={t("aria_labels.projects_sidebar.edition_badge")}
      >
        v{packageJson.version}
      </div>
    </Tooltip>
  );
});
