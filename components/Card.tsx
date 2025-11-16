import { convertFileSize } from "@/lib/utils";
import Link from "next/link";
import { Models } from "node-appwrite";
import FileActionsDropdown from "./FileActionsDropdown";
import FormattedDateTime from "./FormattedDateTime";
import Thumbnail from "./Thumbnail";

type fileProps = {
  file: Models.DefaultRow;
};

async function Card({ file }: fileProps) {
  const { type, extension, url, size, name } = file;
  return (
    <Link href={url} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={type}
          extension={extension || ""}
          url={url || ""}
          className="!size-20"
          imgClassName="!size-11"
        />
        <div className="flex flex-col items-end justify-between">
          <FileActionsDropdown file={file} />
          <p className="body-1">{convertFileSize(size)}</p>
        </div>
      </div>
      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          By: {file.owner.fullName || "Anonymous"}
        </p>
      </div>
    </Link>
  );
}

export default Card;
