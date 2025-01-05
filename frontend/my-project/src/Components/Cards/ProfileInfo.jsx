import { getIntials } from "../../utils/helper";

const ProfileInfo = ({ onLogOut }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-900 font-medium bg-slate-100">
        {getIntials("Johan Willam")}
      </div>
      <div className="">
        <p className="text-sm font-medium">Willam</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogOut}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
