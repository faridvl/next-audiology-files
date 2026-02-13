
import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { useRouter } from 'next/router';
import { CustomIcon, IconName } from '@/components/common/custom-icon/custom-icon';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { tailwind } from '@/utils/tailwind-utils';
import { Table } from '@/components/common/table/table';
import { Input } from '@/components/common/input/input';
import { Button, ButtonVariant } from '@/components/common/button/button';
import Router from 'next/router';
import { routesPrivate } from '@/shared/navigation/routes';


const columns = [
  { header: 'Nombre', accessor: 'name', width: '55%' },
  { header: 'Correo', accessor: 'email', width: '25%' },
  { header: 'Role', accessor: 'role', width: '25%' },
  { header: 'Estado', accessor: 'status', width: '25%' },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'Pending' },
  { id: 5, name: 'Tom Davis', email: 'tom@example.com', role: 'Admin', status: 'Active' },
  { id: 6, name: 'Sara Lee', email: 'sara@example.com', role: 'User', status: 'Inactive' },
  { id: 7, name: 'Mike Brown', email: 'mike@example.com', role: 'Editor', status: 'Active' },
  { id: 8, name: 'Emily Wilson', email: 'emily@example.com', role: 'User', status: 'Pending' },
  { id: 9, name: 'David Anderson', email: 'david@example.com', role: 'Admin', status: 'Active' },
  { id: 10, name: 'Olivia Taylor', email: 'olivia@example.com', role: 'User', status: 'Inactive' },
];

const actions = [
  {
    name: 'Edit',
    onClick: (row: any) => console.log('Edit action clicked', row),
  },
  {
    name: 'Delete',
    onClick: (row: any) => console.log('Delete action clicked', row),
  },
  {
    name: 'Ver',
    onClick: (row: any) => console.log('Delete action clicked', row),
  },
];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
    // Navegar a otra página si es necesario
    // window.location.href = `/details/${row.id}`;
  };
  return (
    <>
      <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title={'Titulo Home'}>
        {/* TODO(!): ADD THIS TO GENERIC SEARCH COMPONENT */}
        <div className="">
          <div className="bg-background rounded-lg shadow-md">
            <div className="flex items-center justify-between bg-muted/40 px-4 py-3">
              <Input
                variant="primary"
                type="text"
                placeholder="Warning Input"
                value={'hola'}
                onChange={(e: any) => console.log(e.target.value)}
              />
              {/* TODO(!): AGREGAR TEXTO AL ES.JS ACTIONS */}
              <Button
                variant={ButtonVariant.PRIMARY}
                text="Agregar"
                onClick={() => Router.push(routesPrivate.files.create)}
              />
            </div>
          </div>
          <div className="p-4 mt-10">
            <Table
              columns={columns}
              data={data}
              currentPage={1}
              totalRows={data.length}
              actions={actions}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = authorizeServerSidePage();


export default Home;
