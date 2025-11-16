import { Input } from "../ui/input";

function RenameModal({
  fileName,
  setFileName,
}: {
  fileName: string;
  setFileName: (name: string) => void;
}) {
  return (
    <Input
      type="text"
      value={fileName}
      onChange={(e) => setFileName(e.target.value)}
    />
  );
}

export default RenameModal;
