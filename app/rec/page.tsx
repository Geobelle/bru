import Recorder from "../components/recorder";

export default async function Rec() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recordings/listAll`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recordings");
  }

  const recordings = await response.json();

  return <Recorder recordings={recordings.data} />;
}
