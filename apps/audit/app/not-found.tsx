import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound(): React.JSX.Element {
  return (
    <div className=" flex items-center justify-center h-[80vh]">
      <div className=" text-center ">
        <h1 className="text-3xl mb-2 font-bold tracking-tighter">404</h1>
        <p className="my-3">Could not find requested resource</p>
        <Button  size={'sm'} asChild>
          <Link href="/"> Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
