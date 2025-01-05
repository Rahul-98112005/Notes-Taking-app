import NoteCard from "../../Components/Cards/NoteCard";
import Navbar from "../../Components/Navbar";
import { MdAdd } from 'react-icons/md' ;
const Home = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
        <NoteCard
          title="Going To Gym"
          date="01-12-2024"
          content="Going To GYM"
          tags="#Meeting"
          isPinned={true}
          onEdit={() => {}}
          onDelete={() => {}}
          onPinNote={() => {}}
        />
        <NoteCard
          title="Going To Gym"
          date="01-12-2024"
          content="Going To GYM"
          tags="#Meeting"
          isPinned={true}
          onEdit={() => {}}
          onDelete={() => {}}
          onPinNote={() => {}}
        />
        </div>
      </div>
      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10" onClick={() => {}}>
        <MdAdd className="text-[32px] text-white"/>
      </button>
    </>
  );
};

export default Home;
