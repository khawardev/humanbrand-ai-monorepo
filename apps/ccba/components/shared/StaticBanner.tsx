import { Blur, BlurDelay } from "./MagicBlur"
import { Badge } from "../ui/badge"

const StaticBanner = ({ title, badge }: { title: string, badge: string }) => {
    return (
        <div className="relative select-none py-14">
            <section className=' text-center flex-col space-y-4 '>
                <Blur>
                    <Badge>{badge}</Badge>
                </Blur>
                <BlurDelay>
                    <h1 className=" text-5xl  font-medium capitalize text-center w-full  ">{title}</h1>
                </BlurDelay>
            </section>
        </div>
    )
}
export default StaticBanner