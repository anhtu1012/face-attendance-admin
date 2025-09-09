"use client";

import { useEffect, useState } from "react";
import setLanguageValue from "@/utils/servers/set-language-action";
import { Select } from "antd";
import Image from "next/image";
import "./index.scss";
import vi from "../../../public/assets/image/Flags.png"
import en from "../../../public/assets/image/FlagsE.png"
export default function LocaleSwitcher() {
  const [locale, setLocale] = useState<string>("vi"); // Default value
  const [mounted, setMounted] = useState(false);

  // Get cookie when component is mounted
  useEffect(() => {
    setMounted(true);
    const storedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("language="))
      ?.split("=")[1];

    if (storedLocale) {
      setLocale(storedLocale); // Update state when cookie is found
    }
  }, []);

  const handleChange = (value: string) => {
    setLanguageValue(value); // Call function to update language
    setLocale(value); // Update state when user selects new language
    document.cookie = `language=${value}; path=/`; // Update cookie
  };

  // Prevent hydration mismatch by rendering a simplified version before mounting
  if (!mounted) {
    return <div className="select" style={{ width: 98 }} />;
  }

  return (
    <div className="select">
      <Select
        value={locale}
        style={{ width: "98px" }}
        dropdownAlign={{ points: ["tr", "br"] }}
        dropdownRender={(menu) => <div className="custom-dropdown">{menu}</div>}
        onChange={handleChange}
        options={[
          {
            value: "en",
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Image
                  src={en}
                  alt="En"
                  width={35}
                  height={25}
                />
                <span
                  style={{
                    padding: "0px 5px",
                  }}
                >
                  Eng
                </span>
              </div>
            ),
          },
          {
            value: "vi",
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Image
                  src={vi}
                  alt="Vied"
                  width={35}
                  height={25}
                />
                <span
                  style={{
                    padding: "0px 5px",
                  }}
                >
                  Vie
                </span>
              </div>
            ),
          },
        ]}
        dropdownStyle={{ minWidth: 130 }}
      />
    </div>
  );
}
