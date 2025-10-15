import Image from "next/image";

function authLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <section className="bg-brand py-6 px-20 hidden w-1/2 lg:flex items-center xl:w-2/5">
                <div className="flex flex-col max-h-[800px] max-w-[430px] gap-12">
                    <Image
                        src={"/assets/icons/logo-full.svg"}
                        alt="logo"
                        width={48}
                        height={48}
                        className="w-60 h-auto"
                    />

                    <div className="space-y-5 text-white">
                        <h1 className="h1">Manage your files the best way</h1>
                        <p className="body-1">
                            Awesome, we&apos;ve created the perfect place for you to store all
                            your documents.
                        </p>
                    </div>
                    <Image
                        src={"/assets/images/files.png"}
                        alt="illistration image"
                        width={513}
                        height={513}
                        className="w-80 transition-all hover:rotate-2 hover:scale-105 self-center"
                    />
                </div>
            </section>

            <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:p-10 lg:py-0 lg:justify-center">
                <div className="mb-16 lg:hidden">
                    <Image src={'/assets/icons/logo-full-brand.svg'} alt="logo" width={224} height={82} className="h-auto w-[200px]" />
                </div>
                {children}
            </section>

        </div>
    );
}

export default authLayout;
