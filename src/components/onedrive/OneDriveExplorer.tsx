import React from 'react';
import { Card, Button, Input } from '@nextui-org/react';
import { Folder, File, Upload, FolderPlus, Trash2, Download, ChevronLeft } from 'lucide-react';
import { useOneDriveStore } from '../../store/oneDriveStore';
import { format } from 'date-fns';

const OneDriveExplorer = () => {
  const {
    files,
    currentPath,
    loading,
    error,
    initialize,
    uploadFile,
    listFiles,
    downloadFile,
    deleteFile,
    createFolder,
    setCurrentPath,
  } = useOneDriveStore();

  const [newFolderName, setNewFolderName] = React.useState('');
  const [showNewFolderInput, setShowNewFolderInput] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await uploadFile(e.target.files[0]);
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await createFolder(newFolderName);
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleNavigateToFolder = async (folderName: string) => {
    const newPath = currentPath === '/' ? `/${folderName}/` : `${currentPath}${folderName}/`;
    setCurrentPath(newPath);
    await listFiles(newPath);
  };

  const handleNavigateUp = async () => {
    if (currentPath === '/') return;
    const newPath = currentPath.split('/').slice(0, -2).join('/') + '/';
    setCurrentPath(newPath);
    await listFiles(newPath);
  };

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-danger mb-4">{error}</p>
        <Button color="primary" onPress={() => initialize()}>
          Reconnect to OneDrive
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">OneDrive Files</h2>
          <p className="text-sm text-gray-400">{currentPath}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            color="primary"
            variant="flat"
            startContent={<Upload className="h-4 w-4" />}
            onPress={() => fileInputRef.current?.click()}
          >
            Upload File
          </Button>
          <Button
            color="primary"
            variant="flat"
            startContent={<FolderPlus className="h-4 w-4" />}
            onPress={() => setShowNewFolderInput(true)}
          >
            New Folder
          </Button>
          {currentPath !== '/' && (
            <Button
              isIconOnly
              variant="flat"
              onPress={handleNavigateUp}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showNewFolderInput && (
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <Button color="primary" onPress={handleCreateFolder}>
            Create
          </Button>
          <Button variant="flat" onPress={() => setShowNewFolderInput(false)}>
            Cancel
          </Button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="grid gap-4">
        {files.map((file) => (
          <Card
            key={file.id}
            className="p-4 bg-background"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {file.folder ? (
                  <Folder className="h-6 w-6 text-primary" />
                ) : (
                  <File className="h-6 w-6 text-blue-500" />
                )}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {file.folder 
                      ? `${file.folder.childCount} items`
                      : `${(file.size / 1024).toFixed(2)} KB • ${format(new Date(file.lastModifiedDateTime), 'MMM d, yyyy')}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {file.folder ? (
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => handleNavigateToFolder(file.name)}
                  >
                    Open
                  </Button>
                ) : (
                  <>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => downloadFile(file.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      onPress={() => deleteFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OneDriveExplorer;