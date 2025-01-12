/* eslint-disable no-unused-vars */
import NoteCard from "../../Components/Cards/NoteCard";
import Navbar from "../../Components/Navbar";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../Components/ToastMessage/Toast";
import EmptyCard from "../../Components/EmptyCard/EmptyCard";
const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [userInfo, setuserInfo] = useState(null);
  const navigate = useNavigate();
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIssearch] = useState(false);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ""
    })

  }

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type
    })

  }

  

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setuserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status == 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/getallnotes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error. please try again");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.delete("/deleteNote/" + noteId, );
      if (response.data && !response.data.error) {
        showToastMessage("Notes Deleted Successfully", 'delete');
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error. please try again");
      }
    }
  }

  const onSearchNote = async (query) => {
   try {
    const response = await axiosInstance.get('/search-notes/', {
      params: { query },
    });
    if( response.data && response.data.notes)
    {
      setIssearch(true);
      setAllNotes(response.data.notes)
    }
   } catch(error) {
     console.log(error)
   }
  }
  const handleClearSearch = async (query) => {
   setIssearch(false);
   getAllNotes();
  }

  const handleIsPinned = async (notesData) => {

    const noteId = notesData._id;
    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
       "isPinned" : !notesData.isPinned,
      });
      if (response.data && response.data.note) {
        showToastMessage("Notes Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className="container mx-auto">
       {allNotes.length > 0 ? <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((items) => (
            <NoteCard
              key={items._id}
              title={items.title}
              date={items.createdOn}
              content={items.content}
              tags={items.tags}
              isPinned={items.isPinned}
              onEdit={() => handleEdit(items)}
              onDelete={() => {deleteNote(items)}}
              onPinNote={() => handleIsPinned(items)}
            />
          ))} 
        </div> : <EmptyCard/> }
           {/* <NoteCard
            title="Going To Gym"
            date="01-12-2024"
            content="Going To GYM"
            tags="Meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          /> */}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded mx-auto mt-14 p-5 overflow-Scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.message}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
