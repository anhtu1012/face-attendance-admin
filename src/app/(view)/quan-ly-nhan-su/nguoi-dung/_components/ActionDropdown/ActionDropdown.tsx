/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown, MenuProps } from "antd";
import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import "./ActionDropdown.scss";
import { FcKey } from "react-icons/fc";
import { RiUserCommunityFill } from "react-icons/ri";

interface ActionDropdownProps {
  data: any;
  onChangePassword: (data: any) => void;
  onUpdateManager: (data: any) => void;
  onUpdateAccountStatus: (data: any) => void;
}

export function ActionDropdown({
  data,
  onChangePassword,
  onUpdateManager,
  onUpdateAccountStatus,
}: ActionDropdownProps) {
  const [open, setOpen] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "changePassword",
      label: "Đổi mật khẩu",
      icon: <FcKey />,
      onClick: () => {
        setOpen(false);
        onChangePassword(data);
      },
    },
    {
      key: "updateManager",
      label: "Cập nhật người quản lý",
      icon: <RiUserCommunityFill />,
      onClick: () => {
        setOpen(false);
        onUpdateManager(data);
      },
    },
    {
      key: "updateStatus",
      label: "Cập nhật trạng thái tài khoản",
      icon: <IoSettingsOutline />,
      onClick: () => {
        setOpen(false);
        onUpdateAccountStatus(data);
      },
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
    >
      <div className="action-dropdown-trigger">
        <IoSettingsOutline />
      </div>
    </Dropdown>
  );
}
