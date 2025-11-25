import Image from "next/image";
import { Models } from "node-appwrite";
import FormattedDateTime from "../FormattedDateTime";
import Thumbnail from "../Thumbnail";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type shadreModalProps = {
  file: Models.DefaultRow;
  sharedEmails: string[];
  setSharedEmails: React.Dispatch<React.SetStateAction<string[]>>;
  removeSharedEmail: (email: string) => void;
};

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

function ShareModal({
  file,
  setSharedEmails,
  removeSharedEmail,
}: shadreModalProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const emails = value.split(",").map((email) => email.trim());
    setSharedEmails(emails);
  }
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={handleChange}
          className="share-input-field"
        />
      </div>
      <div className="pt-4">
        <div className="flex justify-between">
          <p className="subtitle-2 text-light-100">Shared with</p>
          <p className="subtitle-2 text-light-200">{file.users.length} users</p>
        </div>
        <ul className="pt-2">
          {file.users.map((email: string) => (
            <li key={email} className="flex items-center justify-between gap-2">
              <p className="subtitle-2">{email}</p>
              <Button
                onClick={() => removeSharedEmail(email)}
                className="share-remove-user"
              >
                <Image
                  src="/assets/icons/remove.svg"
                  alt="Remove icon for shared emails"
                  width={24}
                  height={24}
                  className="remove-icon"
                />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ShareModal;
