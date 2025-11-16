import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Models } from "node-appwrite";
import FormattedDateTime from "../FormattedDateTime";
import Thumbnail from "../Thumbnail";

function ImageThumbnail({ file }: { file: Models.DefaultRow }) {
  return (
    <div className="file-details-thumbnail">
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />
      <div className="flex flex-col">
        <p className="subtitle-2 mb-1">{file.name}</p>
        <FormattedDateTime date={file.$createdAt} className="caption" />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <p className="file-details-label">{label}</p>
      <p className="file-details-value">{value}</p>
    </div>
  );
}

function DetailsModal({ file }: { file: Models.DefaultRow }) {
  return (
    <>
      <ImageThumbnail file={file} />
      <DetailRow label="Format:" value={file.extension} />
      <DetailRow label="Size:" value={convertFileSize(file.size)} />
      <DetailRow label="Owner:" value={file.owner.fullName || "Anonymous"} />
      <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
    </>
  );
}

export default DetailsModal;
