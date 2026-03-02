'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ContainerLg } from '../shared/Containers'
import { Blur, BlurDelay, BlurDelay2 } from '../shared/MagicBlur'
import LaserFlow from '../ui/react-bits/LaserFLow/LaserFlow'
export default function HeroSection() {
    return (
        <ContainerLg>
            <Blur className="max-w-2xl  text-balance tracking-tighter text-5xl font-medium md:text-6xl ">
                From Static Guidelines to Living System
            </Blur>
            <BlurDelay className=" max-w-2xl text-pretty text-muted-foreground md:text-2xl text-lg ">
                Humanbrand AI is the Brand OS that transforms static brand guidelines into a living, operational system delivering instant clarity, always on brand content at scale, and continuous evolution driven by real time intelligence.
            </BlurDelay>
            <BlurDelay2 className=" flex items-center gap-2">
                <Button asChild size={'lg'}>
                    <Link href="/login">
                        Get Started
                    </Link>
                </Button>
            </BlurDelay2>
            <div className='mt-70 '>

            <LaserFlow
                horizontalBeamOffset={0.1}
                verticalBeamOffset={0}
                />
            </div>

        </ContainerLg>
    )
}


