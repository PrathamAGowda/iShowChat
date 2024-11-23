import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, ChevronLeft } from 'lucide-react';
import api from '../API/api';

const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const [description, setDescription] = useState('');
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation()
  const { username } = location.state

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateGroup = () => {
    const addGrp = async() => {
      if (groupName != '') {
        try {
          const res = await api.post('/create-group', { 'groupName' : groupName, 'description' : description }, { headers : { 'username' : username } })
          if (res.status) {
            navigate(-1)
          }
        }
        catch (e) {
          alert("Error in creating group")
        }
      }
    }

    addGrp()

  };

  return (
    <div className="grid grid-rows-[64px_1fr] grid-cols-[64px_1fr] min-h-screen h-screen w-full bg-gray-900">
      <div className="row-span-2 h-full bg-gray-800 py-6 px-2 shadow-lg overflow-hidden flex flex-col">
        <div className="h-16 -mt-2 mb-4 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-indigo-500" />
          </button>
        </div>
      </div>

      <div className="w-full h-16 min-h-[64px] bg-gray-800 shadow-md px-4 border-b border-gray-700">
        <div className="h-full flex items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-200">Create New Group</h2>
        </div>
      </div>

      <div className="w-full h-full bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="mb-6 flex flex-col items-center">
            <div
              onClick={handleAvatarClick}
              className="w-32 h-32 rounded-full cursor-pointer relative overflow-hidden mb-4"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Group Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">Change Avatar</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mb-4">
            <input 
              type="text"
              value={groupName}
              onChange={handleGroupNameChange}
              placeholder="Enter Group Name"
              className="w-full h-12 px-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-400"
            />
          </div>

          <div className="mb-4">
            <textarea 
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Group Description (Optional)"
              className="w-full h-24 px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-400"
            />
          </div>

          <button 
            onClick={handleCreateGroup}
            className="w-full h-12 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;