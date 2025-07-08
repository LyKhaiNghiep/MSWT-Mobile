import React from 'react';
import {ManagerHome} from '../../components/Home/ManagerHome';
import {SupervisorHome} from '../../components/Home/SupervisorHome';
import {WorkerHome} from '../../components/Home/WorkerHome';
import {useAuth} from '../../contexts/AuthContext';

export const Home = () => {
  const {user} = useAuth();
  console.log(user);
  return (
    <>
      {user?.role === 'Manager' && <ManagerHome />}
      {user?.role === 'Supervisor' && <SupervisorHome />}
      {user?.role === 'Worker' && <WorkerHome />}
    </>
  );
};
