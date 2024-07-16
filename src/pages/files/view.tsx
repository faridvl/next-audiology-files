import React from "react";
import Head from "next/head";
import { authorizeServerSidePage } from "@/hocs/auth";
import { DashboardLayout } from "@/components/common/layout/dashboard-layout";
import { BoxedLayoutStyle } from "@/components/common/layout/boxed-container/boxed-container";
import { ViewPatient } from "@/components/containers/view-patient/view-patient";

const AddPatient: React.FC = () => {
  // const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Ver Paciente</title>
      </Head>

      <DashboardLayout
        isMainPage
        contentStyle={BoxedLayoutStyle.FULL}
        title={"Datos Paciente"}
      >
        <ViewPatient />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();

export default AddPatient;
