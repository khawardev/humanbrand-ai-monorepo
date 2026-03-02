import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" flex items-center justify-center h-[90vh]">
      <div className=" text-center ">
        <h1 className="text-3xl font-bold  tracking-tighter">404</h1>
        <p className="my-4">Could not find requested resource</p>
        <Link href="/"><Button >Go to Home</Button></Link>
      </div>
    </div>
  );
}
