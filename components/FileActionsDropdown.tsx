"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import { ActionType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useState } from "react";
import { DialogFooter } from "./ui/dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteFile,
  renameFile,
  updateSharedUsersFile,
} from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
import DeleteModal from "./actionsModals/DeleteModal";
import DetailsModal from "./actionsModals/DetailsModal";
import RenameModal from "./actionsModals/RenameModal";
import ShareModal from "./actionsModals/ShareModal";
import { Button } from "./ui/button";

function FileActionsDropdown({ file }: { file: Models.DefaultRow }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [fileName, setFileName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [sharedEmails, setSharedEmails] = useState<string[]>([]);

  const path = usePathname();

  const dropdownActions = ["rename", "share", "details", "delete"];

  function closeAllModals() {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setFileName(file.name);
  }

  async function handleAction() {
    setIsLoading(true);
    try {
      switch (action?.value) {
        case "rename":
          return await renameFile({
            fileId: file.$id,
            bucketFileId: file.bucketFileId,
            newName: fileName,
            extentstion: file.extension,
            path: path,
          });

        case "share":
          return await updateSharedUsersFile({
            fileId: file.$id,
            emails: sharedEmails,
            path: path,
          });

        case "delete":
          return await deleteFile({
            fileId: file.$id,
            bucketFileId: file.bucketFileId,
            path: path,
          });

        default:
          // If no valid action, do nothing
          return;
      }
    } finally {
      // This ALWAYS runs, even if the used case has `return`
      setIsLoading(false);
      closeAllModals();
    }
  }

  function handleDropdownItem(item: ActionType) {
    setAction(item);
    if (dropdownActions.includes(item.value)) {
      setIsModalOpen(true);
    }
  }

  async function removeSharedEmail(email: string) {
    const updatedEmails = sharedEmails.filter((e) => e !== email);
    const updatedFile = await updateSharedUsersFile({
      fileId: file.$id,
      emails: updatedEmails,
      path: path,
    });
    if (updatedFile) {
      setSharedEmails(updatedEmails);
      closeAllModals();
    }
  }

  function renderDialogContent() {
    if (!action) return null;
    const { value, label } = action;
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <RenameModal fileName={fileName} setFileName={setFileName} />
          )}
          {value === "details" && <DetailsModal file={file} />}
          {value === "share" && (
            <ShareModal
              file={file}
              sharedEmails={sharedEmails}
              setSharedEmails={setSharedEmails}
              removeSharedEmail={removeSharedEmail}
            />
          )}
          {value === "delete" && <DeleteModal fileName={file.name} />}
        </DialogHeader>
        {["rename", "share", "delete"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button
              className="capitalize modal-submit-button"
              onClick={handleAction}
              disabled={isLoading}
            >
              {value}
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loading spinner"
                  width={24}
                  height={24}
                  className="animate-spin h-auto"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="file actions"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              onClick={() => handleDropdownItem(actionItem)}
              className="shad-dropdown-item"
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={`stortit_${file.name}`}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
}

export default FileActionsDropdown;
