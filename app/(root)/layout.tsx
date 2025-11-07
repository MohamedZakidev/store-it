import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import { getAuthunticatedUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

async function layout({ children }: { children: React.ReactNode }) {
  const authenticatedUser = await getAuthunticatedUser();
  console.log(authenticatedUser)
  if (!authenticatedUser) {
    return redirect("/sign-in")
  }
  const { fullName, email, avatar } = authenticatedUser
  return (
    <main className="flex h-screen">
      <Sidebar
        fullName={fullName}
        email={email}
        avatar={avatar}
      />
      <section className="flex flex-col h-full flex-1">
        <MobileNav />
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}

export default layout;
