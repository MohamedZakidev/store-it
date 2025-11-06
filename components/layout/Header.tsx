import Image from "next/image";
import FileUploader from "../FileUploader";
import Search from "./Search";

function Header() {
  return (
    <header className="header border-2 border-black">
      <Search />

      <div className="header-wrapper">
        <FileUploader />
        <form>
          <button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logout logo"
              width={24}
              height={24}
              className="w-6"
            />
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
