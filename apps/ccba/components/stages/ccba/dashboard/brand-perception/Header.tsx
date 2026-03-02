import { Card } from "@/components/ui/card";

interface HeaderProps {
    title: string;
    subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps ) {
    return (
        <header className=" mb-8">
            <h1 className="text-3xl font-bold text-foreground">
                {title}
            </h1>
            <p className=' text-lg text-muted-foreground'>
                {subtitle}
            </p>
        </header>
    );
}