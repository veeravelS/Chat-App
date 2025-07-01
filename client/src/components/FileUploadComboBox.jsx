import { Paperclip } from 'lucide-react';
import { useState, useRef } from 'react';
import { FiImage, FiVideo,FiCheck } from 'react-icons/fi';

const FileUploadComboBox = ({ onImageSelect, onVideoSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const fileInputRef = useRef(null);

  const fileTypes = [
    {
      value: 'image',
      label: 'Image',
      icon: <FiImage className="mr-2 h-4 w-4" />,
      accept: 'image/*'
    },
    {
      value: 'video',
      label: 'Video',
      icon: <FiVideo className="mr-2 h-4 w-4" />,
      accept: 'video/*'
    }
  ];

  const handleSelect = (selectedValue) => {
    const type = fileTypes.find(t => t.value === selectedValue);
    setValue(selectedValue);
    setOpen(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.accept = type.accept;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (value === 'image') {
      onImageSelect({ target: { files: [file] } });
    } else if (value === 'video') {
      onVideoSelect({ target: { files: [file] } });
    }

    // Reset for next selection
    e.target.value = '';
  };

  return (
    <div className="relative w-[40px]">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Combobox Button */}
     <button
              onClick={() => {setOpen(!open); fileInputRef.current.accept = '';}}
              className="flex justify-center items-center w-12 h-12 rounded-full hover:bg-[#286459] hover:text-white"
            >
              <Paperclip />
            </button>

      {/* Dropdown Menu */}
      {open && (
        <div className={`
          absolute z-50 mt-1 -top-20 left-2 w-full min-w-[8rem]
          bg-popover text-popover-foreground
          border border-input rounded-md shadow-lg
          animate-in fade-in-80
        `}>
          <div className="p-1">
            {fileTypes.map((type) => (
              <div
                key={type.value}
                className={`
                  relative flex items-center px-2 py-1.5 text-sm
                  rounded-sm cursor-default select-none
                  hover:bg-accent hover:text-accent-foreground
                  outline-none focus:bg-accent focus:text-accent-foreground
                `}
                onClick={() => handleSelect(type.value)}
              >
                {type.icon}
                <span className="ml-2">{type.label}</span>
                {value === type.value && (
                  <FiCheck className="ml-auto h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default FileUploadComboBox;