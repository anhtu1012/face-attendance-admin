"use client";

import LayoutContent from "../layoutContent";
import "./style.scss";

export interface IPanelTemplatesPopoverProps {
  layoutType: number;
  toggleInput: boolean[];
  setToggleInput: React.Dispatch<React.SetStateAction<boolean[]>>;
  closePopover: () => void;
  hideContent?: number;
}

export default function PanelTemplatesPopover({
  layoutType,
  toggleInput,
  setToggleInput,
  // closePopover,
  hideContent,
}: IPanelTemplatesPopoverProps) {
  // const [checkAll, setCheckAll] = useState(false);

  // Function to handle individual toggle state changes
  const handleToggleInput = (index: number) => {
    setToggleInput((prev) => {
      const newToggle = [...prev];
      newToggle[index] = !newToggle[index];
      return newToggle;
    });
  };

  // Function to handle the switch (select/deselect all)
  // const handleSwitch = () => {
  //   let toggle = true;
  //   if (checkAll) {
  //     toggle = false;
  //   }
  //   setToggleInput(toggleInput.map(() => toggle)); // Set all to the same state
  //   setCheckAll(toggle); // Update checkAll state based on toggle
  //   closePopover();
  // };

  // Effect to check if all toggles are true or not, update checkAll accordingly
  // useEffect(() => {
  //   const allChecked = toggleInput.every((val) => val === true);
  //   const anyUnchecked = toggleInput.some((val) => val === false);

  //   if (allChecked) {
  //     setCheckAll(true); // All are checked, so enable the switch
  //   } else if (anyUnchecked) {
  //     setCheckAll(false); // If any checkbox is unchecked, disable the switch
  //   }
  // }, [toggleInput]);

  const heightSetting = [7, 8, 9, 10, 6, 13].includes(layoutType)
    ? 200
    : [3, 4, 14, 11, 12, 113].includes(layoutType)
    ? 150
    : layoutType === 15
    ? 120
    : 80;

  return (
    <div
      className="template-card"
      style={{
        width: 240,
        height: heightSetting,
        overflow: "auto",
        maxHeight: "300px",
      }}
    >
      <LayoutContent
        layoutType={layoutType}
        content1={
          <div onClick={() => handleToggleInput(0)} className="content conten1">
            <input
              className="checkbox"
              type="checkbox"
              checked={toggleInput[0]}
              readOnly
            />
          </div>
        }
        content2={
          <div onClick={() => handleToggleInput(1)} className="content conten2">
            <input
              className="checkbox"
              type="checkbox"
              checked={toggleInput[1]}
              readOnly
            />
          </div>
        }
        content3={
          <div onClick={() => handleToggleInput(2)} className="content conten3">
            <input
              className="checkbox"
              type="checkbox"
              checked={toggleInput[2]}
              readOnly
            />
          </div>
        }
        content4={
          hideContent === 4 ? null : (
            <div
              onClick={() => handleToggleInput(3)}
              className="content conten4"
            >
              <input
                className="checkbox"
                type="checkbox"
                checked={toggleInput[3]}
                readOnly
              />
            </div>
          )
        }
      />
      {/* <div className="checkbox-wrapper-14">
        <input
          id="s1-14"
          type="checkbox"
          className="switch"
          checked={checkAll}
          onChange={handleSwitch}
        />
        <label htmlFor="s1-14">Chọn tất cả</label>
      </div> */}
    </div>
  );
}
