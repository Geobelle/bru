"use client";

import Link from "next/link";
import { useState } from "react";
import Modal from "../components/modal";

export default function Recorder({
  recordings = [],
}: {
  recordings: { voice: string; text: string }[];
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen(true);
  };

  console.log(recordings);

  return (
    <div className="flex flex-col flex-1 items-center justify-start mt-10 font-sans ">
      <div className="flex justify-around w-full mb-10">
        <h1 className="text-orange-500 w-fit font-bold text-xl">Recordings</h1>
        <button
          onClick={toggleModal}
          className=" flex bg-orange-500 rounded-tl-2xl rounded-br-2xl rounded-tr-xs text-xs rounded-bl-xs text-white items-center shadow-md hover:px-6  px-5 py-2.5 h-fit w-fit"
        >
          Add Recording
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Modal setIsModalOpen={setIsModalOpen} />
        </div>
      )}
      <section className="border-x border-t border-b mb-10 border-orange-600 w-4/5">
        <div className="flex justify-around items-center text-center bg-[#FFE7DC] font-bold text-[#323232] py-2">
          <h2 className="w-1/3">Recording</h2>
          <h2 className="w-2/3">Text</h2>
        </div>
        {recordings?.map((eachdata) => (
          <div
            key={eachdata.voice}
            className="flex gap-8 mt-3 justify-center text-center items-center w-full"
          >
            <audio controls src={eachdata.voice} className="w-1/3" />
            <p className="w-2/3">{eachdata.text}</p>
          </div>
        ))}
      </section>

      <Link
        href="/"
        className=" flex bg-orange-500 rounded-tl-2xl rounded-br-2xl rounded-tr-xs text-xs rounded-bl-xs text-white items-center shadow-md hover:px-6  px-5 py-2.5  w-fit"
      >
        Click to back
      </Link>
    </div>
  );
}
