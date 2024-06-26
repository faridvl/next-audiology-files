import React from 'react';
import { authorizeServerSidePage } from '@/hocs/auth'; 

const Index: React.FC = () => null;

export default Index;

export const getServerSideProps = authorizeServerSidePage();
