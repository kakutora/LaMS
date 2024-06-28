import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
export default function RootLayout({ children, user }) {
  return (
    <>
      <Header user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
