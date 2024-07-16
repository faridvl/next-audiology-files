import {
  Typography,
  TypographyVariant,
} from "@/components/common/typography/typography";
import { TEXT } from "@/static/texts/i18n";
import React from "react";
import { useTranslation } from "react-i18next";

export function ViewPatient() {
  const { t } = useTranslation();
  return (
    <div className=" bg-white shadow-md rounded-lg grid justify-center ">
      <div className="border-solid">
        <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
          {t(TEXT.MENU.SIDEBAR.BUSINESS.NAME)}
        </Typography>
      </div>
    </div>
  );
}
