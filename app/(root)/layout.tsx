import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import { getAuthunticatedUser } from "@/lib/actions/user.actions";

function layout({ children }: { children: React.ReactNode }) {
  const user = getAuthunticatedUser();
  // console.log(user, "user");
  return (
    <main className="flex h-screen">
      <Sidebar />
      <section className="flex flex-col h-full flex-1">
        <MobileNav />
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}

export default layout;
