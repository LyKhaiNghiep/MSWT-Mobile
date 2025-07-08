import {useState} from 'react';

const useUpload = () => {
  const [documentUploaded, setDocumentUploaded] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<boolean>(false);
  const uploadDocument = () => {};

  return {uploadDocument, documentUploaded, uploadError};
};

export default useUpload;
