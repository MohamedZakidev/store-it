import { getFileIcon } from "@/lib/utils";
import Image from "next/image";

type ThumbnailProps = {
    type: string;
    extension: string;
    url?: string,
    className?: string
    imgClassName?: string
}

function Thumbnail({ type, extension, url = "", className, imgClassName }: ThumbnailProps) {
    const isImage = type === "image" && extension !== 'svg'
    return (
        <figure className={`thumbnail ${className}`}>
            <Image
                src={isImage ? url : getFileIcon(type, extension)}
                alt="thumbnail"
                width={100}
                height={100}
                className={`size-8 object-contain ${isImage && 'thumbnail-image'} ${imgClassName}`}
            />
        </figure>
    )
}

export default Thumbnail