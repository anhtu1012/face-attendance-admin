/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionDropdown } from "../ActionDropdown/ActionDropdown";

interface ActionCellRendererProps {
  data: any;
  context: {
    onViewDetail?: (data: any) => void;
    onChangePassword?: (data: any) => void;
    onUpdateManager?: (data: any) => void;
    onUpdateAccountStatus?: (data: any) => void;
  };
}

/**
 * ActionCellRenderer Component
 * Custom cell renderer for the action column
 */
export function ActionCellRenderer({ data, context }: ActionCellRendererProps) {
  if (!data) return null;

  return (
    <ActionDropdown
      data={data}
      onViewDetail={context.onViewDetail}
      onChangePassword={context.onChangePassword || (() => {})}
      onUpdateManager={context.onUpdateManager || (() => {})}
      onUpdateAccountStatus={context.onUpdateAccountStatus || (() => {})}
    />
  );
}
