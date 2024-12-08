import React from 'react';
import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";

const SearchOverlay = () => {
  return (
    <div className="flex-1 max-w-md">
      <Input
        type="text"
        placeholder="Search..."
        startContent={<Search className="text-gray-400" />}
        classNames={{
          input: "bg-background/50 text-white",
          inputWrapper: "bg-background/50 border-gray-800 hover:border-gray-700 focus-within:border-primary"
        }}
      />
    </div>
  );
};

export default SearchOverlay;