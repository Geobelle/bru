"use client";

import { Dispatch, SetStateAction } from "react";
import { MdCancel } from "react-icons/md";
import { useRef, useState } from "react";

type ModalProps = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Modal({ setIsModalOpen }: ModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const url = URL.createObjectURL(audioBlob);

      setAudioUrl(url);

      // Stop using the microphone
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="w-120 h-96 rounded-2xl bg-white p-6 shadow-xl relative">
      <h1 className="mb-4 text-xl font-bold text-orange-500">Add new record</h1>

      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute right-4 top-8"
      >
        <MdCancel className="text-orange-500" />
      </button>
      <div className="flex items-center justify-center mt-10">
        {!isRecording ? (
          <button
            className=" flex bg-orange-500 rounded-tl-2xl rounded-br-2xl rounded-tr-xs text-xs rounded-bl-xs text-white items-center shadow-md hover:px-6  px-5 py-2.5 h-fit w-fit"
            onClick={startRecording}
          >
            Start Recording
          </button>
        ) : (
          <button
            className=" flex bg-orange-500 rounded-tl-2xl rounded-br-2xl rounded-tr-xs text-xs rounded-bl-xs text-white items-center shadow-md hover:px-6  px-5 py-2.5 h-fit w-fit"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        )}

        {audioUrl && <audio controls src={audioUrl} />}
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <input
          placeholder="insert text here"
          className=" border w-4/5 h-30 text-base focus:outline-none rounded-sm  text-[#636363] bg-[#EEF2F4] border-[#E9AE9C] my-10 text-start"
          type="text"
        />
        <button className=" flex bg-orange-500 rounded-tl-2xl rounded-br-2xl rounded-tr-xs text-xs rounded-bl-xs text-white items-center shadow-md hover:px-6  px-5 py-2.5 h-fit w-fit">
          Save Recording
        </button>
      </div>
    </div>
  );
}
