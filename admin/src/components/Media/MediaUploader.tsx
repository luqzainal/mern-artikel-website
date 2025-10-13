import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Progress } from '@nextui-org/react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const MediaUploader = () => {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/api/media/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setUploadProgress(percentCompleted);
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      showToast('File uploaded successfully!', 'success');
    },
    onError: () => {
      showToast('Error uploading file.', 'error');
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleUpload = async () => {
    for (const file of files) {
      await mutation.mutateAsync(file);
    }
    setFiles([]);
    setUploadProgress(0);
  };
  
  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragActive ? 'border-primary bg-primary-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {files.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {files.map(file => (
              <li key={file.name} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span>{file.name}</span>
                <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => removeFile(file.name)}>
                  <FiX />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            color="primary"
            className="mt-4"
            onPress={handleUpload}
            isLoading={mutation.isPending}
            isDisabled={files.length === 0}
          >
            Upload {files.length} file{files.length > 1 ? 's' : ''}
          </Button>
          {mutation.isPending && <Progress value={uploadProgress} className="mt-2" />}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
