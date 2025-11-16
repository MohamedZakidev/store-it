import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import { getAuthenticatedUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

async function layout({ children }: { children: React.ReactNode }) {
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser) {
    return redirect("/sign-in");
  }

  const { $id, accountId, fullName, email, avatar } = authenticatedUser;

  return (
    <div className="flex h-screen">
      <Sidebar fullName={fullName} email={email} avatar={avatar} />
      <div className="flex flex-col h-full flex-1">
        <MobileNav
          fullName={fullName}
          email={email}
          avatar={avatar}
          accountId={accountId}
          ownerId={$id}
        />
        <Header ownerId={$id} accountId={accountId} />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}

export default layout;
