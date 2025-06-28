import React, {useEffect, useState} from 'react';
import {Box, Dismiss, WorkingHoursFormList} from '../../components';
import {Header} from '../../components/Verification';

export const WorkingHours = () => {
  const [addMore, setAddMore] = useState<boolean>(false);

  useEffect(() => {
    if (addMore) {
      setAddMore(false);
    }
  }, [addMore]);
  return (
    <>
      <Dismiss
        rightButtonLabel="Add New Slot"
        rightButtonOnPress={() => setAddMore(true)}
      />
      <Box flex={1} mt="ll">
        <Header addDefault={false} title="Working Hours" summary=" " />
        <WorkingHoursFormList addMore={addMore} />
      </Box>
    </>
  );
};
