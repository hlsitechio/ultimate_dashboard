import React from 'react';
import { Button, Input, Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import { Plus, Search, FolderOpen, FileText, Trash2, Edit, PenLine, Tag, Calendar } from 'lucide-react';
import FileUploadModal from "../components/notes/FileUploadModal";
import WriteNoteModal from "../components/notes/WriteNoteModal";
import { useNotesStore } from '../store/notesStore';
import LoadingSpinner from '../components/LoadingSpinner';
import EmojiPicker from 'emoji-picker-react';

const Notes = () => {
  const { notes, loading, error, fetchNotes, removeNote } = useNotesStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedNote, setSelectedNote] = React.useState<any>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);

  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(notes.map(note => note.category || 'Uncategorized'));
    return Array.from(uniqueCategories);
  }, [notes]);

  const filteredNotes = React.useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = note.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || note.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchQuery, selectedCategory]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-danger">
        <p>Error loading notes: {error}</p>
        <Button color="primary" className="mt-4" onPress={fetchNotes}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-white">Notes</h1>
            <p className="text-sm text-gray-400">Organize and manage your notes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            color="secondary"
            startContent={<PenLine className="h-5 w-5" />}
            onPress={() => {
              setSelectedNote(null);
              setIsWriteModalOpen(true);
            }}
          >
            Write Note
          </Button>
          <Button
            color="primary"
            startContent={<Plus className="h-5 w-5" />}
            onPress={() => setIsUploadModalOpen(true)}
          >
            Upload Files
          </Button>
        </div>
      </div>

      <Card className="bg-background border-none">
        <CardBody className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className="text-gray-400" />}
                classNames={{
                  input: "bg-background text-white",
                  inputWrapper: "bg-background border-gray-800"
                }}
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  color="primary"
                  variant={selectedCategory === category ? "solid" : "flat"}
                  size="sm"
                  onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <Tabs 
            aria-label="Note filters"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-2 h-12",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            <Tab
              key="all"
              title={
                <div className="flex items-center space-x-2">
                  <span>All Notes</span>
                  <span className="text-small">({filteredNotes.length})</span>
                </div>
              }
            >
              <div className="grid gap-4 pt-4">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="bg-background/50 border border-gray-800 hover:border-primary transition-colors"
                  >
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <FileText className="h-6 w-6 text-primary" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-white">{note.name}</p>
                              {note.emoji && (
                                <span className="text-xl">{note.emoji}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(note.created_at)}
                              </div>
                              {note.category && (
                                <div className="flex items-center gap-1">
                                  <Tag className="h-4 w-4" />
                                  {note.category}
                                </div>
                              )}
                              <div>
                                {note.file_type} • {(note.file_size / 1024).toFixed(2)} KB
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            variant="light"
                            onPress={() => {
                              setSelectedNote(note);
                              setIsWriteModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            isIconOnly
                            variant="light"
                            className="text-danger"
                            onPress={() => removeNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {note.content && (
                        <div className="mt-2 p-4 bg-background/30 rounded-lg">
                          <pre className="whitespace-pre-wrap font-sans text-sm text-white">
                            {note.content}
                          </pre>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </Tab>
            <Tab
              key="recent"
              title={
                <div className="flex items-center space-x-2">
                  <span>Recent</span>
                  <span className="text-small">
                    ({filteredNotes.filter(n => {
                      const date = new Date(n.created_at);
                      const now = new Date();
                      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }).length})
                  </span>
                </div>
              }
            />
            <Tab
              key="favorites"
              title={
                <div className="flex items-center space-x-2">
                  <span>Favorites</span>
                  <span className="text-small">
                    ({filteredNotes.filter(n => n.favorite).length})
                  </span>
                </div>
              }
            />
          </Tabs>
        </CardBody>
      </Card>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      
      <WriteNoteModal
        isOpen={isWriteModalOpen}
        onClose={() => {
          setIsWriteModalOpen(false);
          setSelectedNote(null);
          setIsEmojiPickerOpen(false);
        }}
        note={selectedNote}
        onEmojiSelect={(emoji) => {
          if (selectedNote) {
            setSelectedNote({ ...selectedNote, emoji });
          }
        }}
        isEmojiPickerOpen={isEmojiPickerOpen}
        onEmojiPickerToggle={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
      />
    </div>
  );
};

export default Notes;