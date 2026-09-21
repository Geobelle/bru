import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Welcome</h1>
      <Link
        href="/rec"
        className=" flex bg-orange-500 rounded-tl-2xl rounded-br-2xl rounded-tr-xs text-xs rounded-bl-xs text-white items-center shadow-md hover:px-6  px-5 py-2.5  w-fit"
      >
        {" "}
        Click to continue
      </Link>
    </div>
  );
}
