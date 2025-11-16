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
import { renameFile } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
import DetailsModal from "./actionsModals/DetailsModal";
import RenameModal from "./actionsModals/RenameModal";
import { Button } from "./ui/button";

function FileActionsDropdown({ file }: { file: Models.DefaultRow }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [fileName, setFileName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);

  const path = usePathname();

  const actionsModal = ["rename", "share", "details", "delete"];

  function closeAllModals() {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setFileName(file.name);
    // setIsLoading(false);
    //setEmails([]);
  }

  async function handleAction() {
    setIsLoading(true);
    try {
      switch (action?.value) {
        case "rename":
          return await renameFile({
            fileId: file.$id,
            newName: fileName,
            extentstion: file.extension,
            path: path,
          });

        case "share":
        // return await shareFile(...);

        case "delete":
        // return await deleteFile(...);

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
    if (actionsModal.includes(item.value)) {
      setIsModalOpen(true);
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
