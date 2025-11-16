import { logoutUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { Button } from "../ui/button";
import Search from "./Search";

type HeaderProps = {
  ownerId: string;
  accountId: string;
};

function Header({ ownerId, accountId }: HeaderProps) {
  return (
    <header className="header border-2 border-black">
      <Search />

      <div className="header-wrapper">
        <FileUploader ownerId={ownerId} accountId={accountId} />
        <form action={logoutUser}>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logout logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
}

export default Header;
