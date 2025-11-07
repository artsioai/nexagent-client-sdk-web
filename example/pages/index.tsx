import dynamic from "next/dynamic";

const NexAgentDemo = dynamic(
  () => import("../components/NexAgentDemo"),
  { ssr: false }
);

export default function Home() {
  return <NexAgentDemo />;
}
