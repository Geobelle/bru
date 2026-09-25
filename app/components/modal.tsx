"use client";

import { Dispatch, SetStateAction } from "react";
import { MdCancel } from "react-icons/md";
import { useRef, useState } from "react";
import { upload } from "@imagekit/next";

type ModalProps = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Modal({ setIsModalOpen }: ModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [text, setText] = useState("");

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

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const audioUrl = await uploadAudio(audioBlob);

      setAudioUrl(audioUrl);

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

  const uploadAudio = async (audioBlob: Blob) => {
    const authResponse = await fetch("/api/upload-auth");

    if (!authResponse.ok) {
      throw new Error("Failed to get ImageKit authentication");
    }

    const { token, expire, signature, publicKey } = await authResponse.json();

    const response = await upload({
      file: audioBlob,
      fileName: `recording-${Date.now()}.webm`,
      token,
      expire,
      signature,
      publicKey,
      folder: "/recordings",
      useUniqueFileName: true,
    });

    return response.url;
  };

  const handleSave = async () => {
    const response = await fetch("/api/recordings/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voice: audioUrl,
        text,
      }),
    });

    const data = await response.json();
    window.location.reload();
  };

  return (
    <div className="w-120 h-96 rounded-2xl bg-white p-6 shadow-xl relative">
      <h1 className="mb-4 text-xl font-bold text-orange-500">Add new record</h1>

      <button
        type="button"
        onClick={() => setIsModalOpen(false)}
        className="absolute right-4 top-8"
      >
        <MdCancel className="text-orange-500" />
      </button>
      <div className="flex items-center justify-center mt-10">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center justify-center bg-orange-500 rounded-full w-16 h-16 shadow-md hover:scale-105 transition"
          >
            <div className="w-5 h-5 rounded-full bg-white" />
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center justify-center bg-orange-500 rounded-full w-16 h-16 shadow-md animate-pulse shadow-orange-300"
          >
            <div className="w-5 h-5 rounded-sm bg-white" />
          </button>
        )}

        {audioUrl && <audio controls src={audioUrl} />}
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <input
          onChange={(e) => setText(e.target.value)}
          placeholder="insert text here"
          className=" border w-4/5 h-20 text-base focus:outline-none rounded-sm  text-[#636363] bg-[#EEF2F4] border-[#E9AE9C] my-10 text-start"
          type="text"
        />
        <button
          onClick={handleSave}
          className=" flex bg-orange-500 rounded-tl-2xl rounded-br-2xl rounded-tr-xs text-xs rounded-bl-xs text-white items-center shadow-md hover:px-6  px-5 py-2.5 h-fit w-fit"
        >
          Save Recording
        </button>
      </div>
    </div>
  );
}
