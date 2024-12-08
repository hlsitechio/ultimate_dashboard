import React from 'react';
import { Card, CardBody, Button, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { HardDrive, Upload, Image as ImageIcon, File, Trash2, Plus, AlertTriangle, Play, Video, Download } from 'lucide-react';
import * as FileStorage from '../lib/fileStorage';

const Storage = () => {
  const [files, setFiles] = React.useState<FileStorage.StoredFile[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [fileToDelete, setFileToDelete] = React.useState<FileStorage.StoredFile | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<FileStorage.StoredFile | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const [storageUsage, setStorageUsage] = React.useState({ used: 0, total: 5 });
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(() => {
    loadFiles();
    updateStorageUsage();
  }, []);

  const loadFiles = async () => {
    try {
      const loadedFiles = await FileStorage.getFiles();
      setFiles(loadedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const updateStorageUsage = async () => {
    try {
      const usage = await FileStorage.getStorageInfo();
      setStorageUsage({
        used: Math.round(usage.used / (1024 * 1024 * 1024) * 100) / 100,
        total: Math.round(usage.total / (1024 * 1024 * 1024))
      });
    } catch (error) {
      console.error('Error getting storage info:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    setLoading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await FileStorage.saveFile(file);
      }
      
      await loadFiles();
      await updateStorageUsage();
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Storage quota might be exceeded.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      await FileStorage.deleteFile(fileToDelete.id);
      await loadFiles();
      await updateStorageUsage();
      setFileToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDownload = async (file: FileStorage.StoredFile) => {
    try {
      const data = await FileStorage.downloadFile(file.id);
      const blob = new Blob([data], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  const getFileIcon = (file: FileStorage.StoredFile) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-6 w-6 text-purple-500" />;
    }
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrive className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-white">Storage</h1>
            <p className="text-sm text-gray-400">Store and manage your files</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<Upload className="h-5 w-5" />}
          onPress={() => fileInputRef.current?.click()}
          isLoading={loading}
        >
          Upload Files
        </Button>
      </div>

      <Card className="bg-background border-none">
        <CardBody className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Storage Used</span>
              <span>{storageUsage.used}GB / {storageUsage.total}GB</span>
            </div>
            <Progress
              value={(storageUsage.used / storageUsage.total) * 100}
              color="primary"
              className="h-2"
            />
          </div>

          <div
            className={`min-h-[200px] border-2 border-dashed rounded-lg transition-colors ${
              dragOver ? 'border-primary bg-primary/10' : 'border-gray-700'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {files.length > 0 ? (
              <div className="grid gap-4 p-4">
                {files.map((file) => (
                  <Card key={file.id} className="bg-background/50">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {file.thumbnail ? (
                            <img
                              src={file.thumbnail}
                              alt="thumbnail"
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            getFileIcon(file)
                          )}
                          <div>
                            <p className="font-medium text-white">{file.name}</p>
                            <p className="text-sm text-gray-400">
                              {formatSize(file.size)} • {new Date(file.lastModified).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            variant="light"
                            onPress={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {file.type.startsWith('video/') && (
                            <Button
                              isIconOnly
                              variant="light"
                              onPress={() => setSelectedVideo(file)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            onPress={() => {
                              setFileToDelete(file);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400 text-center">
                  Drag and drop files here or click upload button
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        multiple
        accept="image/*,video/*,application/pdf"
      />

      {selectedFiles && (
        <div className="fixed bottom-6 right-6 bg-background p-4 rounded-lg shadow-lg">
          <p className="mb-2 text-white">
            {Array.from(selectedFiles).length} file(s) selected
          </p>
          <div className="flex gap-2">
            <Button
              color="danger"
              variant="light"
              onPress={() => setSelectedFiles(null)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleUpload}
              isLoading={loading}
            >
              Upload
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalContent className="bg-background">
          <ModalHeader className="text-white">Confirm Delete</ModalHeader>
          <ModalBody>
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-6 w-6 text-danger" />
              <p>Are you sure you want to delete "{fileToDelete?.name}"?</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Video Preview Modal */}
      <Modal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setSelectedVideo(null);
        }}
        size="4xl"
      >
        <ModalContent className="bg-background">
          <ModalHeader className="text-white">{selectedVideo?.name}</ModalHeader>
          <ModalBody className="p-0">
            {selectedVideo?.webViewLink && (
              <video
                src={selectedVideo.webViewLink}
                controls
                className="w-full h-auto max-h-[80vh] rounded-lg"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Storage;