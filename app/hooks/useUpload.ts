import storage from '@react-native-firebase/storage';
import {useState} from 'react';
import {localStore} from '../data';

const useUpload = () => {
  const [documentUploaded, setDocumentUploaded] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<boolean>(false);
  const {qualification, addSelfie, addQualification, selfie} = localStore();
  const uploadDocument = () => {
    [selfie, qualification].map((filePath, index: number) => {
      const extension = filePath.split('.').pop();
      const reference = storage().ref(
        `${Math.floor(Math.random() * Date.now()).toString(16)}.${extension}`,
      );

      const task = reference.putFile(filePath);

      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });

      task
        .then(async () => {
          const imageRemoteUrl: string = await reference.getDownloadURL();
          if (index === 0) {
            addSelfie(imageRemoteUrl);
          } else {
            addQualification(imageRemoteUrl);
            setDocumentUploaded(true);
          }
        })
        .catch(() => setUploadError(true));
    });
  };

  return {uploadDocument, documentUploaded, uploadError};
};

export default useUpload;
